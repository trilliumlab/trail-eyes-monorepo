import { Elysia } from 'elysia';
import { styles } from './styles/plugin';
import { geojson } from './geojson/plugin';

export const routes = new Elysia().use(geojson).use(styles);
