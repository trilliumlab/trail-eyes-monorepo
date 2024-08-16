import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import type { ThemeId } from '@elysiajs/swagger/scalar/types';
import { Elysia } from 'elysia';
import { routes } from './routes/plugin';

const app = new Elysia()
  .use(
    swagger({
      path: 'docs',
      scalarConfig: {
        // Kepler theme is supported by swagger,
        // but hasn't been added to the list of supported elysia themes
        theme: 'kepler' as ThemeId,
      },
    }),
  )
  .use(cors())
  .use(routes)
  .listen(8000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
