import { tez } from '@repo/zod-utils';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const QuerySchema = z.object({
  key: z.string(),
  mobile: tez.coerce.boolean().default(false),
});

const c = initContract();

export const stylesContract = c.router(
  {
    getLightStyle: {
      method: 'GET',
      path: '/light.json',
      summary: 'Get light style',
      query: QuerySchema,
      responses: {
        200: z.any(),
      },
    },
    getDarkStyle: {
      method: 'GET',
      path: '/dark.json',
      summary: 'Get dark style',
      query: QuerySchema,
      responses: {
        200: z.any(),
      },
    },
  },
  {
    pathPrefix: '/styles',
  },
);

// import dark from '~data/styles/dark.json';
// import light from '~data/styles/light.json';

// function createTheme(key: string, theme: 'dark' | 'light' = 'light', mobile = false) {
//   const base = theme === 'light' ? light : dark;
//   return {
//     ...base,
//     glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
//     sprite: [
//       {
//         id: 'default',
//         url: normalizeUrl(`${publicEnv().backendUrl}/sprites/${theme}`),
//       },
//       {
//         id: 'sdf',
//         url: normalizeUrl(`${publicEnv().backendUrl}/sprites/sdf`),
//       },
//     ],
//     sources: {
//       protomaps: {
//         attribution: mobile
//           ? '<a href="https://github.com/protomaps/basemaps">© Protomaps</a> <a href="https://openstreetmap.org">© OpenStreetMap</a>'
//           : '<a href="https://github.com/protomaps/basemaps">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
//         type: 'vector',
//         tiles: [`https://api.protomaps.com/tiles/v3/{z}/{x}/{y}.mvt?key=${key}`],
//         maxzoom: 15,
//       },
//     },
//   };
// }

// export const lightRoute = createRoute({
//   method: 'get',
//   path: '/light.json',
//   summary: 'Get light style',
//   description: 'Get light style',
//   tags: ['styles'],
//   request: {
//     query: QuerySchema,
//   },
//   responses: {
//     200: {
//       description: 'Light style',
//     },
//   },
// });

// export const darkRoute = createRoute({
//   method: 'get',
//   path: '/dark.json',
//   summary: 'Get dark style',
//   description: 'Get dark style',
//   tags: ['styles'],
//   request: {
//     query: QuerySchema,
//   },
//   responses: {
//     200: {
//       description: 'Dark style',
//     },
//   },
// });

// export const styles = new OpenAPIHono()
//   .openapi(lightRoute, async (ctx) => {
//     const { key, mobile } = ctx.req.valid('query');
//     return ctx.json(createTheme(key, 'light', mobile));
//   })
//   .openapi(darkRoute, async (ctx) => {
//     const { key, mobile } = ctx.req.valid('query');
//     return ctx.json(createTheme(key, 'dark', mobile));
//   });
