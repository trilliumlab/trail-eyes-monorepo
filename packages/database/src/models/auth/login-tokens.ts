import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const LoginTokenInsertSchema = createInsertSchema(auth.loginTokens);
export const LoginTokenSelectSchema = createSelectSchema(auth.loginTokens);
export type LoginTokenInsert = typeof LoginTokenInsertSchema.static;
export type LoginTokenSelect = typeof LoginTokenSelectSchema.static;
