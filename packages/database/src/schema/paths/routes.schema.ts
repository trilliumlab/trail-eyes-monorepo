import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { lineString } from 'drizzle-postgis/models';

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  originalId: text('original_id').unique(),
  title: text('title').notNull(),
  description: text('description'),
  creator: text('creator'),
  stroke: text('stroke').notNull(),
  updated: timestamp('updated', { withTimezone: true }).notNull(),
  geometry: lineString('geometry', { is3D: true, srid: 4326 }).notNull(),
});
