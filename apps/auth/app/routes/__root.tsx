import { createRootRoute } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
// @ts-expect-error
import styles from '@repo/ui/globals.css?url';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from 'next-themes';

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
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <Meta />
      </Head>
      <Body>
        <React.Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </React.Suspense>
        <TanStackRouterDevtools />
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
