import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Link } from '@repo/ui/components/link';
import { Separator } from '@repo/ui/components/separator';
import { createFileRoute } from '@tanstack/react-router';
import { RegisterForm } from '~/components/register/register-form';
import { RedirectSearchSchema } from '~/models/redirect';

export const Route = createFileRoute('/register')({
  component: Register,
  validateSearch: RedirectSearchSchema,
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
            Already have an account?{' '}
            <Link to="/login" search={{ redirectUrl }}>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
