import type { PgEnum } from 'drizzle-orm/pg-core';

/**
 * Converts a Drizzle `PgEnum` to an object with keys of the enum. Useful for creating a Typebox Enum.
 */
// biome-ignore lint/suspicious/noExplicitAny: Any is used to access inner type, which is strongly typed.
export type PgEnumToObject<T extends PgEnum<any>, TValue = string> = T extends PgEnum<
  infer TValues extends [string, ...string[]]
>
  ? {
      [Key in keyof TValues as TValues[Key] extends string ? TValues[Key] : never]: TValue;
    }
  : never;
