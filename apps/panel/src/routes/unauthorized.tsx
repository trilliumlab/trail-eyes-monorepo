import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@repo/ui/components/button';
import { authClient } from '~/backend';

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-bold">Access restricted</h1>
      <p className="text-muted-foreground">
        This area is restricted to Forest Park Conservancy staff accounts.
      </p>
      <Button
        className="mt-4"
        onClick={async () => {
          await authClient.signOut();
          router.navigate({ to: '/auth/$pathname', params: { pathname: 'sign-in' } });
        }}
      >
        Log out
      </Button>
    </div>
  );
}
