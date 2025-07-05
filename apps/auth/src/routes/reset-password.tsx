import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
});

function ResetPassword() {
  return <div>TODO: Reset password page</div>;
}
