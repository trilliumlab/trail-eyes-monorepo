import { Elysia, t } from 'elysia';
import normalizeUrl from 'normalize-url';
import { env } from '~/env';

import dark from '~data/styles/dark.json';
import light from '~data/styles/light.json';

const querySchema = t.Object({
  key: t.String(),
  mobile: t.BooleanString({ default: false }),
});

function createTheme(key: string, theme: 'dark' | 'light' = 'light', mobile = false) {
  const base = theme === 'light' ? light : dark;
  return {
    ...base,
    glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sprite: [
      {
        id: 'default',
        url: normalizeUrl(`${env.BACKEND_URL}/sprites/${theme}`),
      },
      {
        id: 'sdf',
        url: normalizeUrl(`${env.BACKEND_URL}/sprites/sdf`),
      },
    ],
    sources: {
      protomaps: {
        attribution: mobile
          ? '<a href="https://github.com/protomaps/basemaps">© Protomaps</a> <a href="https://openstreetmap.org">© OpenStreetMap</a>'
          : '<a href="https://github.com/protomaps/basemaps">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
        type: 'vector',
        tiles: [`https://api.protomaps.com/tiles/v3/{z}/{x}/{y}.mvt?key=${key}`],
        maxzoom: 15,
      },
    },
  };
}

export const styles = new Elysia({ prefix: 'styles' })
  .get(
    'light.json',
    ({ query: { key, mobile } }) => {
      return createTheme(key, 'light', mobile);
    },
    {
      query: querySchema,
    },
  )
  .get(
    'dark.json',
    ({ query: { key, mobile } }) => {
      return createTheme(key, 'dark', mobile);
    },
    {
      query: querySchema,
    },
  );
