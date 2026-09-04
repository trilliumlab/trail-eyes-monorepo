'use client';

import { publicEnv } from '@repo/env';
import { useTheme } from '@repo/ui/components/theme';
import { Map as MapComponent, Marker } from 'react-map-gl/dist/es5/exports-maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

/** A small, mostly-static map centered on a single report's location. */
export function ReportLocationMap({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) {
  const theme = useTheme();

  return (
    <div className="w-full h-40 rounded-md overflow-hidden">
      <MapComponent
        initialViewState={{ longitude, latitude, zoom: 14 }}
        scrollZoom={false}
        dragRotate={false}
        mapStyle={
          theme.resolved === 'dark' || theme.resolved === 'light'
            ? `${publicEnv().backendUrl}/styles/${theme.resolved}.json?key=${publicEnv().protoApiKey}`
            : undefined
        }
      >
        <Marker longitude={longitude} latitude={latitude} color="red" />
      </MapComponent>
    </div>
  );
}
