import { client } from './db-client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from "better-auth/plugins"
import { mailer } from '@repo/email';
import { privateEnv } from '@repo/env';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      await mailer.sendVerification(user.email, {
        url,
        name: user.name,
        expirationString: '1 hour',
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600 // 1 hour
  },
  database: drizzleAdapter(client, {
    provider: "pg",
    usePlural: true,
  }),
  secret: privateEnv().betterAuthSecret,
  basePath: '/auth',
  plugins: [
    openAPI(),
  ]
});
