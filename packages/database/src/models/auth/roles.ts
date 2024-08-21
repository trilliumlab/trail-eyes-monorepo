import { StringEnum } from '@repo/util';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { roleEnum, roles } from '~/schema';
import type { PgEnumToObject } from '~/utils';

export const roleEnumValues = {
  developer: 'Developer',
  superAdmin: 'Super admin',
  admin: 'Admin',
  volunteer: 'Volunteer',
} as const satisfies PgEnumToObject<typeof roleEnum>;

export const RoleEnumSchema = StringEnum(roleEnum.enumValues);

export const RoleInsertSchema = createInsertSchema(roles);
export const RoleSelectSchema = createSelectSchema(roles);
export type RoleInsert = typeof RoleInsertSchema.static;
export type RoleSelect = typeof RoleSelectSchema.static;
