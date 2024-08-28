import { client } from '~/db-client';
import type * as models from '~/models';
import * as schema from '~/schema';

/**
 * Adds a route to the database.
 * 
 * @param route - The route to be added.
 * @returns A promise that resolves when the route is successfully added.
 */
export async function addRoute(route: models.paths.RouteInsert) {
  await client.insert(schema.paths.routes).values(route);
}

/**
 * Retrieves all routes from the database.
 * 
 * @returns A promise that resolves to an array of routes.
 */
export async function getAllRoutes() {
  return (await client.query.routes.findMany()) as models.paths.RouteSelect[];
}
