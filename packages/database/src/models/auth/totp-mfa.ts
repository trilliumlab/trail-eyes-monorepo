import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const TotpMfaInsertSchema = createInsertSchema(auth.totpMfa);
export const TotpMfaSelectSchema = createSelectSchema(auth.totpMfa);
export type TotpMfaInsert = z.infer<typeof TotpMfaInsertSchema>;
export type TotpMfaSelect = z.infer<typeof TotpMfaSelectSchema>;
