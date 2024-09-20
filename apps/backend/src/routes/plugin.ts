import { OpenAPIHono } from '@hono/zod-openapi';
import { geojson } from './geojson/plugin';
import { sprites } from './sprites/plugin';
import { styles } from './styles/plugin';
import { auth } from './auth/plugin';

export const routes = new OpenAPIHono()
  .route('/auth', auth)
  .route('/geojson', geojson)
  .route('/sprites', sprites)
  .route('/styles', styles);
