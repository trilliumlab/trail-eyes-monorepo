'use client';
import { Map as MapComponent } from 'react-map-gl/maplibre';

export default function MapPage() {
  return (
    <MapComponent
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={`https://api.protomaps.com/styles/v2/light.json?key=${process.env.NEXT_PUBLIC_PROTO_API_KEY}`}
    />
  );
}
