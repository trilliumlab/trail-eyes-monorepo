'use client';

import { publicEnv } from '@repo/env';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { useTheme } from '@repo/ui/components/theme';
import { Expand, Minus, Plus, Shrink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  type CircleLayer,
  Layer,
  type LineLayer,
  Map as MapComponent,
  type MapRef,
  Source,
  type SymbolLayer,
  useMap,
} from 'react-map-gl/dist/es5/exports-maplibre';

// maplibre stylesheet
import 'maplibre-gl/dist/maplibre-gl.css';
// Custom dark mode for ui elements
import './trail-eyes-map.css';

export type MapReport = {
  id: number | string;
  localId: string;
  status: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number] | [number, number, number];
  };
};

type TrailEyesMapProps = {
  reports?: MapReport[];
  selectedReportId?: string;
  onReportSelect?: (report: MapReport) => void;
  className?: string;
  focusZoom?: number;
};

export function TrailEyesMap({
  reports,
  selectedReportId,
  onReportSelect,
  className = '',
  focusZoom = 15,
}: TrailEyesMapProps = {}) {
  const theme = useTheme();
  const darkMode = theme.resolved === 'dark';

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

  const confirmedReportsLayer: SymbolLayer = {
    id: 'confirmed-reports',
    type: 'symbol',
    source: 'confirmed-reports',
    layout: {
      'icon-image': 'report_active',
      'icon-size': 1,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  };

  const unconfirmedReportsLayer: SymbolLayer = {
    id: 'unconfirmed-reports',
    type: 'symbol',
    source: 'unconfirmed-reports',
    layout: {
      'icon-image': 'report_unconfirmed',
      'icon-size': 1,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
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
  const [fetchedReports, setFetchedReports] = useState<MapReport[]>([]);

  useEffect(() => {
    if (reports) {
      return;
    }

    async function loadReports() {
      const response = await fetch(`${publicEnv().backendUrl}/reports/report`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        return;
      }

      setFetchedReports(await response.json());
    }

    loadReports();
  }, [reports]);

  const mapReports = reports ?? fetchedReports;

  const confirmedReports = useMemo(
    () => reportsToFeatureCollection(mapReports.filter((report) => report.status === 'confirmed')),
    [mapReports],
  );

  const unconfirmedReports = useMemo(
    () =>
      reportsToFeatureCollection(
        mapReports.filter((report) => report.status !== 'confirmed' && report.status !== 'closed'),
      ),
    [mapReports],
  );

  useEffect(() => {
    if (!selectedReportId) {
      return;
    }

    const selectedReport = mapReports.find((report) => report.localId === selectedReportId);
    const coordinates = selectedReport?.geometry.coordinates;
    if (!coordinates || coordinates.length < 2) {
      return;
    }

    mapRef.current?.flyTo({
      center: [coordinates[0], coordinates[1]],
      zoom: focusZoom,
      duration: 700,
      essential: true,
    });
  }, [focusZoom, mapReports, selectedReportId]);

  return (
    <div ref={containerRef} className={`relative size-full select-none ${className}`}>
      <MapComponent
        ref={mapRef}
        initialViewState={{
          longitude: -122.76892379502566,
          latitude: 45.57416784067063,
          zoom: 11.5,
        }}
        mapStyle={
          theme.resolved === 'dark' || theme.resolved === 'light'
            ? `${publicEnv().backendUrl}/styles/${theme.resolved}.json?key=${publicEnv().protoApiKey}`
            : undefined
        }
        interactiveLayerIds={['routes-hit', 'confirmed-reports', 'unconfirmed-reports']}
        onClick={(event) => {
          const reportFeature = event.features?.find(
            (feature) =>
              feature.layer.id === 'confirmed-reports' ||
              feature.layer.id === 'unconfirmed-reports',
          );
          const localId = reportFeature?.properties?.localId;
          const selectedReport = mapReports.find((report) => report.localId === localId);
          if (selectedReport) {
            onReportSelect?.(selectedReport);
          }
        }}
        onMouseMove={(event) => {
          const map = mapRef.current;
          const routeFeature = event.features?.find((feature) => feature.layer.id === 'routes-hit');

          if (routeFeature) {
            const id = routeFeature.id as number | undefined;
            if (id) {
              if (map) {
                if (id !== activeRoute && activeRoute) {
                  map.setFeatureState({ source: 'routes', id: activeRoute }, { hover: false });
                }
                map.setFeatureState({ source: 'routes', id }, { hover: true });
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
        <Source id="routes" type="geojson" data={`${publicEnv().backendUrl}/geojson/routes.json`}>
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
          data={`${publicEnv().backendUrl}/geojson/start-markers.json`}
        >
          <Layer {...startMarkers} />
        </Source>

        <Source id="confirmed-reports" type="geojson" data={confirmedReports}>
          <Layer {...confirmedReportsLayer} />
        </Source>

        <Source id="unconfirmed-reports" type="geojson" data={unconfirmedReports}>
          <Layer {...unconfirmedReportsLayer} />
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

function reportsToFeatureCollection(reports: MapReport[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: reports.map((report) => {
      const [longitude, latitude, elevation] = report.geometry.coordinates;
      const coordinates: GeoJSON.Position =
        typeof elevation === 'number' ? [longitude, latitude, elevation] : [longitude, latitude];

      return {
        id: report.id,
        type: 'Feature',
        properties: report,
        geometry: {
          type: 'Point',
          coordinates,
        },
      } satisfies GeoJSON.Feature;
    }),
  };
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
        <Button size="icon" onClick={onFullscreenToggle} className="border-border-map mb-2">
          {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      )}

      <Button
        size="icon"
        onClick={() => map?.zoomIn()}
        className="border-border-map rounded-b-none border-b-0 z-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Separator className="bg-border-map z-10" />
      {/* Prevent button scale from revealing map behind it */}
      <div className="relative mx-0 w-full z-0">
        <div className="absolute right-0 left-0 h-[5px] -top-[3px] mx-[1px] bg-accent" />
      </div>
      <Button
        size="icon"
        onClick={() => map?.zoomOut()}
        className="border-border-map rounded-t-none border-t-0 z-10"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}
