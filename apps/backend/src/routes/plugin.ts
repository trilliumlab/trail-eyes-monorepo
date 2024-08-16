import { Elysia } from 'elysia';
import { geojson } from './geojson/plugin';
import { styles } from './styles/plugin';

export const routes = new Elysia().use(geojson).use(styles);
