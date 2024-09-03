import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const EmailMfaCodesInsertSchema = createInsertSchema(auth.emailMfaCodes);
export const EmailMfaCodesSelectSchema = createSelectSchema(auth.emailMfaCodes);
export type EmailMfaCodesInsert = typeof EmailMfaCodesInsertSchema.static;
export type EmailMfaCodesSelect = typeof EmailMfaCodesSelectSchema.static;
