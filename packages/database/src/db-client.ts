import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '~/env';
import * as schema from '~/schema';

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
