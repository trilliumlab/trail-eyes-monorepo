import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { reports } from '../../schema';
import { z } from 'zod';

const reportsRefine = {
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
    type: z.literal('Point'),
  }),
};
export const ReportInsertSchema = createInsertSchema(reports.reports, reportsRefine);
export const ReportSelectSchema = createSelectSchema(reports.reports, reportsRefine);
export type ReportInsert = z.infer<typeof ReportInsertSchema>;
export type ReportSelect = z.infer<typeof ReportSelectSchema>;
