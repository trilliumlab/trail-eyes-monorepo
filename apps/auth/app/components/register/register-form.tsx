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
import { z } from 'zod';
import { backend } from '~/backend';
import {
  passwordLowercaseRegex,
  passwordNumericRegex,
  passwordSpecialRegex,
  passwordUppercaseRegex,
} from '@repo/util/regex';
import { useRouter } from '@tanstack/react-router';

const RegisterSchema = z.object({
  firstName: z.string().min(1, { message: 'Required' }),
  lastName: z.string().min(1, { message: 'Required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 characters' })
    .regex(passwordLowercaseRegex, { message: 'Password must include a lowercase character' })
    .regex(passwordUppercaseRegex, { message: 'Password must include an uppercase character' })
    .regex(passwordNumericRegex, { message: 'Password must include a number' })
    .regex(passwordSpecialRegex, { message: 'Password must include a special character' }),
});

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // This is only called on validated values.
  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsSubmitting(true);

    const res = await backend.auth.register.post(values);
    if (res.error) {
      setIsSubmitting(false);
      form.setError('email', { message: res.error.value.message });
      form.setFocus('email');
    } else {
      // Since we're redirecting, keep isSubmitting true to prevent the button enabling during the page transition period.
      router.navigate({ to: '/' });
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
