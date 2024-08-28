import { api } from '../../index.test';
import { describe, expect, it } from 'bun:test'

describe('geojson', () => {
  it('routes.json is valid geojson', async () => {
    const res = await api.geojson['routes.json'].get();
    expect(res.status).toBe(200)
    expect(res.data).toBeDefined();
    expect(res.data!.type).toBe('FeatureCollection')
  });
  it('start-markers.json is valid geojson', async () => {
    const res = await api.geojson['start-markers.json'].get();
    expect(res.status).toBe(200)
    expect(res.data).toBeDefined();
    expect(res.data!.type).toBe('FeatureCollection')
  });
});
