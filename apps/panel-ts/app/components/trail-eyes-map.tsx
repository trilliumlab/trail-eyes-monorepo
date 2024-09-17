'use client';

import { publicEnv } from '@repo/util/public-env';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import {
  type CircleLayer,
  GeolocateControl,
  Layer,
  type LineLayer,
  Map as MapComponent,
  type MapRef,
  NavigationControl,
  Source,
  type SymbolLayer,
  useMap,
} from 'react-map-gl/maplibre';

// maplibre stylesheet
import 'maplibre-gl/dist/maplibre-gl.css';
// Custom dark mode for ui elements
import './trail-eyes-map.css';
import { Button } from '@repo/ui/button';
import { Expand, Minus, Plus, Shrink } from 'lucide-react';
import { Separator } from '@repo/ui/separator';

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeRoute, setActiveRoute] = useState<number>();

  return (
    <div ref={containerRef} className="h-full w-full select-none relative">
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
        <MapControls
          onFullscreenToggle={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              containerRef.current?.requestFullscreen?.();
            }
          }}
        />
      </MapComponent>
    </div>
  );
}

function MapControls({ onFullscreenToggle }: { onFullscreenToggle: () => void }) {
  const { current: map } = useMap();

  // Listen to changes to fullscreen state to update button icon
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="absolute right-0 m-2 grid">
      {document.fullscreenEnabled && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFullscreenToggle}
          className="border-border-map bg-card mb-2"
        >
          {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => map?.zoomIn()}
        className="border-border-map bg-card rounded-b-none border-b-0 z-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Separator className="bg-border-map z-10" />
      {/* Prevent button scale from revealing map behind it */}
      <div className="relative mx-0 w-full z-0">
        <div className="absolute right-0 left-0 h-[5px] -top-[3px] mx-[1px] bg-accent" />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => map?.zoomOut()}
        className="border-border-map bg-card rounded-t-none border-t-0 z-10"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}
