import { client } from './db-client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { openAPI } from "better-auth/plugins"
import { mailer } from '@repo/email';
import { privateEnv, publicEnv } from '@repo/env';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from './schema/auth';

const allowedOrigins = [publicEnv().panelUrl, publicEnv().backendUrl];

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      tier: {
        type: 'string',
        required: true,
        input: true,
        validator: {
          // Only ever '2' or '3' can come from a signup request - tier '4'
          // (admin) can only be granted via a direct DB update.
          input: z.enum(['2', '3']),
        },
      },
      staffApproved: {
        type: 'boolean',
        // Not required as *input* - its value always comes from
        // defaultValue below, never from the client. Can never be set via
        // the signup/update request body - only ever changed server-side
        // via the admin-only approve-staff endpoint.
        required: false,
        input: false,
        defaultValue: false,
      },
    },
  },
  trustedOrigins: allowedOrigins,
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      // Every verification link lands on a plain confirmation page,
      // regardless of tier or which client the user signed up from - the
      // panel's admin routes are staff-gated and not meant to be reached
      // via this flow. See apps/panel/src/routes/email-verified.tsx.
      const newUrl = new URL(url);
      newUrl.searchParams.set('callbackURL', `${publicEnv().panelUrl}/email-verified`);

      // Deliberately not awaited: better-auth awaits this hook before
      // responding to sign-up, and SMTP delivery (particularly to Gmail)
      // has been observed taking anywhere from seconds to minutes. Sign-up
      // itself should return as soon as the account is created, not block
      // on mail delivery.
      mailer
        .sendVerification(user.email, {
          url: newUrl.toString(),
          name: user.name,
          expirationString: '1 hour',
        })
        .catch((error) => console.error('Failed to send verification email:', error));
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
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-in/email') return;

      const email = ctx.body?.email as string | undefined;
      if (!email) return;

      const [user] = await client.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) return; // let better-auth's own invalid-credentials check handle this

      // A staff (tier 3) signup can't log in anywhere - mobile app or panel
      // - until an admin approves it. Letting them into the app beforehand
      // as a half-working account is exactly the confusing state this
      // blocks. Applies regardless of origin, unlike the panel-only check
      // below.
      if (user.tier === '3' && !user.staffApproved) {
        throw new APIError('FORBIDDEN', {
          message: 'Your staff account is pending admin approval.',
        });
      }

      // The mobile app and the admin panel both sign in against this same
      // endpoint - hikers (tier 2) need that to work for the app (it's how
      // report submissions get tied to an account), but must never be able
      // to establish a panel session. Scope this part to requests
      // originating from the panel specifically.
      if (ctx.headers?.get('origin') !== publicEnv().panelUrl) return;
      if (user.tier !== '4' && user.tier !== '3') {
        throw new APIError('FORBIDDEN', {
          message: 'This account does not have access to the admin panel.',
        });
      }
    }),
  },
});
