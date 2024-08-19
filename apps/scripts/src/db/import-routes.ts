import { db } from '@repo/database';
import routes from '~data/routes/routes.json';

for (const route of routes.features) {
  await db.drizzleTypeboxSchemaTest({});
}

// This shows no error
db.drizzleTypeboxSchemaTest({});
// These show errors
db.typeboxSchemaTest({});
db.typescriptTest({});
