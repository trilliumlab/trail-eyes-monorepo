'use client';

import { publicEnv } from '@repo/util/public-env';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
import {
  type CircleLayer,
  Layer,
  type LineLayer,
  Map as MapComponent,
  type MapRef,
  Source,
  type SymbolLayer,
} from 'react-map-gl/maplibre';

// maplibre stylesheet
import 'maplibre-gl/dist/maplibre-gl.css';
// Custom dark mode for ui elements
import './trail-eyes-map.css';

export function TrailEyesMap() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  const routesLayer: LineLayer = {
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'stroke'],
      'line-width': 2,
    },
  };
  const hoverRoutesLayer: LineLayer = {
    ...routesLayer,
    id: 'routes-hover',
    paint: {
      ...routesLayer.paint,
      'line-width': 2,
      'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
    },
  };
  const hoverRoutesOutlineLayer: LineLayer = {
    ...routesLayer,
    id: 'routes-hover-outline',
    paint: {
      ...routesLayer.paint,
      'line-width': 10,
      'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.25, 0],
    },
  };
  const hitRoutesLayer: LineLayer = {
    ...routesLayer,
    id: 'routes-hit',
    paint: {
      'line-width': 10,
      'line-opacity': 0,
    },
  };

  const startMarkers: CircleLayer = {
    id: 'start-markers',
    type: 'circle',
    source: 'start-markers',
    paint: {
      'circle-color': darkMode ? '#305530' : '#308830',
      'circle-radius': 4,
    },
  };

  const arrowLayer: SymbolLayer = {
    id: 'route-arrows',
    type: 'symbol',
    source: 'routes',
    layout: {
      'symbol-placement': 'line',
      'symbol-spacing': 50,
      'icon-allow-overlap': true,
      'icon-image': 'sdf:arrow-head',
      'icon-rotate': 90,
      'icon-size': 0.75,
    },
    paint: {
      'icon-color': ['get', 'stroke'],
      'icon-opacity': 0.75,
    },
  };
  const hoverArrowLayer: SymbolLayer = {
    ...arrowLayer,
    id: 'route-arrows-hover',
    layout: {
      ...arrowLayer.layout,
      'icon-size': 0.85,
    },
    paint: {
      ...arrowLayer.paint,
      'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
    },
  };

  const mapRef = useRef<MapRef | null>(null);

  const [activeRoute, setActiveRoute] = useState<number>();

  return (
    <div className="h-full w-full select-none">
      <MapComponent
        ref={mapRef}
        initialViewState={{
          longitude: -122.76892379502566,
          latitude: 45.57416784067063,
          zoom: 11.5,
        }}
        mapStyle={
          resolvedTheme === 'dark' || resolvedTheme === 'light'
            ? `${publicEnv.BACKEND_URL}/styles/${resolvedTheme}.json?key=${publicEnv.PROTO_API_KEY}`
            : undefined
        }
        interactiveLayerIds={['routes-hit']}
        onMouseMove={(event) => {
          const map = mapRef.current;
          if (event.features && event.features.length > 0) {
            const id = event.features[0]?.id as number | undefined;
            if (id) {
              if (map) {
                if (id !== activeRoute && activeRoute) {
                  map.setFeatureState({ source: 'routes', id: activeRoute }, { hover: false });
                }
                map.setFeatureState({ source: 'routes', id: id }, { hover: true });
              }
              setActiveRoute(id);
            }
          } else if (activeRoute) {
            if (map) {
              map.setFeatureState({ source: 'routes', id: activeRoute }, { hover: false });
            }
            setActiveRoute(undefined);
          }
        }}
      >
        <Source id="routes" type="geojson" data={`${publicEnv.BACKEND_URL}/geojson/routes.json`}>
          <Layer {...routesLayer} />
          <Layer {...arrowLayer} />
          <Layer {...hoverRoutesOutlineLayer} />
          <Layer {...hoverRoutesLayer} />
          <Layer {...hoverArrowLayer} />
          <Layer {...hitRoutesLayer} />
        </Source>
        <Source
          id="start-markers"
          type="geojson"
          data={`${publicEnv.BACKEND_URL}/geojson/start-markers.json`}
        >
          <Layer {...startMarkers} />
        </Source>
      </MapComponent>
    </div>
  );
}
