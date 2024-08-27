import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '~/schema';
import { strongPasswordRegex } from '@repo/util/regex';

const usersRefine = {
  email: Type.String({ format: 'email' }),
};
export const UserInsertSchema = createInsertSchema(auth.users, usersRefine);
export const UserSelectSchema = createSelectSchema(auth.users, usersRefine);
export type UserInsert = typeof UserInsertSchema.static;
export type UserSelect = typeof UserSelectSchema.static;

export const UserCreateSchema = Type.Composite([
  UserInsertSchema,
  Type.Object({
    password: Type.RegExp(strongPasswordRegex),
  }),
]);
export type UserCreate = typeof UserCreateSchema.static;
