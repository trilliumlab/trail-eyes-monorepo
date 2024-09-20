import { OpenAPIHono } from '@hono/zod-openapi';
import { serveStatic } from 'hono/bun';

export const sprites = new OpenAPIHono().get(
  '/:path',
  serveStatic({
    root: '../../data/sprites/out',
    rewriteRequestPath: (path) => path.replace(/^\/sprites/, ''),
  }),
);
