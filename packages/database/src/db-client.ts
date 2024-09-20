import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { privateEnv } from '@repo/env';
import * as auth from './schema/auth';
import * as paths from './schema/paths';
import * as reports from './schema/reports';

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
      ...auth,
      ...paths,
      ...reports,
    },
  },
);
