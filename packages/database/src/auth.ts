import { client } from './db-client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from "better-auth/plugins"
import { mailer } from '@repo/email';
import { privateEnv, publicEnv } from '@repo/env';

const allowedOrigins = [publicEnv().panelUrl, publicEnv().backendUrl];

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  trustedOrigins: allowedOrigins,
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      // TODO: This is a hack to set the callbackURL to the correct origin,
      // If we ever need to redirect to a different origin, we need to change this properly
      const newUrl = new URL(url);
      const callbackUrl = newUrl.searchParams.get('callbackURL');
      const absoluteCallbackUrl = publicEnv().panelUrl + callbackUrl;
      newUrl.searchParams.set('callbackURL', absoluteCallbackUrl);

      await mailer.sendVerification(user.email, {
        url: newUrl.toString(),
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
