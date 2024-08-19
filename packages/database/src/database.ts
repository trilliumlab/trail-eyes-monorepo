import postgres from 'postgres';
import * as schema from './schema';
import type * as models from './models';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './env';
import type { Static } from '@sinclair/typebox';

const client = postgres({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL,
});
const db = drizzle(client, { schema });

export async function addRoute(route: models.RouteInsert) {
  await db.insert(schema.routes).values(route);
}

await addRoute({});
