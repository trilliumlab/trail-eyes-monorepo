import { serial, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { point } from 'drizzle-postgis/models';
import { categoryEnum } from './category';
import { statusEnum } from './status';

export const commonReportsColumns = {
  id: serial('id').primaryKey(),
  localId: uuid('local_id').unique(),
  creatorId: text('creator_id').notNull(),
  category: categoryEnum('category').notNull(),
  route: integer('route').notNull(),
  trail: integer('trail').notNull(),
  image: text('image'),
  blurHash: text('blur_hash'),
  status: statusEnum('status').default('open').notNull(),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  geometry: point('geometry', { is3D: true, srid: 4326 }).notNull(),
};
