import type { contract } from '@repo/contract';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import type { ErrorResponse } from '@ts-rest/react-query/v5';
import { VerifyEmailForm } from '~/components/register/verify-email-form';
import { ResendCountdown } from '~/components/resend-countdown';
import { RedirectSearchSchema } from '~/models/redirect';
import { tsr } from '~/tsr';
import { externalRedirect } from '~/util/external-redirect';

export const Route = createFileRoute('/verify-email')({
  validateSearch: RedirectSearchSchema,
  loaderDeps: ({ search: { redirectUrl } }) => ({ redirectUrl }),
  loader: async ({ context: { queryClient }, location, deps: { redirectUrl } }) => {
    const tsrqc = tsr.initQueryClient(queryClient);

    try {
      const { body } = await tsrqc.auth.getVerificationMeta.ensureQueryData({
        queryKey: ['getVerificationMeta'],
      });
      if (body.userVerified) {
        throw await externalRedirect(redirectUrl);
      }
      // If the auto refresh time has passed, we should resend the code.
      if (body.shouldResend) {
        const newBody = await tsr.auth.sendVerification.mutate();
        if (newBody.status !== 200) {
          throw newBody;
        }
        // Update query data to include new metadata.
        tsrqc.auth.getVerificationMeta.setQueryData(['getVerificationMeta'], newBody);
      }
    } catch (unknownError) {
      const error = unknownError as ErrorResponse<typeof contract.auth.getVerificationMeta> &
        ErrorResponse<typeof contract.auth.sendVerification>;
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
  const { redirectUrl } = Route.useSearch();
  const navigate = useNavigate();
  const tsrqc = tsr.useQueryClient();
  const {
    data: { body },
  } = tsr.auth.getVerificationMeta.useSuspenseQuery({
    queryKey: ['getVerificationMeta'],
  });

  if (body.userVerified) {
    navigate({ to: '/login', search: { redirectUrl: location.href } });
    return;
  }

  const { mutate: sendVerification, isPending: sendVerificationPending } =
    tsr.auth.sendVerification.useMutation({
      mutationKey: ['sendVerification'],
      onSuccess: (data) => {
        // Update query data to include new metadata.
        tsrqc.auth.getVerificationMeta.setQueryData(['getVerificationMeta'], data);
      },
    });

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>Enter the code sent to {body.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm redirectUrl={redirectUrl} />
          <ResendCountdown
            secondsUntilCanResend={body.secondsUntilCanResend}
            className="mt-6 text-center text-sm"
            onResend={() => {
              // Don't duplicate mutation requests
              if (!sendVerificationPending) {
                sendVerification({});
              }
            }}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Didn't receive a code? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
