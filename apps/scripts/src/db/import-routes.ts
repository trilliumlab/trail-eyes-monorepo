import { db } from '@repo/database';
import type { FeatureCollection } from 'geojson';
import { addElevationToLine } from './elevation';

const routesFile = Bun.file(Bun.fileURLToPath(import.meta.resolve('~data/routes/routes.json')));
const routes: FeatureCollection = await routesFile.json();
console.log(`Loaded routes json with ${routes.features.length} entries.`);

for (const [i, route] of routes.features.entries()) {
  if (route.geometry.type === 'LineString') {
    console.log(`Route ${i}: Fetching elevation.`);
    const geometry = await addElevationToLine(route.geometry);
    console.log(`Route ${i}: Elevation added, inserting into db.`);

    await db.drizzleTypeboxSchemaTest({
      originalId: route.id?.toString(),
      description: route.properties?.description,
      creator: route.properties?.creator,
      title: route.properties?.title,
      stroke: route.properties?.stroke,
      updated: new Date(route.properties?.updated),
      geometry: geometry,
    });
  }
}

process.exit(0);
