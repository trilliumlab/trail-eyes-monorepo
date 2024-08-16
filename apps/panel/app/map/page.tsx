'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type CircleLayer,
  Layer,
  type LineLayer,
  Map as MapComponent,
  type MapLayerMouseEvent,
  type MapRef,
  Source,
  type SymbolLayer,
  useMap,
} from 'react-map-gl/maplibre';

export default function MapPage() {
  const darkMode = true;

  const hoverMod = 1.5;

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
      'line-width': 3,
    },
  };
  const hoverRoutesLayer: LineLayer = {
    id: 'routes-hover',
    type: 'line',
    source: 'routes',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['get', 'stroke'],
      'line-width': 4,
      'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
    },
  };
  const hitRoutesLayer: LineLayer = {
    id: 'routes-hit',
    type: 'line',
    source: 'routes',
    paint: {
      'line-width': 10,
      'line-opacity': 0,
    },
  };

  const markerWidth = 1;
  const startMarkers: CircleLayer = {
    id: 'start-markers',
    type: 'circle',
    source: 'start-markers',
    paint: {
      'circle-color': darkMode ? '#305530' : '#308830',
      'circle-radius': 2,
    },
  };

  const arrowWidth = 1;
  const arrowLayer: SymbolLayer = {
    id: 'route-arrows',
    type: 'symbol',
    source: 'routes',
    layout: {
      'symbol-placement': 'line',
      'symbol-spacing': 100,
      'icon-allow-overlap': true,
      'icon-image': 'sdf:arrow-head',
      'icon-rotate': 90,
      'icon-size': 0.25,
    },
    paint: {
      'icon-color': ['get', 'stroke'],
    },
  };
  const hoverArrowLayer: SymbolLayer = {
    id: 'route-arrows-hover',
    type: 'symbol',
    source: 'routes',
    layout: {
      'symbol-placement': 'line',
      'symbol-spacing': 100,
      'icon-allow-overlap': true,
      'icon-image': 'sdf:arrow-head',
      'icon-rotate': 90,
      'icon-size': 0.3,
    },
    paint: {
      'icon-color': ['get', 'stroke'],
      'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
    },
  };

  const mapRef = useRef<MapRef | null>(null);

  const [activeRoute, setActiveRoute] = useState<number>();

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        longitude: -122.76892379502566,
        latitude: 45.57416784067063,
        zoom: 11.5,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={`http://localhost:8000/styles/${darkMode ? 'dark' : 'light'}.json?key=${
        process.env.NEXT_PUBLIC_PROTO_API_KEY
      }`}
      interactiveLayerIds={['routes-hit']}
      onMouseMove={(event) => {
        const map = mapRef.current;
        if (event.features && event.features.length > 0) {
          const id = event.features[0]?.id as number;
          if (map) {
            if (id !== activeRoute) {
              map.setFeatureState({ source: 'routes', id: activeRoute }, { hover: false });
            }
            map.setFeatureState({ source: 'routes', id: id }, { hover: true });
          }
          setActiveRoute(id);
        } else if (activeRoute) {
          if (map) {
            map.setFeatureState({ source: 'routes', id: activeRoute }, { hover: false });
          }
          setActiveRoute(undefined);
        }
      }}
    >
      <Source id="routes" type="geojson" data="http://localhost:8000/geojson/routes.json">
        <Layer {...routesLayer} beforeId="physical_line_waterway_label" />
        <Layer {...arrowLayer} beforeId="physical_line_waterway_label" />
        <Layer {...hoverRoutesLayer} beforeId="physical_line_waterway_label" />
        <Layer {...hoverArrowLayer} beforeId="physical_line_waterway_label" />
        <Layer {...hitRoutesLayer} />
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
