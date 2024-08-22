import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  email: text('email').unique().notNull(),
  verified: boolean('verified').default(false).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  lastUpdateDate: timestamp('last_update_date', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  lastLoginDate: timestamp('last_login_date', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
