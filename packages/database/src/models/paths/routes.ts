import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { paths } from '~/schema';
import { z } from 'zod';

const routesRefine = {
  // TODO: Add geometry type
  geometry: z.object({
    coordinates: z.array(z.tuple([z.number(), z.number(), z.number()])),
    type: z.literal('LineString'),
  }),
};
export const RouteInsertSchema = createInsertSchema(paths.routes, routesRefine);
export const RouteSelectSchema = createSelectSchema(paths.routes, routesRefine);
export type RouteInsert = z.infer<typeof RouteInsertSchema>;
export type RouteSelect = z.infer<typeof RouteSelectSchema>;
