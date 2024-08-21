import { pgTable, serial, text, timestamp, integer, uuid, boolean } from 'drizzle-orm/pg-core';
import { point } from 'drizzle-postgis/models';
import { categoryEnum } from './category';

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  clientId: uuid('uuid').unique(),
  category: categoryEnum('category').notNull(),
  route: integer('route').notNull(),
  trail: integer('trail').notNull(),
  image: text('image'),
  blurHash: text('blur_hash'),
  active: boolean('active').default(true).notNull(),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  geometry: point('geometry', { is3D: true, srid: 4326 }).notNull(),
});
