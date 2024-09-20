import { createId } from '@paralleldrive/cuid2';
import { integer, boolean, pgTable, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['developer', 'superAdmin', 'admin', 'volunteer', 'member']);

export const users = pgTable('users', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  email: text('email').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  verified: boolean('verified').default(false).notNull(),
  role: roleEnum('role').default('member').notNull(),
  inviteDate: timestamp('invite_data', { withTimezone: true }),
  registrationDate: timestamp('registration_date', { withTimezone: true }).defaultNow().notNull(),
  lastUpdateDate: timestamp('last_update_date', { withTimezone: true }).defaultNow().notNull(),
  lastLoginDate: timestamp('last_login_date', { withTimezone: true }).defaultNow().notNull(),
});

export const emailMfaCodes = pgTable('email_mfa_codes', {
  id: text('id')
    .$default(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  allowRefreshAt: timestamp('allow_refresh_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const emailMfa = pgTable('email_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }).defaultNow().notNull(),
});

export const emailVerificationCodes = pgTable('email_verification_codes', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  code: varchar('code', { length: 6 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  allowRefreshAt: timestamp('allow_refresh_at', { withTimezone: true }).notNull(),
  autoRefreshAt: timestamp('auto_refresh_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

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

export const passwords = pgTable('passwords', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  hash: text('hash').notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  confirmed: boolean('confirmed').default(false).notNull(),
});

export const totpMfa = pgTable('totp_mfa', {
  userId: text('user_id')
    .references(() => users.id)
    .primaryKey(),
  secret: text('secret').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }).defaultNow().notNull(),
});
