import * as schema from '~/schema';
import type * as models from '~/models';
import { client } from '~/db-client';

export async function addRoute(route: models.RouteInsert) {
  await client.insert(schema.routes).values(route);
}

export async function getAllRoutes() {
  return (await client.query.routes.findMany()) as models.RouteSelect[];
}
