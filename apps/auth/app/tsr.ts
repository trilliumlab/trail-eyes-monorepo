import { contract } from '@repo/contract';
import { publicEnv } from '@repo/env';
import { tsRestFetchApi } from '@ts-rest/core';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { getHeaders, setHeaders } from 'vinxi/http';
import { serverOnly$ } from 'vite-env-only/macros';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: publicEnv().backendUrl,
  credentials: 'include',
  api: serverOnly$(async (args) => {
    // Add request headers from client
    const response = await tsRestFetchApi({
      ...args,
      headers: {
        ...args.headers,
        ...getHeaders(),
      },
    });
    // Write response headers to client
    setHeaders(Object.fromEntries(Object.entries(response.headers)));
    return response;
  }),
});
