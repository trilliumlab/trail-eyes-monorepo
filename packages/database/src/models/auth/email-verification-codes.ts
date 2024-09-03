import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const EmailVerificationCodesInsertSchema = createInsertSchema(auth.emailVerificationCodes);
export const EmailVerificationCodesSelectSchema = createSelectSchema(auth.emailVerificationCodes);
export type EmailVerificationCodesInsert = typeof EmailVerificationCodesInsertSchema.static;
export type EmailVerificationCodesSelect = typeof EmailVerificationCodesSelectSchema.static;
