import postgres from 'postgres';
import * as schema from './schema';
import type * as models from './models';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './env';
import { Type } from '@sinclair/typebox';

const client = postgres({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL,
});
const db = drizzle(client, { schema });

export async function drizzleTypeboxSchemaTest(route: models.RouteInsert) {
  await db.insert(schema.routes).values(route);
}

const Schema = Type.Object({
  test2: Type.String(),
});
export function typeboxSchemaTest(test: typeof Schema.static) {}

export function typescriptTest(input: { test: string }) {}

// All three show typescript errors that {} is not assignable to parameter of type ...
drizzleTypeboxSchemaTest({});
typeboxSchemaTest({});
typescriptTest({});
