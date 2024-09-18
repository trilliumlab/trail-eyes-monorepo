import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { VerifyEmailForm } from '~/components/register/verify-email-form';
import { ResendCountdown } from '~/components/resend-countdown';

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmail,
});

export default function VerifyEmail() {
  const email = 'example@example.com';
  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>Enter the code sent to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
          <ResendCountdown className="mt-6 text-center text-sm" />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Didn't receive a code? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
