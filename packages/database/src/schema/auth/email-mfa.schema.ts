import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const emailMfa = pgTable('email_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
});
