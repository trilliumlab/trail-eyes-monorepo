import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const totpMfa = pgTable('totp_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  secret: text('secret').notNull(),
});
