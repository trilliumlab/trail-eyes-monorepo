import { Elysia } from 'elysia';
import { geojson } from './geojson/plugin';
import { sprites } from './sprites/plugin';
import { styles } from './styles/plugin';
import { auth } from './auth/plugin';

export const routes = new Elysia().use(auth).use(geojson).use(sprites).use(styles);
