import { treaty } from '@elysiajs/eden';
import type { Api } from '@repo/backend-api';
import { publicEnv } from '@repo/util/public-env';

export const api = treaty<Api>(publicEnv.BACKEND_URL);
