import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/email-verified')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-bold">Email verified</h1>
      <p className="text-muted-foreground">
        Your email has been verified. You can return to the Trail Eyes app.
      </p>
    </div>
  );
}
