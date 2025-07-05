import type { contract } from '@repo/contract';
import type { ContractRouterClient } from '@orpc/contract';
import { publicEnv } from '@repo/env';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCClient } from '@orpc/client';
// import { createTanstackQueryUtils } from '@orpc/tanstack-query'

const link = new RPCLink({
  url: publicEnv().backendUrl,
});

export const client: ContractRouterClient<typeof contract> = createORPCClient(link);

// export const queryClient = createTanstackQueryUtils(client);

// export const backend = initQueryClient(contract, {
//   baseUrl: publicEnv().backendUrl,
//   api: isServer
//     ? async (args) => {
//         // Lazy import so not imported on the client
//         const { getHeaders, setHeaders } = await import('vinxi/http');
//         // Add request headers from client
//         const response = await tsRestFetchApi({
//           ...args,
//           headers: {
//             ...args.headers,
//             ...getHeaders(),
//           },
//         });
//         // Write response headers to client
//         setHeaders(Object.fromEntries(response.headers));
//         return response;
//       }
//     : undefined,
// });
