import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { VerifyEmailForm } from '~/components/register/verify-email-form';
import { ResendCountdown } from '~/components/resend-countdown';
import { RedirectSearchSchema } from '~/models/redirect';
import { tsr } from '~/tsr';
import type { ErrorResponse } from '@ts-rest/react-query/v5';
import type { contract } from '@repo/contract';
import { externalRedirect } from '~/util/external-redirect';
// import { getEvent, sendRedirect } from 'vinxi/http';

export const Route = createFileRoute('/verify-email')({
  validateSearch: RedirectSearchSchema,
  loaderDeps: ({ search: { redirectUrl } }) => ({ redirectUrl }),
  loader: async ({ context: { queryClient }, location, deps: { redirectUrl } }) => {
    const tsrqc = tsr.initQueryClient(queryClient);

    try {
      const { body } = await tsrqc.auth.getVerificationMeta.ensureQueryData({
        queryKey: ['getVerificationMeta'],
      });
      if (body.isVerified) {
        throw await externalRedirect(redirectUrl);
      }
    } catch (unknownError) {
      const error = unknownError as ErrorResponse<typeof contract.auth.getVerificationMeta>;
      if (!(error instanceof Error)) {
        if (error.status === 401) {
          console.log(`we doing redirect to ${location.href}`);
          throw redirect({ to: '/login', search: { redirectUrl: location.href } });
        }
      }
      throw error;
    }
  },
  component: VerifyEmail,
});

export default function VerifyEmail() {
  const {
    data: { body },
  } = tsr.auth.getVerificationMeta.useSuspenseQuery({
    queryKey: ['getVerificationMeta'],
  });

  if (body.isVerified) {
    throw new Error('Email already verified');
  }

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>Enter the code sent to {body.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
          <ResendCountdown
            secondsUntilCanResend={body.secondsUntilCanResend}
            className="mt-6 text-center text-sm"
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Didn't receive a code? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
