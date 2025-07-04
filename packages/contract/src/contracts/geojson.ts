import { oc } from '@orpc/contract';
import { z } from 'zod';

export const getRoutesContract = oc
  .output(z.record(z.any()));

export const getStartMarkersContract = oc
  .output(z.record(z.any()));

export const geojsonContract = {
  getRoutes: getRoutesContract,
  getStartMarkers: getStartMarkersContract,
};

// const c = initContract();

// export const geojsonContract = c.router(
//   {
//     getRoutes: {
//       method: 'GET',
//       path: '/routes.json',
//       summary: 'Get all routes as GeoJSON',
//       responses: {
//         200: z.record(z.any()),
//       },
//     },
//     getStartMarkers: {
//       method: 'GET',
//       path: '/start-markers.json',
//       summary: 'Get start markers as GeoJSON',
//       responses: {
//         200: z.record(z.any()),
//       },
//     },
//   },
//   {
//     pathPrefix: '/geojson',
//   },
// );
