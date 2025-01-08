import { publicEnv } from '@repo/env';
import { ThemeProvider } from '@repo/ui/components/theme';
import styles from '@repo/ui/globals.css?url';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
import NotFound from '~/components/not-found';
import type { RouterContext } from '~/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TrailEyes Auth' },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound homepage="/register" />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  const RouterDevtools =
    publicEnv().mode === 'production'
      ? () => null
      : React.lazy(() =>
          import('@tanstack/router-devtools').then((mod) => ({
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Meta />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* {children} */}
        </ThemeProvider>
        <React.Suspense>
          <RouterDevtools />
          <QueryDevtools />
        </React.Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
