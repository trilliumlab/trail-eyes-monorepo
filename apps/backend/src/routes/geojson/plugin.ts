import Elysia from 'elysia';

import routes from '~data/routes/routes.json';
import startMarkers from '~data/routes/start-markers.json';

export const geojson = new Elysia({ prefix: 'geojson' })
  .get('/routes.json', () => {
    return routes;
  })
  .get('/start-markers.json', () => {
    return startMarkers;
  });
