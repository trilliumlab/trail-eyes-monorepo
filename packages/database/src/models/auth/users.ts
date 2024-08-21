import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { users } from '~/schema';

const usersRefine = {
  email: Type.String({ format: 'email' }),
};
export const UserInsertSchema = createInsertSchema(users, usersRefine);
export const UserSelectSchema = createSelectSchema(users, usersRefine);
export type UserInsert = typeof UserInsertSchema.static;
export type UserSelect = typeof UserSelectSchema.static;
