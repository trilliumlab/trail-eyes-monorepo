import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const emailVerificationCodes = pgTable('email_verification_codes', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  code: varchar('code', { length: 6 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  allowRefreshAt: timestamp('allow_refresh_at', { withTimezone: true }).notNull(),
  autoRefreshAt: timestamp('auto_refresh_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
