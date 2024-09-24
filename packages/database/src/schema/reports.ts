import { pgEnum } from 'drizzle-orm/pg-core';
import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { point } from 'drizzle-postgis/models';

export const categoryEnum = pgEnum('category', [
  'other',
  'fallenTree',
  'drainage',
  'erosion',
  'structureFailure',
  'damagedSign',
  'seasonal',
]);
export const statusEnum = pgEnum('status', ['open', 'confirmed', 'inProgress', 'closed']);

export function commonReportsColumns() {
  return {
    id: serial('id').primaryKey(),
    localId: uuid('local_id').unique(),
    creatorDeviceId: text('creator_device_id').notNull(),
    creatorUserId: text('creator_user_id'),
    category: categoryEnum('category').notNull(),
    route: integer('route').notNull(),
    trail: integer('trail').notNull(),
    image: text('image'),
    blurHash: text('blur_hash'),
    status: statusEnum('status').default('open').notNull(),
    reportedAt: timestamp('reported_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    geometry: point('geometry', { is3D: true, srid: 4326 }).notNull(),
  };
}

export const hazards = pgTable('hazards', {
  ...commonReportsColumns(),
  description: text('description').notNull(),
  locationDescription: text('location_description'),
});

export const reports = pgTable('reports', {
  ...commonReportsColumns(),
});
