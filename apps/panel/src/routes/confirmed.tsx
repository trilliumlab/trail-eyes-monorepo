import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { publicEnv } from '@repo/env';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/confirmed')({
  component: RouteComponent,
});

type ReviewReport = {
  id: number | string;
  localId: string;
  creatorDeviceId: string;
  creatorUserId: string | null;
  category: string;
  route: number;
  trail: number;
  image: string | null;
  status: string;
  reportedAt: string | Date | null;
};

function RouteComponent() {
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch(`${publicEnv().backendUrl}/reports/report`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to load reports: ${response.status}`);
        }

        const fetchedReports: ReviewReport[] = await response.json();
        
        setReports(fetchedReports.filter((report) => report.status === 'confirmed'));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return <main className="p-10 text-muted-foreground">Loading confirmed reports...</main>;
  }

  if (error) {
    return <main className="p-10 text-destructive">{error}</main>;
  }

  return (
    <main className="min-h-screen px-6 py-6 lg:px-10">
      <div className="mb-6 border-b pb-5">
        <h1 className="text-3xl font-semibold tracking-tight">Confirmed Reports</h1>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No confirmed reports yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.localId}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="size-5 text-emerald-400" />
                    {formatCategory(report.category)}
                  </CardTitle>
                  <Badge className="bg-blue-600/20 text-blue-300">confirmed</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {report.image && (
                  <img
                    src={`${publicEnv().backendUrl}/reports/image/${report.image}`}
                    alt={`${report.category} report`}
                    className="aspect-video w-full rounded-md border object-cover"
                  />
                )}

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  Route {report.route} / Trail {report.trail}
                </p>

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Reported {formatTime(report.reportedAt)}
                </p>

                <p className="text-sm text-muted-foreground">
                  Device: {report.creatorDeviceId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function formatCategory(category: string) {
  return category
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function formatTime(date: Date | string | number | null | undefined) {
  if (!date) return 'Unknown time';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}