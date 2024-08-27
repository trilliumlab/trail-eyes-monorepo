import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { roleEnum } from './role.schema';

export const invites = pgTable('invites', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  email: text('email').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: roleEnum('role').default('member').notNull(),
  inviteDate: timestamp('registration_date', { withTimezone: true }).defaultNow().notNull(),
});
