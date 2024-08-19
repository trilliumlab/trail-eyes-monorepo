import { db } from '@repo/database';
import routes from '~data/routes/routes.json';

for (const route of routes.features) {
  await db.addRoute({});
}
