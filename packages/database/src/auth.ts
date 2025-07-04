import { client } from './db-client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from "better-auth/plugins"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(client, {
    provider: "pg",
    usePlural: true,
  }),
  basePath: '/auth',
  plugins: [
    openAPI(),
  ]
});
