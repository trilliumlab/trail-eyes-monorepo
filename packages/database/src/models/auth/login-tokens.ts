import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const LoginTokenInsertSchema = createInsertSchema(auth.loginTokens);
export const LoginTokenSelectSchema = createSelectSchema(auth.loginTokens);
export type LoginTokenInsert = z.infer<typeof LoginTokenInsertSchema>;
export type LoginTokenSelect = z.infer<typeof LoginTokenSelectSchema>;
