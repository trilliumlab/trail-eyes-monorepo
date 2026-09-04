import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicEnv } from '@repo/env';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { categoryEnumValues, statusEnumValues } from '@repo/database/models/reports';

export const Route = createFileRoute('/unconfirmed')({
  component: RouteComponent,
});

interface ReportFeature {
  id: number;
  properties: {
    creatorDeviceId: string;
    creatorUserId: string | null;
    category: keyof typeof categoryEnumValues;
    route: number;
    trail: number;
    localId: string | null;
    image: string | null;
    description: string | null;
    status: keyof typeof statusEnumValues;
  };
}

function RouteComponent() {
  const [reports, setReports] = useState<ReportFeature[] | null>(null);

  useEffect(() => {
    fetch(`${publicEnv().backendUrl}/geojson/reports.json`)
      .then((res) => res.json())
      .then((data: { features: ReportFeature[] }) => {
        setReports(data.features.filter((f) => f.properties.status === 'open'));
      });
  }, []);

  return (
    <div className="px-6 py-4">
      <h1 className="mt-6 text-center font-bold">Unconfirmed Hazard Reports</h1>
      {reports === null ? (
        <p className="text-center text-muted-foreground mt-6">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-muted-foreground mt-6">No unconfirmed reports.</p>
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
                {report.properties.description && <p>{report.properties.description}</p>}
                <p>Status: {statusEnumValues[report.properties.status]}</p>
                <p>Route: {report.properties.route}</p>
                <p>Trail: {report.properties.trail}</p>
                <p>Reporter Device ID: {report.properties.creatorDeviceId}</p>
                <p>Reporter User ID: {report.properties.creatorUserId ?? '(none)'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
