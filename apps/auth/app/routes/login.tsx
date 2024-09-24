import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Separator } from '@repo/ui/components/separator';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { RedirectSearchSchema } from '~/models/redirect';

export const Route = createFileRoute('/login')({
  validateSearch: RedirectSearchSchema,
  component: Login,
});

function Login() {
  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                // biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs
                tabIndex={1}
                id="email"
                type="email"
                placeholder="janedoe@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  // biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs
                  tabIndex={4}
                  to="/reset-password"
                  className="ml-auto inline-block text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
              {/* biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs */}
              <Input tabIndex={2} id="password" type="password" required />
            </div>
            {/* biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs */}
            <Button tabIndex={3} type="submit" className="w-full">
              Log in
            </Button>
            <Separator />
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            {/* biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs */}
            <Link tabIndex={5} to="/register" search={{ redirectUrl: '' }}>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
