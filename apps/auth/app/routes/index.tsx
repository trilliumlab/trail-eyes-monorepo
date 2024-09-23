import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async () => {
    throw redirect({ to: '/register', search: { redirectUrl: '' } });
  },
});
