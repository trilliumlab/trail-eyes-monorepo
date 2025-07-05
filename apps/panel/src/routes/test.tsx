import { Button } from '@repo/ui/components/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Button onClick={() => console.log('test')}>Test</Button>;
}
