import { pgTable } from 'drizzle-orm/pg-core';
import { commonReportsColumns } from './common';

export const reports = pgTable('reports', {
  ...commonReportsColumns(),
});
