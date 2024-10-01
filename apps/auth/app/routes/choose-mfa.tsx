import type { contract } from '@repo/contract';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import type { ErrorResponse } from '@ts-rest/react-query/v5';
import { RedirectSearchSchema } from '~/models/redirect';
import { tsr } from '~/tsr';
import { externalRedirect } from '~/util/external-redirect';

export const Route = createFileRoute('/choose-mfa')({
  validateSearch: RedirectSearchSchema,
  loaderDeps: ({ search: { redirectUrl } }) => ({ redirectUrl }),
  loader: async ({ context: { queryClient }, deps: { redirectUrl } }) => {
    const tsrqc = tsr.initQueryClient(queryClient);

    try {
      const { body } = await tsrqc.auth.getEnabledSecondFactors.ensureQueryData({
        queryKey: ['getEnabledSecondFactors'],
      });

      if (body.length === 0) {
        // throw await externalRedirect(redirectUrl);
      }
      if (body.length === 1 && body[0]) {
        const method = body[0];
        // TODO: redirect to otp page
      }
    } catch (unknownError) {
      const error = unknownError as ErrorResponse<typeof contract.auth.getEnabledSecondFactors>;
      if (!(error instanceof Error)) {
        if (error.status === 401) {
          throw redirect({ to: '/login', search: { redirectUrl } });
        }
      }
      throw error;
    }
  },
  component: ChooseOtp,
});

function ChooseOtp() {
  const { redirectUrl } = Route.useSearch();

  let {
    data: { body: methods },
  } = tsr.auth.getEnabledSecondFactors.useSuspenseQuery({
    queryKey: ['getEnabledSecondFactors'],
  });

  methods = ['totp', 'email'];

  console.log(methods);

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">2FA</CardTitle>
          <CardDescription>Choose verification method</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-none grid gap-1">
            {methods.map((method) => (
              <li key={method}>
                <OtpOption method={method} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function OtpOption({ method }: { method: 'email' | 'totp' }) {
  const title = method === 'email' ? 'Email' : 'TOTP';
  const description =
    method === 'email' ? 'Send a code to your email' : 'Use your authenticator app';
  const to = method === 'email' ? '/email-mfa' : '/totp-mfa';
  return (
    <Button variant="ghost" className="border h-auto w-full min-w-64 block text-left" asChild>
      <Link to={to}>
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </Link>
    </Button>
  );
}
