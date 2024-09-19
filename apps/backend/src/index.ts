import { routes } from './routes/plugin';
import { logger } from './logger';
import { logger as honoLogger } from 'hono-pino';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';

export const app = new OpenAPIHono()
  .doc31('/openapi.json', {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'My API',
    },
  })
  .get('/docs', apiReference({ spec: { url: '/openapi.json' }, theme: 'kepler' }))
  .use(
    honoLogger({
      pino: logger,
    }),
  )
  .use(cors())
  .route('', routes);

export type AppType = typeof app;

export default {
  port: 8000,
  fetch: app.fetch,
};
