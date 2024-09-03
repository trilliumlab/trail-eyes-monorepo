import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { reports } from '../../schema';

const reportsRefine = {
  geometry: Type.Object({
    coordinates: Type.Tuple([Type.Number(), Type.Number(), Type.Number()]),
    type: Type.Literal('Point'),
  }),
};
export const ReportInsertSchema = createInsertSchema(reports.reports, reportsRefine);
export const ReportSelectSchema = createSelectSchema(reports.reports, reportsRefine);
export type ReportInsert = typeof ReportInsertSchema.static;
export type ReportSelect = typeof ReportSelectSchema.static;
