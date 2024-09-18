'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@repo/ui/components/input-otp';
import { useState } from 'react';

const OtpSchema = z.object({
  pin: z.string().min(6, {
    message: 'Please enter your 6-digit code',
  }),
});

export function VerifyEmailForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      pin: '',
    },
  });

  function onSubmit({ pin }: z.infer<typeof OtpSchema>) {
    setIsSubmitting(true);
    console.log(`calling toast: ${pin}`);
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (form.getValues().pin.length === 6) {
            form.handleSubmit(onSubmit)();
          }
        }}
        className="grid place-items-center"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP disabled={isSubmitting} maxLength={6} {...field}>
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
