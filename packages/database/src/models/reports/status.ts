import { StringEnum } from '@repo/util';
import { statusEnum } from '~/schema/reports/status.schema';
import type { PgEnumToObject } from '~/utils';

export const statusEnumValues = {
  open: 'Open',
  confirmed: 'Confirmed by volunteer',
  closed: 'Closed',
  inProgress: 'In progress',
} as const satisfies PgEnumToObject<typeof statusEnum>;

export const StatusEnumSchema = StringEnum(statusEnum.enumValues);
