import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { hazards } from '~/schema';

const hazardsRefine = {
  geometry: Type.Object({
    coordinates: Type.Tuple([Type.Number(), Type.Number(), Type.Number()]),
    type: Type.Literal('Point'),
  }),
};
export const HazardInsertSchema = createInsertSchema(hazards, hazardsRefine);
export const HazardSelectSchema = createSelectSchema(hazards, hazardsRefine);
export type HazardInsert = typeof HazardInsertSchema.static;
export type HazardSelect = typeof HazardSelectSchema.static;
