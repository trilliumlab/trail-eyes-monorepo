import { getEvent, sendRedirect } from 'vinxi/http';
import { clientOnly$, serverOnly$ } from 'vite-env-only/macros';

/**
 * Isomorphically redirects to the given external URL.
 *
 * @param url - The URL to redirect to.
 */
export const externalRedirect: (url: string) => Promise<void> =
  serverOnly$(async (url) => {
    await sendRedirect(getEvent(), url);
  }) ??
  clientOnly$(async (url) => {
    window.location.href = url;
  }) ??
  (async () => {
    throw new Error('externalRedirect called from invalid context');
  });
