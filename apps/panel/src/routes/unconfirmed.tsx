import { createFileRoute } from '@tanstack/react-router';
import { ReportCardList } from '~/components/report-card-list';
import { requireStaff } from '~/lib/require-staff';

export const Route = createFileRoute('/unconfirmed')({
  beforeLoad: requireStaff,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ReportCardList
      title="Unconfirmed Hazard Reports"
      emptyText="No unconfirmed reports."
      status="open"
      showActions
    />
  );
}
