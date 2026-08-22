import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ReportInsert } from '@repo/database/models/reports';
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  MapPin,
  Route as RouteIcon,
  Search,
  ShieldAlert,
  Smartphone,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { publicEnv } from '@repo/env';
import { useEffect, useMemo, useState } from 'react';

export const Route = createFileRoute('/unconfirmed')({
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
  blurHash: string | null;
  status: string;
  reportedAt: string | Date | null;
  updatedAt: string | Date | null;
  geometry: {
    type: 'Point';
    coordinates: [number, number, number?];
  };
};

const categoryStyles: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    accent: string;
    badge: string;
  }
> = {
  fallenTree: {
    label: 'Fallen Tree',
    icon: ShieldAlert,
    accent: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300',
    badge: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  },
  damagedSign: {
    label: 'Damaged Sign',
    icon: AlertTriangle,
    accent: 'border-sky-500/60 bg-sky-500/10 text-sky-300',
    badge: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
  },
  erosion: {
    label: 'Erosion',
    icon: AlertTriangle,
    accent: 'border-amber-500/60 bg-amber-500/10 text-amber-300',
    badge: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  },
};

function RouteComponent() {
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

        const unconfirmedReports = fetchedReports.filter(
          (report) => report.status !== 'confirmed' && report.status !== 'closed',
        );

        setReports(unconfirmedReports);
        setSelectedId(unconfirmedReports[0]?.localId ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const selectedReport = useMemo(
    () => reports.find((report) => report.localId === selectedId) ?? reports[0],
    [reports, selectedId],
  );

  async function approveReport(report: ReviewReport) {
    try {
      const response = await fetch(
        `${publicEnv().backendUrl}/reports/report/${report.localId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            localId: report.localId,
            status: 'confirmed',
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to approve report: ${response.status} ${message}`);
      }

      const remainingReports = reports.filter(
        (existingReport) => existingReport.localId !== report.localId,
      );

      setReports(remainingReports);
      setSelectedId(remainingReports[0]?.localId ?? '');

      await navigate({ to: '/confirmed' });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to approve report');
    }
  }

  if (loading) {
    return <main className="p-10 text-muted-foreground">Loading reports...</main>;
  }

  if (error) {
    return <main className="p-10 text-destructive">{error}</main>;
  }

  return (
    <main className="min-h-screen px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Unconfirmed Reports</h1>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No unconfirmed reports right now.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[25rem_1fr]">
          <section className="space-y-3">
            {reports.map((report) => {
              const style = getCategoryStyle(report.category);
              const Icon = style.icon;
              const isSelected = report.localId === selectedReport?.localId;

              return (
                <button
                  key={report.localId}
                  type="button"
                  onClick={() => setSelectedId(report.localId)}
                  className={`w-full rounded-lg border p-4 text-left transition hover:bg-accent/40 ${
                    isSelected ? 'border-primary bg-primary/10' : 'bg-card'
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex size-14 shrink-0 items-center justify-center rounded-md border ${style.accent}`}
                    >
                      <Icon className="size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{style.label}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" />
                            Route {report.route} / Trail {report.trail}
                          </p>
                        </div>
                        <StatusBadge status={report.status} />
                      </div>

                      <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-3.5" />
                        Reported {formatTime(report.reportedAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {selectedReport && (
            <ReportDetail report={selectedReport} onApprove={approveReport} />
          )}

        </div>
      )}
    </main>
  );
}

function ReportDetail({
  report,
  onApprove,
}: {
  report: ReviewReport;
  onApprove: (report: ReviewReport) => void;
}) {
  const style = getCategoryStyle(report.category);
  const Icon = style.icon;
  const coordinates = report.geometry?.coordinates ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected Report
            </p>
            <CardTitle className="mt-2 flex items-center gap-3 text-2xl">
              <span className={`rounded-md border p-2 ${style.accent}`}>
                <Icon className="size-5" />
              </span>
              {style.label}
            </CardTitle>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={report.status} />
            <span className="text-sm text-muted-foreground">
              Reported {formatTime(report.reportedAt)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Photo
            </h3>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {report.image ? (
                <img
                  src={`${publicEnv().backendUrl}/reports/image/${report.image}`}
                  alt={`${style.label} report`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-sm text-muted-foreground">No photo attached</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Location
            </h3>
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.24),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(6,78,59,0.35))]">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px]" />
              <MapPin className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b pb-6 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem label="Category" value={style.label} badgeClassName={style.badge} />
          <InfoItem label="Route" value={`Route ${report.route}`} icon={RouteIcon} />
          <InfoItem label="Trail" value={`Trail ${report.trail}`} icon={MapPin} />
          <InfoItem label="Reporter Device" value={report.creatorDeviceId} icon={Smartphone} />
          <InfoItem label="Reporter User" value={report.creatorUserId ?? 'None'} icon={User} />
          <InfoItem
            label="Coordinates"
            value={
              coordinates.length >= 2
                ? `${Number(coordinates[1]).toFixed(4)}, ${Number(coordinates[0]).toFixed(4)}`
                : 'Unknown'
            }
            icon={Copy}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button   variant="destructive" className="sm:w-36">
            <X className="size-4" />
            Reject
          </Button>

          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700 sm:w-36"
            onClick={() => onApprove(report)}
          >
            <Check className="size-4" />
            Approve
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
  badgeClassName,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: LucideIcon;
  badgeClassName?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {badgeClassName ? (
        <Badge variant="outline" className={badgeClassName}>
          {value}
        </Badge>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          <span>{value ?? 'Unknown'}</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewReport['status'] }) {
  const statusText = String(status);

  if (statusText === 'open') {
    return <Badge className="bg-emerald-600/20 text-emerald-300">open</Badge>;
  }

  if (statusText === 'confirmed') {
    return <Badge className="bg-blue-600/20 text-blue-300">confirmed</Badge>;
  }

  return <Badge className="bg-amber-600/20 text-amber-300">{statusText}</Badge>;
}

function getCategoryStyle(category: ReviewReport['category']) {
  return categoryStyles[String(category)] ?? {
    label: formatCategory(String(category)),
    icon: AlertTriangle,
    accent: 'border-muted bg-muted text-muted-foreground',
    badge: 'border-muted bg-muted text-muted-foreground',
  };
}

function formatCategory(category: string) {
  return category
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function formatTime(date: Date | string | number | null | undefined) {
  if (!date) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}