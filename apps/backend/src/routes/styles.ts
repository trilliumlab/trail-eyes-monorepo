import { contract } from '@repo/contract';
import { publicEnv } from '@repo/env';
import { initServer } from '@ts-rest/fastify';
import normalizeUrl from 'normalize-url';

import dark from '~data/styles/dark.json';
import light from '~data/styles/light.json';

function createTheme(key: string, theme: 'dark' | 'light' = 'light', mobile = false) {
  const base = theme === 'light' ? light : dark;
  return {
    ...base,
    glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sprite: [
      {
        id: 'default',
        url: normalizeUrl(`${publicEnv().backendUrl}/sprites/${theme}`),
      },
      {
        id: 'sdf',
        url: normalizeUrl(`${publicEnv().backendUrl}/sprites/sdf`),
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

const s = initServer();

export const stylesRouter = s.router(contract.styles, {
  getLightStyle: async ({ query: { key, mobile } }) => {
    return { status: 200, body: createTheme(key, 'light', mobile) };
  },
  getDarkStyle: async ({ query: { key, mobile } }) => {
    return { status: 200, body: createTheme(key, 'dark', mobile) };
  },
});
