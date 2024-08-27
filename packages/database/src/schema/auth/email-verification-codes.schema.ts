import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
