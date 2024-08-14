import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { ThemeId } from '@elysiajs/swagger/scalar/types';

import routes from '~data/routes/routes.json';
import startMarkers from '~data/routes/start-markers.json';

import light from '~data/styles/light.json';
import dark from '~data/styles/dark.json';

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
  .get('/start-markers', () => {
    return startMarkers;
  })
  .get(
    'light',
    ({ query: { key } }) => {
      return {
        ...light,
        sources: {
          protomaps: {
            ...light.sources.protomaps,
            tiles: [light.sources.protomaps.tiles[0] + key],
          },
        },
      };
    },
    {
      query: t.Object({
        key: t.String(),
      }),
    },
  )
  .get(
    'dark',
    ({ query: { key } }) => {
      return {
        ...dark,
        sources: {
          protomaps: {
            ...dark.sources.protomaps,
            tiles: [dark.sources.protomaps.tiles[0] + key],
          },
        },
      };
    },
    {
      query: t.Object({
        key: t.String(),
      }),
    },
  )
  .listen(8000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
