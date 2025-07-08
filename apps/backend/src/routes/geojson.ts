import { db } from '@repo/database';
import { memoize } from '@repo/util';
import { pub } from '../orpc';
import type { Feature, FeatureCollection } from 'geojson';
import startMarkers from '~data/routes/start-markers.json';

const routesJsonMemo = memoize(
  async () => {
    const routes = await db.getAllRoutes();
    const features = routes.map(
      (route) =>
        ({
          id: route.id,
          type: 'Feature',
          properties: {
            originalId: route.originalId,
            title: route.title,
            description: route.description,
            creator: route.creator,
            stroke: route.stroke,
            updated: route.updated.getMilliseconds().toString(),
          },
          geometry: route.geometry,
        }) satisfies Feature,
    );

    return {
      type: 'FeatureCollection',
      features: features,
    } satisfies FeatureCollection;
  },
  {
    refreshMilliseconds: 5 * 60 * 1000,
    expiresMilliseconds: 15 * 60 * 1000,
  },
);

export const getRoutes = pub.geojson.getRoutes.handler(async () => {
  return await routesJsonMemo();
});

export const getStartMarkers = pub.geojson.getStartMarkers.handler(async () => {
  return startMarkers;
});

export const geojsonRouter = {
  getRoutes,
  getStartMarkers,
};
