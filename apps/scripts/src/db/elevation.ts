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
  const res = await fetch(reqUrl);
  const resJson = await res.json();
  const elev = +resJson.value;
  return elev;
}

export async function addElevationToLine(geometry: LineString) {
  const promises = geometry.coordinates.map(async ([x, y]) => {
    if (!x || !y) {
      throw new Error('Coordinates must be at least 2d and non-null');
    }
    const elev = await getElevation([x, y]);
    return [x, y, elev] as const satisfies number[];
  });
  const coordinates = await Promise.all(promises);
  return {
    ...geometry,
    coordinates,
  };
}
