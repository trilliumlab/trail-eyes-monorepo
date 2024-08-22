import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const passwords = pgTable('passwords', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  hash: text('hash').notNull(),
});
