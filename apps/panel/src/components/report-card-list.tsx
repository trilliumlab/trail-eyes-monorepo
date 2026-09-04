import { useEffect, useState } from 'react';
import { publicEnv } from '@repo/env';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { ReportLocationMap } from '~/components/report-location-map';

// Mirrors categoryEnumValues/statusEnumValues from @repo/database/models/reports.
// Duplicated (rather than imported) so this client component doesn't pull the
// database package's Node-only dependencies into the browser bundle.
export const categoryEnumValues = {
  other: 'Other',
  fallenTree: 'Downed tree',
  drainage: 'Poor drainage/blocked culvert',
  erosion: 'Hazardous erosion (such as a small landslide)',
  structureFailure: 'Structure failure (such as a bridge or retaining wall)',
  damagedSign: 'Missing/vandalized/badly damaged sign(s)',
  seasonal: 'Seasonal maintenance needed',
} as const;

export const statusEnumValues = {
  open: 'Open',
  confirmed: 'Confirmed by volunteer',
  closed: 'Closed',
  inProgress: 'In progress',
} as const;

export interface ReportFeature {
  id: number;
  properties: {
    creatorDeviceId: string;
    creatorUserId: string | null;
    creatorEmail: string | null;
    category: keyof typeof categoryEnumValues;
    route: number;
    trail: number;
    localId: string | null;
    image: string | null;
    description: string | null;
    status: keyof typeof statusEnumValues;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number];
  };
}

export function ReportCardList({
  title,
  emptyText,
  status,
  showActions = false,
}: {
  title: string;
  emptyText: string;
  status: keyof typeof statusEnumValues;
  showActions?: boolean;
}) {
  const [reports, setReports] = useState<ReportFeature[] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${publicEnv().backendUrl}/geojson/reports.json`)
      .then((res) => res.json())
      .then((data: { features: ReportFeature[] }) => {
        setReports(data.features.filter((f) => f.properties.status === status));
      });
  }, [status]);

  async function updateStatus(id: number, newStatus: 'confirmed' | 'closed') {
    setActionError(null);
    const res = await fetch(`${publicEnv().backendUrl}/reports/report/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setActionError(
        res.status === 401
          ? 'You must be logged in to approve/decline reports.'
          : 'Failed to update report status.',
      );
      return;
    }
    setReports((prev) => prev?.filter((r) => r.id !== id) ?? null);
  }

  return (
    <div className="px-6 py-4">
      <h1 className="mt-6 text-center font-bold">{title}</h1>
      {actionError && <p className="text-center text-destructive mt-2">{actionError}</p>}
      {reports === null ? (
        <p className="text-center text-muted-foreground mt-6">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-muted-foreground mt-6">{emptyText}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 font-bold">
                <CardTitle className="text-sm font-medium">
                  {categoryEnumValues[report.properties.category]}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-[12px]">
                {report.properties.image && (
                  <img
                    src={`${publicEnv().backendUrl}/reports/image/${report.properties.image}`}
                    alt={categoryEnumValues[report.properties.category]}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <ReportLocationMap
                  longitude={report.geometry.coordinates[0]}
                  latitude={report.geometry.coordinates[1]}
                />
                {report.properties.description && (
                  <p>Description: {report.properties.description}</p>
                )}
                <p>Status: {statusEnumValues[report.properties.status]}</p>
                <p>Route: {report.properties.route}</p>
                <p>Trail: {report.properties.trail}</p>
                <p>Reporter Device ID: {report.properties.creatorDeviceId}</p>
                <p>Reporter: {report.properties.creatorEmail ?? '(anonymous)'}</p>
                {showActions && (
                  <div className="flex space-x-[16px]">
                    <Button onClick={() => updateStatus(report.id, 'confirmed')}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateStatus(report.id, 'closed')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
