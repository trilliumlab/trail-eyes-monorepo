import { describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { app } from '~/index';

describe('/geojson', () => {
  it('/routes.json is FeatureCollection of LineStrings', async () => {
    const res = await testClient(app).geojson['routes.json'].$get();
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data).toBeObject();
    if (data) {
      expect(data.type).toBe('FeatureCollection');
      for (const feature of data.features) {
        expect(feature.type).toBe('Feature');
        expect(feature.geometry.type).toBe('LineString');
      }
    }
  });
  it('/start-markers.json is FeatureCollection of Points', async () => {
    const res = await testClient(app).geojson['start-markers.json'].$get();
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data).toBeObject();
    if (data) {
      expect(data.type).toBe('FeatureCollection');
      for (const feature of data.features) {
        expect(feature.type).toBe('Feature');
        expect(feature.geometry.type).toBe('Point');
      }
    }
  });
});
