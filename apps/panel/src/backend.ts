import type { contract } from '@repo/contract';
import type { ContractRouterClient } from '@orpc/contract';
import { publicEnv } from '@repo/env';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCClient } from '@orpc/client';
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: `${publicEnv().backendUrl}/auth`
}) as ReturnType<typeof createAuthClient>

const getClientLink = createIsomorphicFn()
  .client(() => new RPCLink({
    url: publicEnv().backendUrl,
  }))
  .server(() => new RPCLink({
    url: publicEnv().backendUrl,
    headers: getHeaders(),
  }));

const link = getClientLink();

export const client: ContractRouterClient<typeof contract> = createORPCClient(link);
export const queryClient = createTanstackQueryUtils(client);
