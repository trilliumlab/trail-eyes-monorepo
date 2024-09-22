import { contract } from '@repo/contract';
import { db } from '@repo/database';
import { memoize } from '@repo/util';
import { initServer } from '@ts-rest/fastify';
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

const s = initServer();
export const geojsonRouter = s.router(contract.geojson, {
  getRoutes: async () => {
    return { status: 200, body: await routesJsonMemo() };
  },
  getStartMarkers: async () => {
    return { status: 200, body: startMarkers };
  },
});
