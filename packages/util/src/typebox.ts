import type { TSchema, StaticDecode, TObject, Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export function parse<T extends TSchema, R = StaticDecode<T>>(schema: T, value: unknown): R {
  const cloned = Value.Clone(value); // clone because value ops can be mutable
  const defaulted = Value.Default(schema, cloned); // initialize defaults for value
  const converted = Value.Convert(schema, defaulted); // convert mismatched types for value
  const cleaned = Value.Clean(schema, converted); // remove unknown properties
  return Value.Decode(schema, cleaned); // run decode transforms (optional)
}

// Narrows T to a literal
type Narrow<T> = { [Key in keyof T]: T[Key] };
// Type of T with the keys and values swapped
type Reverse<T extends Record<PropertyKey, PropertyKey | undefined>> = {
  [Key in keyof T as T[Key] extends PropertyKey ? T[Key] : never]: Key;
};
// Evaluates to Y if T and U are same type, otherwise evaluates to N
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N;

// Rename/map the fields on a TObject using objectbox transform.
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
