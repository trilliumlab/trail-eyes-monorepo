// import { Button } from '@repo/ui/components/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="bg-card border rounded-2xl w-40 p-4">ASD</div>;
}
