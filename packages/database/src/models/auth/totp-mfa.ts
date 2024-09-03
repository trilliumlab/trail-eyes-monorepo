import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const TotpMfaInsertSchema = createInsertSchema(auth.totpMfa);
export const TotpMfaSelectSchema = createSelectSchema(auth.totpMfa);
export type TotpMfaInsert = typeof TotpMfaInsertSchema.static;
export type TotpMfaSelect = typeof TotpMfaSelectSchema.static;
