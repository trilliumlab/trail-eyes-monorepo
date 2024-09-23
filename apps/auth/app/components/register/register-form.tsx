'use client';

import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@repo/ui/components/form';
import type { z } from 'zod';
import { backend } from '~/backend';
import { useRouter } from '@tanstack/react-router';
import { RegisterBodySchema } from '@repo/contract/models/auth';

export function RegisterForm({ redirectUrl }: { redirectUrl: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

    const res = await backend.auth.register.mutation({ body: values });

    if (res.status !== 200) {
      setIsSubmitting(false);
      // TODO fix login error handling
      if (res.status === 409) {
        form.setError('email', { message: res.body.message });
        form.setFocus('email');
      }
    } else {
      // Since we're redirecting, keep isSubmitting true to prevent the button enabling during the page transition period.
      console.log('redirecting to', redirectUrl);
      router.history.push(redirectUrl);
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
