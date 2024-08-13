import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { ThemeId } from '@elysiajs/swagger/scalar/types';
import routes from '~data/routes/routes.json';

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
  .get('/routes', () => {
    return routes;
  })
  .listen(8000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
