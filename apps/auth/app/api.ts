import { treaty, type Treaty } from '@elysiajs/eden';
import type { Api } from '@repo/backend-api';
import { publicEnv } from '@repo/util/public-env';

export const api: Treaty.Create<Api> = treaty<Api>(publicEnv.BACKEND_URL);
