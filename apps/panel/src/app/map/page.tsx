'use client';
import { Map as MapComponent, Source, Layer, LineLayer, CircleLayer } from 'react-map-gl/maplibre';

export default function MapPage() {
  const darkMode = true;

  const lineWidth = 2;
  const routes: LineLayer = {
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': darkMode ? '#aa1100' : '#FF2200',
      // 'line-width': ['interpolate', ['exponential', 2], ['zoom'], 10, 1, 12, 2, 16, 8, 20, 32],
      'line-width': ['interpolate', ['exponential', 2], ['zoom'], 6, 0, 12, 2, 22, 256],
      'line-opacity': ['interpolate', ['exponential', 2], ['zoom'], 6, 0, 10, 1],
    },
  };

  const startMarkers: CircleLayer = {
    id: 'start-markers',
    type: 'circle',
    source: 'start-markers',
    paint: {
      'circle-color': darkMode ? '#305530' : '#308830',
      'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 2, 12, 4, 16, 12, 20, 32],
    },
  };

  return (
    <MapComponent
      initialViewState={{
        longitude: -122.76892379502566,
        latitude: 45.57416784067063,
        zoom: 11.5,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={`https://api.protomaps.com/styles/v2/${darkMode ? 'dark' : 'light'}.json?key=${
        process.env.NEXT_PUBLIC_PROTO_API_KEY
      }`}
    >
      <Source id="routes" type="geojson" data="http://localhost:8000/routes">
        <Layer {...routes} />
      </Source>
      <Source id="start-markers" type="geojson" data="http://localhost:8000/start-markers">
        <Layer {...startMarkers} />
      </Source>
    </MapComponent>
  );
}
