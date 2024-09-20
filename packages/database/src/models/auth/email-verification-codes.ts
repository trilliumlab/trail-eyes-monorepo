import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const EmailVerificationCodesInsertSchema = createInsertSchema(auth.emailVerificationCodes);
export const EmailVerificationCodesSelectSchema = createSelectSchema(auth.emailVerificationCodes);
export type EmailVerificationCodesInsert = z.infer<typeof EmailVerificationCodesInsertSchema>;
export type EmailVerificationCodesSelect = z.infer<typeof EmailVerificationCodesSelectSchema>;
