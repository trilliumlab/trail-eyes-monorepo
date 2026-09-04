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
      user: session.user,
    },
  });
});
