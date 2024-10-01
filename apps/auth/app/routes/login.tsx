import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Link } from '@repo/ui/components/link';
import { LoginForm } from '~/components/login/login-form';
import { RedirectSearchSchema } from '~/models/redirect';
import { tsr } from '~/tsr';
import { externalRedirect } from '~/util/external-redirect';
import type { ErrorResponse } from '@ts-rest/react-query/v5';
import type { contract } from '@repo/contract';

export const Route = createFileRoute('/login')({
  validateSearch: RedirectSearchSchema,
  loaderDeps: ({ search: { redirectUrl } }) => ({ redirectUrl }),
  loader: async ({ context: { queryClient }, deps: { redirectUrl } }) => {
    const tsrqc = tsr.initQueryClient(queryClient);

    try {
      const { body } = await tsrqc.auth.getSessionMeta.ensureQueryData({
        queryKey: ['getSessionMeta'],
      });

      if (body.userVerified && body.sessionConfirmed) {
        throw await externalRedirect(redirectUrl);
      }
      if (!body.userVerified) {
        throw redirect({ to: '/verify-email', search: { redirectUrl } });
      }
      if (!body.sessionConfirmed) {
        throw redirect({ to: '/otp' });
        // TODO: redirect to otp page
      }
    } catch (unknownError) {
      const error = unknownError as ErrorResponse<typeof contract.auth.getSessionMeta>;
      if (!(error instanceof Error)) {
        if (error.status === 401) {
          // User needs to log in
          throw redirect({ to: '/login', search: { redirectUrl } });
        }
      }
      throw error;
    }
  },
  component: Login,
});

function Login() {
  const { redirectUrl } = Route.useSearch();

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectUrl={redirectUrl} />
          <Separator className="mt-6" />
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            {/* biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs */}
            <Link tabIndex={5} to="/register" search={{ redirectUrl }}>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
