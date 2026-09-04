import { createFileRoute } from '@tanstack/react-router';
import { ReportCardList } from '~/components/report-card-list';

export const Route = createFileRoute('/confirmed')({
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
