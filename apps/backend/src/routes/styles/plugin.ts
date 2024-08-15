import { Elysia, t } from 'elysia';

import light from '~data/styles/light.json';
import dark from '~data/styles/dark.json';

const querySchema = t.Object({
  key: t.String(),
  mobile: t.BooleanString(),
});

function createTheme(key: string, darkMode = false, mobile = false) {
  const base = darkMode ? dark : light;
  return {
    ...base,
    sources: {
      protomaps: {
        ...base.sources.protomaps,
        attribution: mobile
          ? '<a href="https://github.com/protomaps/basemaps">© Protomaps</a> <a href="https://openstreetmap.org">© OpenStreetMap</a>'
          : base.sources.protomaps.attribution,
        tiles: [base.sources.protomaps.tiles[0] + key],
      },
    },
  };
}

export const styles = new Elysia({ prefix: 'styles' })
  .get(
    'light',
    ({ query: { key, mobile } }) => {
      return createTheme(key, false, mobile);
    },
    {
      query: querySchema,
    },
  )
  .get(
    'dark',
    ({ query: { key, mobile } }) => {
      return createTheme(key, true, mobile);
    },
    {
      query: querySchema,
    },
  );
