import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import type { z } from 'zod';

export const SessionInsertSchema = createInsertSchema(auth.sessions);
export const SessionSelectSchema = createSelectSchema(auth.sessions);
export type SessionInsert = z.infer<typeof SessionInsertSchema>;
export type SessionSelect = z.infer<typeof SessionSelectSchema>;
