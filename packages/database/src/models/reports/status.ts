import type { reports } from '~/schema';
import type { PgEnumToObject } from '~/utils';

export const statusEnumValues = {
  open: 'Open',
  confirmed: 'Confirmed by volunteer',
  closed: 'Closed',
  inProgress: 'In progress',
} as const satisfies PgEnumToObject<typeof reports.statusEnum>;
