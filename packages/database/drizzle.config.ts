import { defineConfig } from 'drizzle-kit';
import { privateEnv } from '@repo/util/private-env';
import { createHash } from 'node:crypto';

// Create a unique hash for the connection to store db migrations
const connection = `${privateEnv.DB_USER}@${privateEnv.DB_HOST}:${privateEnv.DB_PORT}/${privateEnv.DB_NAME}`;
const hash = createHash('md5').update(connection).digest('hex').slice(0, 16);

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/schema/**/*.schema.ts', './src/schema/**/schema.ts'],
  out: `./drizzle/${hash}`,
  dbCredentials: {
    host: privateEnv.DB_HOST,
    port: privateEnv.DB_PORT,
    user: privateEnv.DB_USER,
    password: privateEnv.DB_PASSWORD,
    database: privateEnv.DB_NAME,
    ssl: privateEnv.DB_SSL,
  },
  extensionsFilters: ['postgis'],
});
