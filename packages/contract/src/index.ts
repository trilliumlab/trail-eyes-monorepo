import { initContract } from '@ts-rest/core';
import { authContract } from './auth';
import { geojsonContract } from './geojson';
import { spritesContract } from './sprites';
import { stylesContract } from './styles';

const c = initContract();

export const contract = c.router({
  auth: authContract,
  geojson: geojsonContract,
  sprites: spritesContract,
  styles: stylesContract,
});
