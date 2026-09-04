import type { LineString } from 'geojson';

const epqsBaseUrl = 'https://epqs.nationalmap.gov/v1/json';
export async function getElevation([x, y]: [number, number]) {
  const params = new URLSearchParams({
    x: x.toString(),
    y: y.toString(),
    wkid: '4326',
    units: 'Meters',
    includeDate: 'false',
  });
  const reqUrl = `${epqsBaseUrl}?${params.toString()}`;
  try {
    const res = await fetch(reqUrl);
    const resJson = await res.json();
    if (!resJson || resJson.value === undefined) return 0;
    const elev = +resJson.value;
    return Number.isNaN(elev) ? 0 : elev;
  } catch {
    return 0;
  }
}

export async function addElevationToLine(geometry: LineString) {
  // Sequential (not Promise.all) to avoid overwhelming the USGS elevation
  // API, which drops connections/returns null under concurrent load.
  const coordinates: number[][] = [];
  for (const [x, y] of geometry.coordinates) {
    if (!x || !y) {
      throw new Error('Coordinates must be at least 2d and non-null');
    }
    const elev = await getElevation([x, y]);
    coordinates.push([x, y, elev]);
  }
  return {
    ...geometry,
    coordinates,
  };
}
