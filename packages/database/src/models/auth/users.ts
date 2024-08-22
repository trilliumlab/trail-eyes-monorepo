import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '~/schema';

const usersRefine = {
  email: Type.String({ format: 'email' }),
};
export const UserInsertSchema = createInsertSchema(auth.users, usersRefine);
export const UserSelectSchema = createSelectSchema(auth.users, usersRefine);
export type UserInsert = typeof UserInsertSchema.static;
export type UserSelect = typeof UserSelectSchema.static;
