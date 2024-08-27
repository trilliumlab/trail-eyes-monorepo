import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { createId } from '@paralleldrive/cuid2';

export const loginTokens = pgTable('login_tokens', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
