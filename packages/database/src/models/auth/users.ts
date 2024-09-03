import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '~/schema';
import { strongPasswordRegex } from '@repo/util/regex';

/**
 * Capitalizes the first letter of a string (respecting utf16 characters).
 *
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
function capitalizeFirstLetter(str: string) {
  const firstCodePoint = str.codePointAt(0);
  if (!firstCodePoint) return '';

  const index = firstCodePoint > 0xffff ? 2 : 1;

  return String.fromCodePoint(firstCodePoint).toUpperCase() + str.slice(index);
}

const usersRefine = {
  email: Type.Transform(Type.String({ format: 'email' }))
    .Decode((value) => value.toLowerCase())
    .Encode((value) => value.toLowerCase()),
  firstName: Type.Transform(Type.String({ minLength: 1 }))
    .Decode((value) => capitalizeFirstLetter(value.trim()))
    .Encode((value) => capitalizeFirstLetter(value.trim())),
  lastName: Type.Transform(Type.String({ minLength: 1 }))
    .Decode((value) => capitalizeFirstLetter(value.trim()))
    .Encode((value) => capitalizeFirstLetter(value.trim())),
};
export const UserInsertSchema = createInsertSchema(auth.users, usersRefine);
export const UserSelectSchema = createSelectSchema(auth.users, usersRefine);
export type UserInsert = typeof UserInsertSchema.static;
export type UserSelect = typeof UserSelectSchema.static;

export const UserCreateSchema = Type.Composite([
  UserInsertSchema,
  Type.Object({
    password: Type.String({ pattern: strongPasswordRegex.source }),
  }),
]);
export type UserCreate = typeof UserCreateSchema.static;
