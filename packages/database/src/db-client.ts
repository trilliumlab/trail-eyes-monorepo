import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { privateEnv } from '@repo/env';
import * as schema from './schema';

export const client = drizzle(
  postgres({
    host: privateEnv().dbHost,
    port: privateEnv().dbPort,
    user: privateEnv().dbUser,
    password: privateEnv().dbPassword,
    database: privateEnv().dbName,
    ssl: privateEnv().dbSsl,
  }),
  {
    schema: {
      ...schema.auth,
      ...schema.paths,
      ...schema.reports,
    },
  },
);
