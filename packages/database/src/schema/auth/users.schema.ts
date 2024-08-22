import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { roleEnum } from './role.schema';

export const users = pgTable('users', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  email: text('email').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  verified: boolean('verified').default(false).notNull(),
  role: roleEnum('role').default('member').notNull(),
  inviteDate: timestamp('registration_date', {
    withTimezone: true,
  }),
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
