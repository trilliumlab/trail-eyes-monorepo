import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const geojsonContract = c.router(
  {
    getRoutes: {
      method: 'GET',
      path: '/routes.json',
      summary: 'Get all routes as GeoJSON',
      responses: {
        200: z.record(z.any()),
      },
    },
    getStartMarkers: {
      method: 'GET',
      path: '/start-markers.json',
      summary: 'Get start markers as GeoJSON',
      responses: {
        200: z.record(z.any()),
      },
    },
  },
  {
    pathPrefix: '/geojson',
  },
);

// export const routesRoute = createRoute({
//     method: 'get',
//     path: '/routes.json',
//     summary: 'Get all routes as GeoJSON',
//     description: 'Get all routes as GeoJSON',
//     tags: ['geojson'],
//     responses: {
//       200: {
//         description: 'All routes as GeoJSON',
//       },
//     },
//   });

//   export const startMarkersRoute = createRoute({
//     method: 'get',
//     path: '/start-markers.json',
//     summary: 'Get start markers as GeoJSON',
//     description: 'Get start markers as GeoJSON',
//     tags: ['geojson'],
//     responses: {
//       200: {
//         description: 'Start markers as GeoJSON',
//       },
//     },
//   });
