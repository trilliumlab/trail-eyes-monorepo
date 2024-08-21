import postgres from 'postgres';
import * as schema from './schema';
import type * as models from './models';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './env';

export const client = drizzle(
  postgres({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
  }),
  { schema },
);

export async function addRoute(route: models.RouteInsert) {
  await client.insert(schema.routes).values(route);
}

export async function getAllRoutes() {
  return (await client.query.routes.findMany()) as models.RouteSelect[];
}
