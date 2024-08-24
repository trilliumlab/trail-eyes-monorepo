import { client } from '~/db-client';
import type * as models from '~/models';
import * as schema from '~/schema';

export async function addRoute(route: models.paths.RouteInsert) {
  await client.insert(schema.paths.routes).values(route);
}

export async function getAllRoutes() {
  return (await client.query.routes.findMany()) as models.paths.RouteSelect[];
}
