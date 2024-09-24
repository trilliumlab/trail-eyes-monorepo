import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { type categoryEnum, hazards, reports, type statusEnum } from '~/schema/reports';
import type { PgEnumToObject } from '~/utils';

// Category enum
export const categoryEnumValues = {
  other: 'Other',
  fallenTree: 'Downed tree',
  drainage: 'Poor drainage/blocked culvert',
  erosion: 'Hazardous erosion (such as a small landslide)',
  structureFailure: 'Structure failure (such as a bridge or retaining wall)',
  damagedSign: 'Missing/vandalized/badly damaged sign(s)',
  seasonal: 'Seasonal maintenance needed',
} as const satisfies PgEnumToObject<typeof categoryEnum>;

// Status enum
export const statusEnumValues = {
  open: 'Open',
  confirmed: 'Confirmed by volunteer',
  closed: 'Closed',
  inProgress: 'In progress',
} as const satisfies PgEnumToObject<typeof statusEnum>;

// Hazards
const hazardsRefine = {
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
    type: z.literal('Point'),
  }),
};
export const HazardInsertSchema = createInsertSchema(hazards, hazardsRefine);
export const HazardSelectSchema = createSelectSchema(hazards, hazardsRefine);
export type HazardInsert = z.infer<typeof HazardInsertSchema>;
export type HazardSelect = z.infer<typeof HazardSelectSchema>;

// Reports
const reportsRefine = {
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
    type: z.literal('Point'),
  }),
};
export const ReportInsertSchema = createInsertSchema(reports, reportsRefine);
export const ReportSelectSchema = createSelectSchema(reports, reportsRefine);
export type ReportInsert = z.infer<typeof ReportInsertSchema>;
export type ReportSelect = z.infer<typeof ReportSelectSchema>;
