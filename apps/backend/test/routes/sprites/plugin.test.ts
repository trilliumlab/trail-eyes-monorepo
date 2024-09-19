import { describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { app } from '~/index';

const sheets = ['light', 'light@2x', 'dark', 'dark@2x', 'sdf'] as const;

describe('/sprites', () => {
  for (const sheet of sheets) {
    it(`/${sheet}.json is a valid sprite data sheet`, async () => {
      const res = await testClient(app).sprites[':path'].$get({
        param: { path: `${sheet}.json` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeDefined();
      if (data) {
        for (const entry of Object.values(data)) {
          expect(entry).toMatchObject({
            height: expect.any(Number),
            width: expect.any(Number),
            pixelRatio: expect.any(Number),
            x: expect.any(Number),
            y: expect.any(Number),
          });
        }
      }
    });
    it(`/${sheet}.png is a valid sprite asset sheet`, async () => {
      const res = await testClient(app).sprites[':path'].$get({
        param: { path: `${sheet}.png` },
      });
      expect(res.status).toBe(200);
      const data = await res.blob();
      expect(data).toBeDefined();
      if (data) {
        expect(data.type).toBe('image/png');
      }
    });
  }
});
