import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Users } from 'lucide-react';
import { publicEnv } from '@repo/env';
import { TrailEyesMap } from '~/components/trail-eyes-map';
import {
  categoryEnumValues,
  statusEnumValues,
  type ReportFeature,
} from '~/components/report-card-list';
import { requireStaff } from '~/lib/require-staff';

export const Route = createFileRoute('/')({
  beforeLoad: requireStaff,
  component: Dashboard,
});

const statusBadgeVariant = {
  open: 'outline',
  confirmed: 'default',
  inProgress: 'secondary',
  closed: 'secondary',
} as const;

function Dashboard() {
  const [reports, setReports] = useState<ReportFeature[] | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${publicEnv().backendUrl}/geojson/reports.json`)
      .then((res) => res.json())
      .then((data: { features: ReportFeature[] }) => setReports(data.features));

    fetch(`${publicEnv().backendUrl}/users/count`)
      .then((res) => res.json())
      .then((data: { count: number }) => setUserCount(data.count));
  }, []);

  const openCount = reports?.filter((r) => r.properties.status === 'open').length ?? null;
  const confirmedCount =
    reports?.filter((r) => r.properties.status === 'confirmed').length ?? null;
  const recentReports = reports
    ?.slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unconfirmed Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openCount ?? '...'}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Reports</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedCount ?? '...'}</div>
              <p className="text-xs text-muted-foreground">Approved by staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports?.length ?? '...'}</div>
              <p className="text-xs text-muted-foreground">All statuses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount ?? '...'}</div>
              <p className="text-xs text-muted-foreground">Accounts with sign-in</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest hazard reports, any status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden xl:table-column">Status</TableHead>
                    <TableHead className="hidden xl:table-column">Reporter</TableHead>
                    <TableHead className="text-right">Route</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports === undefined || recentReports === null ? (
                    <TableRow>
                      <TableCell colSpan={4}>Loading...</TableCell>
                    </TableRow>
                  ) : recentReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>No reports yet.</TableCell>
                    </TableRow>
                  ) : (
                    recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">
                            {categoryEnumValues[report.properties.category]}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {report.properties.creatorEmail ?? '(anonymous)'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge
                            className="text-xs"
                            variant={statusBadgeVariant[report.properties.status]}
                          >
                            {statusEnumValues[report.properties.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          {report.properties.creatorEmail ?? '(anonymous)'}
                        </TableCell>
                        <TableCell className="text-right">{report.properties.route}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 p-0 overflow-clip min-h-[32rem]">
            <TrailEyesMap />
          </Card>
        </div>
      </main>
    </div>
  );
}
