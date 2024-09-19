import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { auth } from '~/schema';
import { z } from 'zod';

const invitesRefine = {
  email: z.string().email(),
};
export const InviteInsertSchema = createInsertSchema(auth.invites, invitesRefine);
export const InviteSelectSchema = createSelectSchema(auth.invites, invitesRefine);
export type InviteInsert = z.infer<typeof InviteInsertSchema>;
export type InviteSelect = z.infer<typeof InviteSelectSchema>;
