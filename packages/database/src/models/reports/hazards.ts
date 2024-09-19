import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { reports } from '~/schema';
import { z } from 'zod';

const hazardsRefine = {
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
    type: z.literal('Point'),
  }),
};
export const HazardInsertSchema = createInsertSchema(reports.hazards, hazardsRefine);
export const HazardSelectSchema = createSelectSchema(reports.hazards, hazardsRefine);
export type HazardInsert = z.infer<typeof HazardInsertSchema>;
export type HazardSelect = z.infer<typeof HazardSelectSchema>;
