import { api } from '../../index.test';
import { describe, expect, it } from 'bun:test';

const sheets = ['light', 'light@2x', 'dark', 'dark@2x', 'sdf'] as const;

describe('/sprites', () => {
  for (const sheet of sheets) {
    it(`/${sheet}.json is a valid sprite data sheet`, async () => {
      const res = await api.sprites[`${sheet}.json`].get();
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      if (res.data) {
        for (const data of Object.values(res.data)) {
          expect(data).toMatchObject({
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
      const res = await api.sprites[`${sheet}.png`].get();
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.slice(1, 4)).toMatch(/png/i);
      }
    });
  }
});
