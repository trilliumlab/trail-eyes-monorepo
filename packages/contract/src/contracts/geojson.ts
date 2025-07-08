import { oc } from '@orpc/contract';
import { z } from 'zod';

export const getRoutesContract = oc
  .route({ 
    method: 'GET', 
    path: '/routes.json',
    summary: 'Get all routes as GeoJSON',
  })
  .output(z.record(z.any()));

export const getStartMarkersContract = oc
  .route({ 
    method: 'GET',
    path: '/start-markers.json',
    summary: 'Get all start markers as GeoJSON',
  })
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
