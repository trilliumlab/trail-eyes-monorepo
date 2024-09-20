import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import type { PgEnumToObject } from '~/utils';
import {
  passwordLowercaseRegex,
  passwordNumericRegex,
  passwordSpecialRegex,
  passwordUppercaseRegex,
} from '@repo/util/regex';
import { capitalizeFirstLetter } from '@repo/util';
import {
  emailMfaCodes,
  emailMfa,
  emailVerificationCodes,
  invites,
  loginTokens,
  passwords,
  type roleEnum,
  sessions,
  totpMfa,
  users,
} from '~/schema/auth';

// Role enum
export const roleEnumValues = {
  developer: { rank: 0, name: 'Developer' },
  superAdmin: { rank: 1, name: 'Super admin' },
  admin: { rank: 2, name: 'Admin' },
  volunteer: { rank: 3, name: 'Volunteer' },
  member: { rank: 4, name: 'Member' },
} as const satisfies PgEnumToObject<typeof roleEnum, { rank: number; name: string }>;

/**
 * Checks if `userRole` has the permissions of `requiredRole`.
 *
 * @param userRole The user's role.
 * @param requiredRole The required role.
 * @returns True if `userRole` has greater or equal privelege to `requiredRole`, otherwise false.
 */
export function hasRole(
  userRole: keyof typeof roleEnumValues,
  requiredRole: keyof typeof roleEnumValues,
) {
  return roleEnumValues[userRole].rank <= roleEnumValues[requiredRole].rank;
}

// Users
const usersRefine = {
  email: z.string().min(1, 'Required').email('Invalid email').toLowerCase(),
  firstName: z
    .string()
    .min(1, 'Required')
    .transform((value) => capitalizeFirstLetter(value.trim())),
  lastName: z
    .string()
    .min(1, 'Required')
    .transform((value) => capitalizeFirstLetter(value.trim())),
};
export const UserInsertSchema = createInsertSchema(users, usersRefine);
export const UserSelectSchema = createSelectSchema(users, usersRefine);
export type UserInsert = z.infer<typeof UserInsertSchema>;
export type UserSelect = z.infer<typeof UserSelectSchema>;
export const UserCreateSchema = UserInsertSchema.extend({
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 characters' })
    .regex(passwordLowercaseRegex, { message: 'Password must include a lowercase character' })
    .regex(passwordUppercaseRegex, { message: 'Password must include an uppercase character' })
    .regex(passwordNumericRegex, { message: 'Password must include a number' })
    .regex(passwordSpecialRegex, { message: 'Password must include a special character' }),
});
export type UserCreate = z.infer<typeof UserCreateSchema>;
export const UserCredentialsSchema = UserCreateSchema.pick({
  email: true,
  password: true,
});
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;

// Email MFA codes
export const EmailMfaCodesInsertSchema = createInsertSchema(emailMfaCodes);
export const EmailMfaCodesSelectSchema = createSelectSchema(emailMfaCodes);
export type EmailMfaCodesInsert = z.infer<typeof EmailMfaCodesInsertSchema>;
export type EmailMfaCodesSelect = z.infer<typeof EmailMfaCodesSelectSchema>;

// Email MFA
export const EmailMfaInsertSchema = createInsertSchema(emailMfa);
export const EmailMfaSelectSchema = createSelectSchema(emailMfa);
export type EmailMfaInsert = z.infer<typeof EmailMfaInsertSchema>;
export type EmailMfaSelect = z.infer<typeof EmailMfaSelectSchema>;

// Email verification codes
export const EmailVerificationCodesInsertSchema = createInsertSchema(emailVerificationCodes);
export const EmailVerificationCodesSelectSchema = createSelectSchema(emailVerificationCodes);
export type EmailVerificationCodesInsert = z.infer<typeof EmailVerificationCodesInsertSchema>;
export type EmailVerificationCodesSelect = z.infer<typeof EmailVerificationCodesSelectSchema>;

// Invites
const invitesRefine = {
  email: z.string().email(),
};
export const InviteInsertSchema = createInsertSchema(invites, invitesRefine);
export const InviteSelectSchema = createSelectSchema(invites, invitesRefine);
export type InviteInsert = z.infer<typeof InviteInsertSchema>;
export type InviteSelect = z.infer<typeof InviteSelectSchema>;

// Login tokens
export const LoginTokenInsertSchema = createInsertSchema(loginTokens);
export const LoginTokenSelectSchema = createSelectSchema(loginTokens);
export type LoginTokenInsert = z.infer<typeof LoginTokenInsertSchema>;
export type LoginTokenSelect = z.infer<typeof LoginTokenSelectSchema>;

// Passwords
export const PasswordInsertSchema = createInsertSchema(passwords);
export const PasswordSelectSchema = createSelectSchema(passwords);
export type PasswordInsert = z.infer<typeof PasswordInsertSchema>;
export type PasswordSelect = z.infer<typeof PasswordSelectSchema>;

// Sessions
export const SessionInsertSchema = createInsertSchema(sessions);
export const SessionSelectSchema = createSelectSchema(sessions);
export type SessionInsert = z.infer<typeof SessionInsertSchema>;
export type SessionSelect = z.infer<typeof SessionSelectSchema>;

// TOTP MFA
export const TotpMfaInsertSchema = createInsertSchema(totpMfa);
export const TotpMfaSelectSchema = createSelectSchema(totpMfa);
export type TotpMfaInsert = z.infer<typeof TotpMfaInsertSchema>;
export type TotpMfaSelect = z.infer<typeof TotpMfaSelectSchema>;
