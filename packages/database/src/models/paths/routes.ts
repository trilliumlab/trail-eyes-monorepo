import { Type } from '@sinclair/typebox';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { paths } from '../../schema';

const routesRefine = {
  geometry: Type.Object({
    coordinates: Type.Array(Type.Tuple([Type.Number(), Type.Number(), Type.Number()])),
    type: Type.Literal('LineString'),
  }),
};
export const RouteInsertSchema = createInsertSchema(paths.routes, routesRefine);
export const RouteSelectSchema = createSelectSchema(paths.routes, routesRefine);
export type RouteInsert = typeof RouteInsertSchema.static;
export type RouteSelect = typeof RouteSelectSchema.static;
