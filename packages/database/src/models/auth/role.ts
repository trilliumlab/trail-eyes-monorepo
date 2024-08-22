import { StringEnum } from '@repo/util';
import { auth } from '~/schema';
import type { PgEnumToObject } from '~/utils';

export const roleEnumValues = {
  developer: { rank: 0, name: 'Developer' },
  superAdmin: { rank: 1, name: 'Super admin' },
  admin: { rank: 2, name: 'Admin' },
  volunteer: { rank: 3, name: 'Volunteer' },
  member: { rank: 4, name: 'Member' },
} as const satisfies PgEnumToObject<typeof auth.roleEnum, { rank: number; name: string }>;

/**
 * Checks if `userRole` has the permissions of `requiredRole`.
 *
 * @param userRole The user's role.
 * @param requiredRole The required role.
 * @returns True if `userRole` has greater or equal privelege to `requiredRole`, otherwise false.
 */
export function hasRole(userRole: RoleEnum, requiredRole: RoleEnum) {
  return roleEnumValues[userRole].rank <= roleEnumValues[requiredRole].rank;
}

export const RoleEnumSchema = StringEnum(auth.roleEnum.enumValues);
export type RoleEnum = typeof RoleEnumSchema.static;
