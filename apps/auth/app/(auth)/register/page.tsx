import { Separator } from '@repo/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Link } from '@repo/ui/link';
import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <Separator className="mt-6" />
          <div className="mt-4 text-center text-sm">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
