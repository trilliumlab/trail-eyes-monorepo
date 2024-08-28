import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const emailMfa = pgTable('email_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }).defaultNow().notNull(),
});
