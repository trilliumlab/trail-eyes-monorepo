import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import 'drizzle-postgis';
import { lineString } from 'drizzle-postgis/models';

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  originalId: text('original_id'),
  title: text('title').notNull(),
  description: text('description'),
  creator: text('creator'),
  stroke: text('stroke').notNull(),
  updated: timestamp('updated', { mode: 'date' }).notNull(),
  geometry: lineString('geometry', { is3D: true, srid: 4326 }).notNull(),
});
