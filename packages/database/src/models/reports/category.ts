import type { reports } from '~/schema';
import type { PgEnumToObject } from '~/utils';

export const categoryEnumValues = {
  other: 'Other',
  fallenTree: 'Downed tree',
  drainage: 'Poor drainage/blocked culvert',
  erosion: 'Hazardous erosion (such as a small landslide)',
  structureFailure: 'Structure failure (such as a bridge or retaining wall)',
  damagedSign: 'Missing/vandalized/badly damaged sign(s)',
  seasonal: 'Seasonal maintenance needed',
} as const satisfies PgEnumToObject<typeof reports.categoryEnum>;
