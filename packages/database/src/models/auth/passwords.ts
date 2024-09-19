import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const PasswordInsertSchema = createInsertSchema(auth.passwords);
export const PasswordSelectSchema = createSelectSchema(auth.passwords);
export type PasswordInsert = z.infer<typeof PasswordInsertSchema>;
export type PasswordSelect = z.infer<typeof PasswordSelectSchema>;
