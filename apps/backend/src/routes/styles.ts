import { publicEnv } from '@repo/env';
import { pub } from '../orpc';
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

export const getLightStyle = pub.styles.getLightStyle.handler(async ({ input }) => {
  return createTheme(input.key, 'light', input.mobile);
});

export const getDarkStyle = pub.styles.getDarkStyle.handler(async ({ input }) => {
  return createTheme(input.key, 'dark', input.mobile);
});

export const stylesRouter = {
  getLightStyle,
  getDarkStyle,
};
