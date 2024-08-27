import { integer, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { point } from 'drizzle-postgis/models';
import { categoryEnum } from './category.schema';
import { statusEnum } from './status.schema';

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
