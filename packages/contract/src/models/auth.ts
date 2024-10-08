import { UserCreateSchema } from '@repo/database/models/auth';
import { z } from 'zod';

export const RegisterBodySchema = UserCreateSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const EnabledSecondFactorsResponseSchema = z.array(z.enum(['email', 'totp']));

export const LoginResponseSchema = z.object({
  userVerified: z.boolean(),
  requiresSecondFactor: z.boolean(),
  enabledSecondFactors: EnabledSecondFactorsResponseSchema,
});

export const SessionMetaResponseSchema = z.object({
  userVerified: z.boolean(),
  sessionConfirmed: z.boolean(),
});

export const VerificationMetaResponseSchema = z.union([
  z.object({
    userVerified: z.literal(false),
    secondsUntilCanResend: z.number().int().nonnegative(),
    email: z.string().email(),
    hasActiveCode: z.boolean(),
    shouldResend: z.boolean(),
  }),
  z.object({
    userVerified: z.literal(true),
  }),
]);

export const VerifyEmailBodySchema = z.object({
  code: z.string().min(6, {
    message: 'Please enter your 6-digit code',
  }),
});
