import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '../../schema';

export const SessionInsertSchema = createInsertSchema(auth.sessions);
export const SessionSelectSchema = createSelectSchema(auth.sessions);
export type SessionInsert = typeof SessionInsertSchema.static;
export type SessionSelect = typeof SessionSelectSchema.static;
