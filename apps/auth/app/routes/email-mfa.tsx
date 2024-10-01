import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/email-mfa')({
  component: () => <div>Hello /email-otp!</div>,
});
