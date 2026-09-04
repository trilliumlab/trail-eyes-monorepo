import { createFileRoute } from '@tanstack/react-router';
import { ReportCardList } from '~/components/report-card-list';
import { requireStaff } from '~/lib/require-staff';

export const Route = createFileRoute('/confirmed')({
  beforeLoad: requireStaff,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ReportCardList
      title="Confirmed Hazard Reports"
      emptyText="No confirmed reports."
      status="confirmed"
    />
  );
}
