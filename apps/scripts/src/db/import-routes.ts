import { resolve } from 'node:path';
import { db } from '@repo/database';
import type { FeatureCollection } from 'geojson';
import { addElevationToLine } from './elevation';

const cmdWorkingDir = process.env.CMD_WD;
if (!cmdWorkingDir) {
  console.error('Script must be called from root package.json!');
  console.error('Usage: bun db:import-routes path/to/routes.json');
  process.exit(1);
}

if (process.argv.length !== 3) {
  console.error('Invalid number of cli arguments!');
  console.error('Usage: bun db:import-routes path/to/routes.json');
  process.exit(2);
}
const path = resolve(cmdWorkingDir, process.argv[2] as string);
console.log(path);
const routesFile = Bun.file(path);
if (!(await routesFile.exists())) {
  console.error(`File 'file://${path}' does not exist!`);
  console.error('Usage: bun db:import-routes path/to/routes.json');
  process.exit(1);
}

const routes: FeatureCollection = await routesFile.json();
console.log(`Loaded routes json with ${routes.features.length} entries.`);

for (const [i, route] of routes.features.entries()) {
  if (route.geometry.type === 'LineString') {
    console.log(`Route ${i}: Fetching elevation.`);
    const geometry = await addElevationToLine(route.geometry);
    console.log(`Route ${i}: Elevation added, inserting into db.`);

    await db.addRoute({
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
