import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { totpMfa } from '~/schema';

export const TotpMfaInsertSchema = createInsertSchema(totpMfa);
export const TotpMfaSelectSchema = createSelectSchema(totpMfa);
export type TotpMfaInsert = typeof TotpMfaInsertSchema.static;
export type TotpMfaSelect = typeof TotpMfaSelectSchema.static;
