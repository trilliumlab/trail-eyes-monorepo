import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { createId } from '@paralleldrive/cuid2';

export const emailMfaCodes = pgTable('email_mfa_codes', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
