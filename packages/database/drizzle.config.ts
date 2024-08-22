import { defineConfig } from 'drizzle-kit';
import { env } from '~/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/schema/**/*.schema.ts', './src/schema/**/schema.ts'],
  out: `./drizzle/${env.DB_NAME}`,
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
  },
  extensionsFilters: ['postgis'],
});
