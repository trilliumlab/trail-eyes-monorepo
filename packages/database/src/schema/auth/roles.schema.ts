import { pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const roleEnum = pgEnum('role', ['developer', 'superAdmin', 'admin', 'volunteer']);

export const roles = pgTable(
  'roles',
  {
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    role: roleEnum('role').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.role] }),
  }),
);
