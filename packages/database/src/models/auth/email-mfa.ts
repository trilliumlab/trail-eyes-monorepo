import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const EmailMfaInsertSchema = createInsertSchema(auth.emailMfa);
export const EmailMfaSelectSchema = createSelectSchema(auth.emailMfa);
export type EmailMfaInsert = typeof EmailMfaInsertSchema.static;
export type EmailMfaSelect = typeof EmailMfaSelectSchema.static;
