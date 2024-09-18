import { api } from '../../index.test';
import { describe, expect, it } from 'bun:test';
import { publicEnv } from '@repo/env';

const styles = ['light.json', 'dark.json'] as const;

describe('/styles', () => {
  for (const style of styles) {
    for (const mobile of [true, false]) {
      it(`/${style}?mobile=${mobile} is a valid style`, async () => {
        const res = await api.styles[style].get({
          query: { key: publicEnv().protoApiKey, mobile },
        });
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined();
        if (res.data) {
          expect(res.data).toMatchObject({
            version: expect.any(Number),
            name: expect.any(String),
            sources: expect.any(Object),
            layers: expect.any(Array),
            glyphs: expect.any(String),
            sprite: expect.any(Array),
          });
        }
      });
    }
  }
});
