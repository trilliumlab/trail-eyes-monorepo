import { Elysia } from 'elysia';

import darkJson from '../../../../../data/sprites/out/dark.json';
import dark2xJson from '../../../../../data/sprites/out/dark@2x.json';
import lightJson from '../../../../../data/sprites/out/light.json';
import light2xJson from '../../../../../data/sprites/out/light@2x.json';
import sdfJson from '../../../../../data/sprites/out/sdf.json';
import sdf2xJson from '../../../../../data/sprites/out/sdf@2x.json';

function load(specifier: string) {
  return Bun.file(Bun.fileURLToPath(import.meta.resolve(specifier)));
}

export const sprites = new Elysia({ prefix: '/sprites' })
  .get('/light.json', () => lightJson)
  .get('/light@2x.json', () => light2xJson)
  .get('/dark.json', () => darkJson)
  .get('/dark@2x.json', () => dark2xJson)
  .get('/sdf.json', () => sdfJson)
  .get('/sdf@2x.json', () => sdf2xJson)
  .get('/light.png', () => load('../../../../../data/sprites/out/light.png'))
  .get('/light@2x.png', () => load('../../../../../data/sprites/out/light@2x.png'))
  .get('/dark.png', () => load('../../../../../data/sprites/out/dark.png'))
  .get('/dark@2x.png', () => load('../../../../../data/sprites/out/dark@2x.png'))
  .get('/sdf.png', () => load('../../../../../data/sprites/out/sdf.png'))
  .get('/sdf@2x.png', () => load('../../../../../data/sprites/out/sdf@2x.png'));
