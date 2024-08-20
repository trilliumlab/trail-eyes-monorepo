import type { TSchema, StaticDecode, TObject, Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { TransformDecodeCheckError, Value, ValueErrorType } from '@sinclair/typebox/value';
import url from 'node:url';
import dotenv from 'dotenv';
import fs from 'node:fs';

/**
 * Parses a value from a Typebox schema.
 *
 * @param schema The Typebox schema.
 * @param value The value to parse.
 * @returns The parsed value.
 */
export function parse<T extends TSchema, R = StaticDecode<T>>(schema: T, value: unknown): R {
  const cloned = Value.Clone(value); // clone because value ops can be mutable
  const defaulted = Value.Default(schema, cloned); // initialize defaults for value
  const converted = Value.Convert(schema, defaulted); // convert mismatched types for value
  const cleaned = Value.Clean(schema, converted); // remove unknown properties
  return Value.Decode(schema, cleaned); // run decode transforms (optional)
}

/**
 * Parses env variables from a Typebox schema and provides helpful error messages for missing variables.
 *
 * @param schema The Typebox schema of the env variables to parse.
 * @param envPath The path to the .env file the variables are loaded from. Used to generate more detailed errors.
 * @param options.loadEnv  If true, then `envPath` will be read and variables will be parsed from there.
 * @returns The validated env variables.
 */
export function parseEnv<T extends TSchema, R = StaticDecode<T>>(
  schema: T,
  envPath?: string,
  { loadEnv = true }: { loadEnv?: boolean } = {},
): R {
  let customEnv = {};
  // If loadEnv is true, we should load the .env file and add it to the available variables.
  if (loadEnv && envPath) {
    const path = envPath.startsWith('file://') ? url.fileURLToPath(envPath) : envPath;
    const buffer = fs.readFileSync(path);
    customEnv = dotenv.parse(buffer);
  }

  try {
    return parse(schema, { ...process.env, ...customEnv }); // run decode transforms (optional)
  } catch (e) {
    if (e instanceof TransformDecodeCheckError) {
      const varName = e.error.path.substring(1);
      const varValue = e.error.value;
      const varType = e.error.schema.type;

      if (e.error.type === ValueErrorType.ObjectRequiredProperty) {
        // Missing property error
        console.error(`Missing required ENV variable '${varName}' of type '${varType}'.`);
        if (envPath) {
          console.error(`'${varName}' should be set in '${envPath}'.`);
          console.error(`See '${envPath}.example'.`);
        }
      } else if (e.error.message.toLowerCase().startsWith('expected')) {
        console.error(
          `Expected ENV variable '${varName}' to be of type '${varType}': value '${varValue}' cannot be coerced to ${varType}.`,
        );
        if (envPath) {
          console.error(`See '${envPath}.example'.`);
        }
      } else {
        console.error(e);
      }
    } else {
      console.error(e);
    }
    throw e;
  }
}

/**
 * Narrows `T` to a literal
 */
type Narrow<T> = { [Key in keyof T]: T[Key] };
/**
 * Type of `T` with the keys and values swapped
 */
type Reverse<T extends Record<PropertyKey, PropertyKey | undefined>> = {
  [Key in keyof T as T[Key] extends PropertyKey ? T[Key] : never]: Key;
};
/**
 * Evaluates to `Y` if `T` and `U` are same type, otherwise evaluates to `N`
 */
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N;

/**
 * A typesafe way to rename fields on a Typebox object schema using Typebox transform.
 *
 * @param schema The object schema.
 * @param map An object of fields to rename in the form `schemaName: 'newName'`.
 * @returns The renamed schema.
 */
export function RenameFields<T extends TObject, M extends { [Key in keyof Static<T>]?: string }>(
  schema: T,
  map: Narrow<M>,
) {
  type MReversed = Reverse<typeof map>;

  return Type.Transform(schema)
    .Decode((v) => {
      const val = v as Static<T>;
      for (const [key, value] of Object.entries(map)) {
        val[value] = val[key];
        delete val[key];
      }
      return val as {
        [Key in keyof MReversed as MReversed[Key] extends string
          ? IfEquals<Static<T>[MReversed[Key]], unknown, never, Key>
          : never]: MReversed[Key] extends string
          ? IfEquals<Static<T>[MReversed[Key]], unknown, never, Static<T>[MReversed[Key]]>
          : never;
      } & {
        [Key in keyof Static<T> as M[Key] extends string ? never : Key]: M[Key] extends string
          ? never
          : Static<T>[Key];
      };
    })
    .Encode((v) => {
      // biome-ignore lint/suspicious/noExplicitAny:
      const val = v as any;
      for (const [key, value] of Object.entries(map)) {
        val[key] = val[value];
        delete val[value];
      }
      return v;
    });
}
