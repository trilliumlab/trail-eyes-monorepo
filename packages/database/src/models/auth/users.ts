import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import {
  passwordLowercaseRegex,
  passwordNumericRegex,
  passwordSpecialRegex,
  passwordUppercaseRegex,
} from '@repo/util/regex';
import { z } from 'zod';

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
  email: z.string().min(1, 'Required').email('Invalid email').toLowerCase(),
  firstName: z
    .string()
    .min(1, 'Required')
    .transform((value) => capitalizeFirstLetter(value.trim())),
  lastName: z
    .string()
    .min(1, 'Required')
    .transform((value) => capitalizeFirstLetter(value.trim())),
};
export const UserInsertSchema = createInsertSchema(auth.users, usersRefine);
export const UserSelectSchema = createSelectSchema(auth.users, usersRefine);
export type UserInsert = z.infer<typeof UserInsertSchema>;
export type UserSelect = z.infer<typeof UserSelectSchema>;

export const UserCreateSchema = UserInsertSchema.extend({
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 characters' })
    .regex(passwordLowercaseRegex, { message: 'Password must include a lowercase character' })
    .regex(passwordUppercaseRegex, { message: 'Password must include an uppercase character' })
    .regex(passwordNumericRegex, { message: 'Password must include a number' })
    .regex(passwordSpecialRegex, { message: 'Password must include a special character' }),
});
export type UserCreate = z.infer<typeof UserCreateSchema>;

export const UserCredentialsSchema = UserCreateSchema.pick({
  email: true,
  password: true,
});
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
