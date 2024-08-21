import { StringEnum } from '@repo/util';
import { categoryEnum } from '~/schema/category';
import type { PgEnumToObject } from '~/utils';

export const categoryEnumValues = {
  other: 'Other',
  fallenTree: 'Downed tree',
  drainage: 'Poor drainage/blocked culvert',
  erosion: 'Hazardous erosion (such as a small landslide)',
  structureFailure: 'Structure failure (such as a bridge or retaining wall)',
  damagedSign: 'Missing/vandalized/badly damaged sign(s)',
  seasonal: 'Seasonal maintenance needed',
} as const satisfies PgEnumToObject<typeof categoryEnum>;

export const CategoryEnumSchema = StringEnum(categoryEnum.enumValues);
