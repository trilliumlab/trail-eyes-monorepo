import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { routes } from '~/schema/paths';

// Routes
const routesRefine = {
  // TODO: Add geometry type
  geometry: z.object({
    coordinates: z.array(z.tuple([z.number(), z.number(), z.number()])),
    type: z.literal('LineString'),
  }),
};
export const RouteInsertSchema = createInsertSchema(routes, routesRefine);
export const RouteSelectSchema = createSelectSchema(routes, routesRefine);
export type RouteInsert = z.infer<typeof RouteInsertSchema>;
export type RouteSelect = z.infer<typeof RouteSelectSchema>;
