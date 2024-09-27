import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@repo/ui/components/link';
import { LoginForm } from '~/components/login/login-form';
import { RedirectSearchSchema } from '~/models/redirect';

export const Route = createFileRoute('/login')({
  validateSearch: RedirectSearchSchema,
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
