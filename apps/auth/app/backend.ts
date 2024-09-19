import { hc } from 'hono/client';
import type { AppType } from '@repo/backend';
import { publicEnv } from '@repo/env';

export const backend = hc<AppType>(publicEnv().backendUrl);
