import { QueryClient, QueryClientProvider, dehydrate, hydrate } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { tsr } from '~/tsr';
import { routeTree } from './routeTree.gen';

import { PostHogProvider } from 'posthog-js/react';
import { publicEnv } from '@repo/env';

export function createRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',

    context: {
      queryClient,
    },
    // On the server, dehydrate the loader client so the router
    // can serialize it and send it to the client for us
    dehydrate: () => {
      return {
        queryClientState: dehydrate(queryClient),
      };
    },
    // On the client, hydrate the loader client with the data
    // we dehydrated on the server
    hydrate: (dehydrated) => {
      hydrate(queryClient, dehydrated.queryClientState);
    },
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <tsr.ReactQueryProvider>
            <PostHogProvider
              apiKey={publicEnv().posthogKey}
              options={{
                api_host: publicEnv().posthogHost,
                person_profiles: 'identified_only',
                enable_recording_console_log: true,
              }}
            >
              {children}
            </PostHogProvider>
          </tsr.ReactQueryProvider>
        </QueryClientProvider>
      );
    },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
