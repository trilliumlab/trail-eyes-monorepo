/// <reference types="vite/client" />
import { publicEnv } from '@repo/env';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent } from '@tanstack/react-router';
import { Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import * as React from 'react';
import NotFound from '~/components/not-found';
import type { RouterContext } from '~/router';

import styles from '~/globals.css?url';
import { Providers } from '~/providers';
import { NavBar } from '~/components/nav/nav-bar';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, viewport-fit=cover, initial-scale=1' },
      { title: 'TrailEyes Panel' },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound homepage="/" />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const queryClient = new QueryClient();

// Pages a non-staff (or logged-out) visitor can land on - these must not show
// the admin nav bar, since that would expose the panel's existence/structure
// to people who have no access to it.
const publicPagePrefixes = ['/email-verified', '/unauthorized', '/auth/'];

function RootDocument({ children }: React.PropsWithChildren) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublicPage = publicPagePrefixes.some((p) => pathname.startsWith(p));

  const RouterDevtools =
    publicEnv().mode === 'production'
      ? () => null
      : React.lazy(() =>
          import('@tanstack/react-router-devtools').then((mod) => ({
            default: mod.TanStackRouterDevtools,
          })),
        );

  const QueryDevtools =
    publicEnv().mode === 'production'
      ? () => null
      : React.lazy(() =>
          import('@tanstack/react-query-devtools').then((mod) => ({
            default: mod.ReactQueryDevtools,
          })),
        );

  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Providers>
          <div className="flex min-h-svh flex-col">
            {!isPublicPage && <NavBar />}
            {children}
          </div>
        </Providers>
        <React.Suspense>
          <RouterDevtools />
          <QueryDevtools />
        </React.Suspense>
        <Scripts />
      </body>
    </html>
  );
}
