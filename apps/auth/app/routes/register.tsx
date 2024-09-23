import { publicEnv } from '@repo/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { RegisterForm } from '~/components/register/register-form';

const RegisterSearchSchema = z.object({
  redirectUrl: z
    .string()
    .url()
    .refine(
      (url) =>
        url.startsWith(publicEnv().panelUrl) ||
        url.startsWith(publicEnv().authUrl) ||
        url.startsWith(publicEnv().backendUrl),
    )
    .catch(publicEnv().panelUrl),
});

export const Route = createFileRoute('/register')({
  component: Register,
  validateSearch: RegisterSearchSchema,
});

function Register() {
  const { redirectUrl } = Route.useSearch();

  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm redirectUrl={redirectUrl} />
          <Separator className="mt-6" />
          <div className="mt-4 text-center text-sm">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
