import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { routes } from './routes/plugin';
import { logger } from './logger';
import { logger as elysiaLogger } from '@bogeychan/elysia-logger';
import { createLoggerOptions } from '@repo/util/logger';
import { openapi } from './middleware/openapi';

export const app = new Elysia()
  .use(elysiaLogger(createLoggerOptions('backend-elysia')))
  .use(openapi())
  .use(cors())
  .use(routes)
  .listen(8000);

export type App = typeof app;

logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
