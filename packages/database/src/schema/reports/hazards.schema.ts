import { pgTable, text } from 'drizzle-orm/pg-core';
import { commonReportsColumns } from './common.schema';

export const hazards = pgTable('hazards', {
  ...commonReportsColumns,
  description: text('description').notNull(),
  locationDescription: text('location_description'),
});
