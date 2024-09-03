import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const PasswordInsertSchema = createInsertSchema(auth.passwords);
export const PasswordSelectSchema = createSelectSchema(auth.passwords);
export type PasswordInsert = typeof PasswordInsertSchema.static;
export type PasswordSelect = typeof PasswordSelectSchema.static;
