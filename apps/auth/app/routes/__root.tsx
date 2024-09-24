import { publicEnv } from '@repo/env';
import { ThemeProvider } from '@repo/ui/components/theme';
// @ts-expect-error
import styles from '@repo/ui/globals.css?url';
import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
import NotFound from '~/components/not-found';

export interface RootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  meta: () => [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'TrailEyes Auth' },
  ],
  links: () => [{ rel: 'stylesheet', href: styles }],
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

const queryClient = new QueryClient();

function RootDocument({ children }: React.PropsWithChildren) {
  const TanStackRouterDevtools =
    publicEnv().mode === 'production'
      ? () => null // Render nothing in production
      : React.lazy(async () => {
          // Lazy load in development
          const { TanStackRouterDevtools } = await import('@tanstack/router-devtools');
          return { default: TanStackRouterDevtools };
        });
  const ReactQueryDevtools =
    publicEnv().mode === 'production'
      ? () => null // Render nothing in production
      : React.lazy(async () => {
          // Lazy load in development
          const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');
          return { default: ReactQueryDevtools };
        });

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <Meta />
      </Head>
      <Body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <React.Suspense>
          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </React.Suspense>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
