import { contract } from '@repo/contract';
import { publicEnv } from '@repo/env';
import { initQueryClient } from '@ts-rest/react-query';
// import { tsRestFetchApi } from '@ts-rest/core';
// import { isServer } from '@tanstack/react-query';

export const backend = initQueryClient(contract, {
  baseUrl: publicEnv().backendUrl,
  // api: isServer
  //   ? async (args) => {
  //       // Lazy import so not imported on the client
  //       const { getHeaders, setHeaders } = await import('vinxi/http');
  //       // Add request headers from client
  //       const response = await tsRestFetchApi({
  //         ...args,
  //         headers: {
  //           ...args.headers,
  //           ...getHeaders(),
  //         },
  //       });
  //       // Write response headers to client
  //       setHeaders(Object.fromEntries(response.headers));
  //       return response;
  //     }
  //   : undefined,
});
