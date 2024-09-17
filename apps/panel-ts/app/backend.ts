import { treaty } from '@elysiajs/eden';
import type { Api } from '@repo/backend-api';

export const backend = treaty<Api>('http://localhost:8000');
