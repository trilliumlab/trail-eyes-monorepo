import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const EmailMfaInsertSchema = createInsertSchema(auth.emailMfa);
export const EmailMfaSelectSchema = createSelectSchema(auth.emailMfa);
export type EmailMfaInsert = z.infer<typeof EmailMfaInsertSchema>;
export type EmailMfaSelect = z.infer<typeof EmailMfaSelectSchema>;
