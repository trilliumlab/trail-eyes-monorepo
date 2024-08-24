import type { Static, TObject } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import type { IfEquals, Narrow, Reverse, WithoutPrefixInsensitive } from '~/types';

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

/**
 * A typesafe way to remove a prefix from all fields on a Typebox object schema using Typebox transform.
 *
 * @param schema The object schema.
 * @param prefix The prefix to remove.
 * @returns The renamed schema.
 */
export function RemovePrefix<T extends TObject, TPrefix extends string>(
  schema: T,
  prefix: TPrefix,
) {
  return Type.Transform(schema)
    .Decode((v) => {
      const val = v as Record<string, unknown>;
      for (const [key, value] of Object.entries(val)) {
        if (key.toLowerCase().startsWith(prefix.toLowerCase())) {
          val[key.substring(prefix.length)] = value;
          delete val[key];
        }
      }
      return val as {
        [Key in keyof Static<T> as Key extends string
          ? WithoutPrefixInsensitive<Key, TPrefix>
          : never]: Static<T>[Key];
      };
    })
    .Encode((v) => {
      const val = v as Record<string, unknown>;
      for (const key of Object.keys(schema.properties)) {
        if (key.toLowerCase().startsWith(prefix.toLowerCase())) {
          val[key] = val[key.substring(prefix.length)];
          delete val[key.substring(prefix.length)];
        }
      }
      return v;
    });
}

/**
 * Creates a literal union from an array of literals.
 *
 * @param values The array of literals.
 * @returns A literal union consisting of all the literals.
 */
export const StringEnum = <T extends string[]>(values: [...T]) =>
  Type.Unsafe<T[number]>({
    type: 'string',
    enum: values,
  });
