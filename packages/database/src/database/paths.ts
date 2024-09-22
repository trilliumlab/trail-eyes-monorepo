import { client } from '~/db-client';
import type { RouteInsert, RouteSelect } from '~/models/paths';
import { routes } from '~/schema/paths';

/**
 * Adds a route to the database.
 *
 * @param route - The route to be added.
 * @returns A promise that resolves when the route is successfully added.
 */
export async function addRoute(route: RouteInsert) {
  await client.insert(routes).values(route);
}

/**
 * Retrieves all routes from the database.
 *
 * @returns A promise that resolves to an array of routes.
 */
export async function getAllRoutes() {
  return (await client.query.routes.findMany()) as RouteSelect[];
}
