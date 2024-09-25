'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyEmailBodySchema } from '@repo/contract/models/auth';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@repo/ui/components/input-otp';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { tsr } from '~/tsr';

export function VerifyEmailForm({ redirectUrl }: { redirectUrl: string }) {
  const [disabled, setDisabled] = useState(false);
  const form = useForm<z.infer<typeof VerifyEmailBodySchema>>({
    resolver: zodResolver(VerifyEmailBodySchema),
    defaultValues: {
      code: '',
    },
  });

  const { mutate: verifyEmail, isPending: verifyEmailPending } = tsr.auth.verifyEmail.useMutation({
    mutationKey: ['verifyEmail'],
    onSuccess: async () => {
      setDisabled(true);
      window.location.href = redirectUrl;
    },
    onError: (e) => {
      if (!(e instanceof Error)) {
        if (e.status === 401) {
          if (e.body.code === 'INVALID_CREDENTIALS') {
            form.setError('code', { message: e.body.message });
          }
        }
      }
    },
  });

  function onSubmit(body: z.infer<typeof VerifyEmailBodySchema>) {
    verifyEmail({ body });
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (form.getValues().code.length === 6) {
            form.handleSubmit(onSubmit)();
          }
        }}
        className="grid place-items-center"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP disabled={disabled || verifyEmailPending} maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
