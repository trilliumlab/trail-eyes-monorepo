import { randomBytes, randomInt } from 'node:crypto';
import type { PgEnum } from 'drizzle-orm/pg-core';
import { otpCodeLength } from '@repo/util/consts';

/**
 * Generates a 6 digit verification code.
 *
 * @returns The generated verification code as a string.
 */
export function createOtpCode() {
  return randomInt(10 ** otpCodeLength).toLocaleString('en-US', {
    minimumIntegerDigits: otpCodeLength,
    useGrouping: false,
  });
}

/**
 * Generates a random 48 byte token.
 *
 * @returns A randomly generated token as a base64 string.
 */
export function createToken() {
  return randomBytes(48).toString('base64');
}

/**
 * Converts a Drizzle `PgEnum` to an object with keys of the enum.
 */
// biome-ignore lint/suspicious/noExplicitAny: PgEnum reverses type variance. Type is checked in type conditional.
export type PgEnumToObject<T extends PgEnum<any>, TValue = string> = T extends PgEnum<
  infer TValues extends [string, ...string[]]
>
  ? {
      [Key in keyof TValues as TValues[Key] extends string ? TValues[Key] : never]: TValue;
    }
  : never;
