'use client';

import {
  type CircleLayer,
  Layer,
  type LineLayer,
  Map as MapComponent,
  Source,
  type SymbolLayer,
} from 'react-map-gl/maplibre';

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
      // 'line-color': darkMode ? '#aa1100' : '#FF2200',
      'line-color': ['get', 'stroke'],
      'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 6, 0, 12, 2, 22, 128],
      'line-opacity': ['interpolate', ['exponential', 1.6], ['zoom'], 6, 0, 10, 1],
    },
  };

  const startMarkers: CircleLayer = {
    id: 'start-markers',
    type: 'circle',
    source: 'start-markers',
    paint: {
      'circle-color': darkMode ? '#305530' : '#308830',
      'circle-radius': ['interpolate', ['exponential', 1.6], ['zoom'], 6, 0, 12, 6, 22, 256],
    },
  };

  const symbolLayer: SymbolLayer = {
    id: 'route-arrows',
    type: 'symbol',
    source: 'routes',
    layout: {
      'symbol-placement': 'line',
      'symbol-spacing': ['interpolate', ['exponential', 1.6], ['zoom'], 12, 100, 22, 1000],
      'icon-allow-overlap': true,
      'icon-image': 'sdf:arrow-head',
      'icon-rotate': 90,
      'icon-size': ['interpolate', ['exponential', 1.6], ['zoom'], 6, 0, 12, 0.14, 22, 6.4],
    },
    paint: {
      'icon-color': ['get', 'stroke'],
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
      mapStyle={`http://localhost:8000/styles/${darkMode ? 'dark' : 'light'}.json?key=${
        process.env.NEXT_PUBLIC_PROTO_API_KEY
      }`}
    >
      <Source id="routes" type="geojson" data="http://localhost:8000/geojson/routes.json">
        <Layer {...routes} beforeId="physical_line_waterway_label" />
        <Layer {...symbolLayer} beforeId="physical_line_waterway_label" />
      </Source>
      <Source
        id="start-markers"
        type="geojson"
        data="http://localhost:8000/geojson/start-markers.json"
      >
        <Layer {...startMarkers} beforeId="physical_line_waterway_label" />
      </Source>
    </MapComponent>
  );
}
