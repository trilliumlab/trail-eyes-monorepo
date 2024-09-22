import { defineConfig } from 'drizzle-kit';
import { privateEnv } from '@repo/env';
import { createHash } from 'node:crypto';

// Create a unique hash for the connection to store db migrations
const connection = `${privateEnv().dbUser}@${privateEnv().dbHost}:${privateEnv().dbPort}/${privateEnv().dbName}`;
const hash = createHash('md5').update(connection).digest('hex').slice(0, 16);

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/schema/**/*.ts'],
  out: `./drizzle/${hash}`,
  dbCredentials: {
    host: privateEnv().dbHost,
    port: privateEnv().dbPort,
    user: privateEnv().dbUser,
    password: privateEnv().dbPassword,
    database: privateEnv().dbName,
    ssl: privateEnv().dbSsl,
  },
  extensionsFilters: ['postgis'],
});
