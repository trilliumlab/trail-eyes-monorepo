import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { emailMfaCodes } from '~/schema';

export const EmailMfaCodesInsertSchema = createInsertSchema(emailMfaCodes);
export const EmailMfaCodesSelectSchema = createSelectSchema(emailMfaCodes);
export type EmailMfaCodesInsert = typeof EmailMfaCodesInsertSchema.static;
export type EmailMfaCodesSelect = typeof EmailMfaCodesSelectSchema.static;
