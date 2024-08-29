import { api } from '../../index.test';
import { describe, expect, it } from 'bun:test';

describe('/geojson', () => {
  it('/routes.json is FeatureCollection of LineStrings', async () => {
    const res = await api.geojson['routes.json'].get();
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    if (res.data) {
      expect(res.data.type).toBe('FeatureCollection');
      for (const feature of res.data.features) {
        expect(feature.type).toBe('Feature');
        expect(feature.geometry.type).toBe('LineString');
      }
    }
  });
  it('/start-markers.json is FeatureCollection of Points', async () => {
    const res = await api.geojson['start-markers.json'].get();
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    if (res.data) {
      expect(res.data.type).toBe('FeatureCollection');
      for (const feature of res.data.features) {
        expect(feature.type).toBe('Feature');
        expect(feature.geometry.type).toBe('Point');
      }
    }
  });
});
