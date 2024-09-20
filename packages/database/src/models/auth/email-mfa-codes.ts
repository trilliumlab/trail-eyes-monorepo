import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const EmailMfaCodesInsertSchema = createInsertSchema(auth.emailMfaCodes);
export const EmailMfaCodesSelectSchema = createSelectSchema(auth.emailMfaCodes);
export type EmailMfaCodesInsert = z.infer<typeof EmailMfaCodesInsertSchema>;
export type EmailMfaCodesSelect = z.infer<typeof EmailMfaCodesSelectSchema>;
