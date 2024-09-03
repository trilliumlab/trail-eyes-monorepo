'use client';

import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@repo/ui/form';

import { z } from 'zod';
import {
  passwordLowercaseRegex,
  passwordNumericRegex,
  passwordSpecialRegex,
  passwordUppercaseRegex,
} from '@repo/util/regex';
import { api } from '~/api';

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
    const sprites = await api.sprites['dark.json'].get();
    console.log('got em', sprites);
    form.setError('email', { message: 'Oopsies' });
    form.setFocus('email');
  }

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
        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </form>
    </Form>
  );
}
