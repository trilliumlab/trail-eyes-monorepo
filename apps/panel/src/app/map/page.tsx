'use client';
import { Map as MapComponent, Source, Layer, LineLayer } from 'react-map-gl/maplibre';

export default function MapPage() {
  const darkMode = false;

  const routesLayer: LineLayer = {
    id: 'routes-layer',
    type: 'line',
    source: 'routes-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': darkMode ? '#aa1100' : '#FF2200',
      'line-width': 3,
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
      <Source id="routes-source" type="geojson" data="http://localhost:8000/routes">
        <Layer {...routesLayer} />
      </Source>
    </MapComponent>
  );
}
