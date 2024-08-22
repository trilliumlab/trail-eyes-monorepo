import postgres from 'postgres';
import * as schema from '~/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '~/env';

export const client = drizzle(
  postgres({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
  }),
  {
    schema: {
      ...schema.auth,
      ...schema.paths,
      ...schema.reports,
    },
  },
);
