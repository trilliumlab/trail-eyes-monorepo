import { describe, expect, it } from 'bun:test';
import { publicEnv } from '@repo/env';
import { tez } from '@repo/zod-utils';
import { testClient } from 'hono/testing';
import { app } from '~/index';

const styles = ['light.json', 'dark.json'] as const;

describe('/styles', () => {
  for (const style of styles) {
    for (const mobile of [true, false]) {
      it(`/${style}?mobile=${mobile} is a valid style`, async () => {
        const res = await testClient(app).styles[style].$get({
          query: { key: publicEnv().protoApiKey, mobile: mobile.toString() },
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toBeDefined();
        if (data) {
          expect(data).toMatchObject({
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
