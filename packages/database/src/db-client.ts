import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { privateEnv } from '@repo/util/private-env';
import * as schema from './schema';

export const client = drizzle(
  postgres({
    host: privateEnv.DB_HOST,
    port: privateEnv.DB_PORT,
    user: privateEnv.DB_USER,
    password: privateEnv.DB_PASSWORD,
    database: privateEnv.DB_NAME,
    ssl: privateEnv.DB_SSL,
  }),
  {
    schema: {
      ...schema.auth,
      ...schema.paths,
      ...schema.reports,
    },
  },
);
