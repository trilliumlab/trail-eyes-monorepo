import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { db } from '@repo/database';
import { memoize } from '@repo/util';
import type { Feature, FeatureCollection } from 'geojson';

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

export const routesRoute = createRoute({
  method: 'get',
  path: '/routes.json',
  summary: 'Get all routes as GeoJSON',
  description: 'Get all routes as GeoJSON',
  tags: ['geojson'],
  responses: {
    200: {
      description: 'All routes as GeoJSON',
    },
  },
});

export const startMarkersRoute = createRoute({
  method: 'get',
  path: '/start-markers.json',
  summary: 'Get start markers as GeoJSON',
  description: 'Get start markers as GeoJSON',
  tags: ['geojson'],
  responses: {
    200: {
      description: 'Start markers as GeoJSON',
    },
  },
});

export const geojson = new OpenAPIHono()
  .openapi(routesRoute, async (ctx) => ctx.json(await routesJsonMemo()))
  .openapi(startMarkersRoute, async (ctx) => ctx.json(startMarkers));
