import { createRootRoute } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
// @ts-expect-error
import styles from '@repo/ui/globals.css?url';
import { ThemeProvider } from '@repo/ui/components/theme';
import { publicEnv } from '@repo/env';

export const Route = createRootRoute({
  meta: () => [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'TrailEyes Auth' },
  ],
  links: () => [{ rel: 'stylesheet', href: styles }],
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  const TanStackRouterDevtools =
    publicEnv().mode === 'production'
      ? () => null // Render nothing in production
      : React.lazy(() =>
          // Lazy load in development
          import('@tanstack/router-devtools').then((res) => ({
            default: res.TanStackRouterDevtools,
          })),
        );

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <Meta />
      </Head>
      <Body>
        <React.Suspense>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </React.Suspense>
        <React.Suspense>
          <TanStackRouterDevtools />
        </React.Suspense>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
