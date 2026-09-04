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

const reportsJsonMemo = memoize(
  async () => {
    const reports = await db.getAllReports();
    const features = reports.map(
      (report) =>
        ({
          id: report.id,
          type: 'Feature',
          properties: {
            creatorDeviceId: report.creatorDeviceId,
            category: report.category,
            route: report.route,
            trail: report.trail,
            localId: report.localId,
            image: report.image,
            blurHash: report.blurHash,
            creatorUserId: report.creatorUserId,
            description: report.description,
            status: report.status,
            reportedAt: report.reportedAt.getMilliseconds().toString(),
            updatedAt: report.updatedAt.getMilliseconds().toString(),
          },
          geometry: report.geometry,
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

export const getReports = pub.geojson.getReports.handler(async () => {
  return await reportsJsonMemo();
});

export const geojsonRouter = {
  getRoutes,
  getStartMarkers,
  getReports,
};
