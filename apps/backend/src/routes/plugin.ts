import { Elysia } from 'elysia';
import { geojson } from './geojson/plugin';
import { styles } from './styles/plugin';
import { sprites } from './sprites/plugin';

export const routes = new Elysia().use(geojson).use(sprites).use(styles);
