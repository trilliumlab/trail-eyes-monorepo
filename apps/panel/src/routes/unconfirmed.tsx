import { createFileRoute } from '@tanstack/react-router';
import { ReportCardList } from '~/components/report-card-list';

export const Route = createFileRoute('/unconfirmed')({
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
