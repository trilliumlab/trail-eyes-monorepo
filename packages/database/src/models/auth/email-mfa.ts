import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { emailMfa } from '~/schema';

export const EmailMfaInsertSchema = createInsertSchema(emailMfa);
export const EmailMfaSelectSchema = createSelectSchema(emailMfa);
export type EmailMfaInsert = typeof EmailMfaInsertSchema.static;
export type EmailMfaSelect = typeof EmailMfaSelectSchema.static;
