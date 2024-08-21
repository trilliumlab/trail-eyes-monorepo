import { pgEnum } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', [
  'other',
  'fallenTree',
  'drainage',
  'erosion',
  'structureFailure',
  'damagedSign',
  'seasonal',
]);
