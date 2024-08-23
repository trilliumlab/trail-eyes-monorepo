import Elysia from 'elysia';
import type { Feature, FeatureCollection } from 'geojson';
import { db } from '@repo/database';
import { memoize } from '@repo/util';

import startMarkers from '~data/routes/start-markers.json';

const routesJsonMemo = memoize(
  async () => {
    const routes = await db.paths.getAllRoutes();
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

export const geojson = new Elysia({ prefix: 'geojson' })
  .get('/routes.json', async () => await routesJsonMemo())
  .get('/start-markers.json', () => {
    return startMarkers;
  });
