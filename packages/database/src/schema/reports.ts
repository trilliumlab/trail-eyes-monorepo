import { integer, pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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
export const reportUpdateStateEnum = pgEnum('report_update_state', ['present', 'cleared']);

export const reports = pgTable('reports', {
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
  description: text('description'),
  locationDescription: text('location_description'),
});

export const reportUpdates = pgTable('report_updates', {
  id: serial('id').primaryKey(),
  reportLocalId: uuid('report_local_id')
    .notNull()
    .references(() => reports.localId, { onDelete: 'cascade' }),
  creatorDeviceId: text('creator_device_id').notNull(),
  state: reportUpdateStateEnum('state').notNull(),
  image: text('image'),
  blurHash: text('blur_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
