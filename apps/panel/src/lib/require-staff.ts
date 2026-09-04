import { redirect } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getHeaders } from '@tanstack/react-start/server';
import { authClient } from '~/backend';

// authClient's fetch has no browser cookies to send during SSR (it's a
// server-side fetch call, not the original incoming request), so the
// session/tier check would otherwise always see "logged out" on a fresh
// page load. Forward the incoming request's headers (which include the
// session cookie) explicitly when running on the server.
const getSessionHeaders = createIsomorphicFn()
  .client(() => undefined)
  .server(() => getHeaders() as Record<string, string>);

async function getGatedSession() {
  const headers = getSessionHeaders();
  const { data: session } = await authClient.getSession(
    headers ? { fetchOptions: { headers } } : undefined,
  );
  if (!session) {
    throw redirect({ to: '/auth/$pathname', params: { pathname: 'sign-in' } });
  }
  return session.user as { tier?: string; staffApproved?: boolean };
}

/** Route beforeLoad guard restricting a page to staff (tier 3, approved) or admin (tier 4). */
export async function requireStaff() {
  const user = await getGatedSession();
  const isStaff = user.tier === '3' && user.staffApproved === true;
  const isAdmin = user.tier === '4';
  if (!isStaff && !isAdmin) {
    throw redirect({ to: '/unauthorized' });
  }
}

/** Route beforeLoad guard restricting a page to admin (tier 4) only. */
export async function requireAdmin() {
  const user = await getGatedSession();
  if (user.tier !== '4') {
    throw redirect({ to: '/unauthorized' });
  }
}
