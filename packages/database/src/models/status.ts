import { StringEnum } from '@repo/util';
import { statusEnum } from '~/schema/status';
import type { PgEnumToObject } from '~/utils';

export const statusEnumValues = {
  open: 'Report is open.',
  closed: 'Report is closed.',
  inProgress: 'Report is in progress',
} as const satisfies PgEnumToObject<typeof statusEnum>;

export const StatusEnumSchema = StringEnum(statusEnum.enumValues);
