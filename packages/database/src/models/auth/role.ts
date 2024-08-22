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

export const RoleEnumSchema = StringEnum(auth.roleEnum.enumValues);
