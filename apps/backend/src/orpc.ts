import { implement, ORPCError } from '@orpc/server';
import { contract } from '@repo/contract';
import { ResponseHeadersPluginContext } from '@orpc/server/plugins'
import { auth } from '@repo/database/auth';

export interface ORPCContext extends ResponseHeadersPluginContext {
  headers: Headers;
}

export const pub = implement(contract)
    .$context<ORPCContext>()
    // .use(dbProviderMiddleware)

// Requires a logged-in session (any account, not tier-gated). See auth.ts for
// session/verification config.
export const authed = pub.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) {
    throw new ORPCError('UNAUTHORIZED');
  }

  return next({
    context: {
      // better-auth's base User type doesn't know about the custom
      // `tier`/`staffApproved` additionalFields, but they're present at
      // runtime (confirmed via /auth/get-session).
      user: session.user as typeof session.user & {
        tier: '2' | '3' | '4';
        staffApproved: boolean;
      },
    },
  });
});

// Requires staff (tier 3, approved) or admin (tier 4) - used for actions
// like approving/declining reports, matching the panel's own gating.
export const staffOnly = authed.use(({ context, next }) => {
  const isStaff = context.user.tier === '3' && context.user.staffApproved;
  const isAdmin = context.user.tier === '4';
  if (!isStaff && !isAdmin) {
    throw new ORPCError('FORBIDDEN');
  }
  return next({ context });
});

// Requires an admin (tier 4) account - used for admin-only actions like
// approving a staff signup, which staff shouldn't be able to do to each
// other.
export const adminOnly = authed.use(({ context, next }) => {
  if (context.user.tier !== '4') {
    throw new ORPCError('FORBIDDEN');
  }
  return next({ context });
});
