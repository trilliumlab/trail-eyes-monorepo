'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterBodySchema } from '@repo/contract/models/auth';
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
import { useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { tsr } from '~/tsr';

export function RegisterForm({ redirectUrl }: { redirectUrl: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterBodySchema>>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // This is only called on validated values.
  async function onSubmit(values: z.infer<typeof RegisterBodySchema>) {
    setIsSubmitting(true);

    const res = await tsr.auth.register.mutate({ body: values });

    if (res.status !== 200) {
      setIsSubmitting(false);
      // TODO fix login error handling
      if (res.status === 409) {
        form.setError('email', { message: res.body.message });
        form.setFocus('email');
      }
    } else {
      // Since we're redirecting, keep isSubmitting true to prevent the button enabling during the page transition period.
      navigate({ to: '/verify-email', search: { redirectUrl } });
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input autoComplete="given-name" placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input autoComplete="family-name" placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input autoComplete="new-password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Create an account
        </Button>
      </form>
    </Form>
  );
}
