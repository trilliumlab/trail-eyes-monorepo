import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { reports } from '../../schema';

const hazardsRefine = {
  geometry: Type.Object({
    coordinates: Type.Tuple([Type.Number(), Type.Number(), Type.Number()]),
    type: Type.Literal('Point'),
  }),
};
export const HazardInsertSchema = createInsertSchema(reports.hazards, hazardsRefine);
export const HazardSelectSchema = createSelectSchema(reports.hazards, hazardsRefine);
export type HazardInsert = typeof HazardInsertSchema.static;
export type HazardSelect = typeof HazardSelectSchema.static;
