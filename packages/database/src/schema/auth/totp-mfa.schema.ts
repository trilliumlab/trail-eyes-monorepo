import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const totpMfa = pgTable('totp_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  secret: text('secret').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }).defaultNow().notNull(),
});
