import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { auth } from '~/schema';

const invitesRefine = {
  email: Type.String({ format: 'email' }),
};
export const InviteInsertSchema = createInsertSchema(auth.invites, invitesRefine);
export const InviteSelectSchema = createSelectSchema(auth.invites, invitesRefine);
export type InviteInsert = typeof InviteInsertSchema.static;
export type InviteSelect = typeof InviteSelectSchema.static;
