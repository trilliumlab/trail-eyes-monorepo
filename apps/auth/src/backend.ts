import type { contract } from '@repo/contract';
import type { ContractRouterClient } from '@orpc/contract';
import { publicEnv } from '@repo/env';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCClient } from '@orpc/client';
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
// import { serverOnly$ } from 'vite-env-only/macros';
// import { getHeaders, setHeaders } from 'vinxi/http';

const link = new RPCLink({
  url: publicEnv().backendUrl,
  // headers: serverOnly$(async (args) => {
  //   // Add request headers from client
  //   const response = await tsRestFetchApi({
  //     ...args,
  //     headers: {
  //       ...args.headers,
  //       ...getHeaders(),
  //     },
  //   });
  //   // Write response headers to client
  //   setHeaders(Object.fromEntries(Object.entries(response.headers)));
  //   return response;
  // }),
});

export const client: ContractRouterClient<typeof contract> = createORPCClient(link);

export const queryClient = createTanstackQueryUtils(client);

// import { contract } from '@repo/contract';
// import { publicEnv } from '@repo/env';
// import { tsRestFetchApi } from '@ts-rest/core';
// import { initTsrReactQuery } from '@ts-rest/react-query/v5';

// export const tsr = initTsrReactQuery(contract, {
//   baseUrl: publicEnv().backendUrl,
//   credentials: 'include',
  // api: serverOnly$(async (args) => {
  //   // Add request headers from client
  //   const response = await tsRestFetchApi({
  //     ...args,
  //     headers: {
  //       ...args.headers,
  //       ...getHeaders(),
  //     },
  //   });
  //   // Write response headers to client
  //   setHeaders(Object.fromEntries(Object.entries(response.headers)));
  //   return response;
  // }),
// });
