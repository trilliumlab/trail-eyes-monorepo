import { pgTable } from 'drizzle-orm/pg-core';
import { commonReportsColumns } from './common.schema';

export const reports = pgTable('reports', commonReportsColumns);
