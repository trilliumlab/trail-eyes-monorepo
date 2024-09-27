'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserCredentialsSchema } from '@repo/database/models/auth';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Link } from '@repo/ui/components/link';
import { useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { tsr } from '~/tsr';

export function LoginForm({ redirectUrl }: { redirectUrl: string }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof UserCredentialsSchema>>({
    resolver: zodResolver(UserCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // This is only called on validated values.
  async function onSubmit(values: z.infer<typeof UserCredentialsSchema>) {
    setIsSubmitting(true);

    const res = await tsr.auth.login.mutate({ body: values });

    if (res.status !== 200) {
      setIsSubmitting(false);
      // TODO fix login error handling
      if (res.status === 401) {
        form.setError('email', { message: res.body.message });
        form.setFocus('email');
      }
    } else {
      // Since we're redirecting, keep isSubmitting true to prevent the button enabling during the page transition period.
      if (res.body.userVerified) {
        window.location.href = redirectUrl;
      } else {
        navigate({ to: '/verify-email', search: { redirectUrl } });
      }
    }
  }

  // Reset submission state when tab is foregrounded.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        setIsSubmitting(false);
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="janedoe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  // biome-ignore lint/a11y/noPositiveTabindex: Forgot password placemenet should not interupt inputs
                  tabIndex={4}
                  to="/reset-password"
                  className="ml-auto inline-block text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input autoComplete="current-password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
    </Form>
  );
}
