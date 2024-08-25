import { defineConfig } from 'drizzle-kit';
import { privateEnv } from '@repo/util/private-env';

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/schema/**/*.schema.ts', './src/schema/**/schema.ts'],
  out: `./drizzle/${privateEnv.DB_USER}@${privateEnv.DB_HOST}:${privateEnv.DB_PORT}`,
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
