import type { TSchema, StaticDecode } from '@sinclair/typebox';
import { TransformDecodeCheckError, Value, ValueErrorType } from '@sinclair/typebox/value';

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
 * @param additionalVars Additional variables to be parsed.
 * @returns The validated env variables.
 */
export function parseEnv<T extends TSchema, R = StaticDecode<T>>(
  schema: T,
  envPath?: string,
  additionalVars?: Record<string, unknown>,
): R {
  try {
    return parse(schema, { ...process.env, ...additionalVars }); // run decode transforms (optional)
  } catch (e) {
    if (e instanceof TransformDecodeCheckError) {
      console.log(process.env);
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
