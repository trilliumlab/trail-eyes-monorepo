import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Tier 1 users don't have accounts, so account holders are tier 2 (hiker), 3
// (park staff), or 4 (admin - never created via signup, see auth.ts).
export const accountTierEnum = pgEnum('account_tier', ['2', '3', '4']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  tier: accountTierEnum('tier').notNull(),
  // Only meaningful for tier 3 (staff) - an admin must approve a staff
  // signup (after email verification) before it gets staff privileges.
  // Ignored for tiers 2 and 4.
  staffApproved: boolean('staff_approved').$defaultFn(() => false).notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(createId),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(createId),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
    withTimezone: true,
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey().$defaultFn(createId),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).$defaultFn(() => /* @__PURE__ */ new Date()),
});
