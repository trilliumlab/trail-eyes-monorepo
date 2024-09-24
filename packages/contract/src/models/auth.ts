import { UserCreateSchema } from '@repo/database/models/auth';
import { z } from 'zod';

export const RegisterBodySchema = UserCreateSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const LoginResponseSchema = z.object({
  requiresSecondFactor: z.boolean(),
  enabledSecondFactors: z.array(z.string()),
});

export const GetVerificationMetaResponseSchema = z.union([
  z.object({
    isVerified: z.literal(false),
    secondsUntilCanResend: z.number().int().nonnegative(),
    email: z.string().email(),
  }),
  z.object({
    isVerified: z.literal(true),
  }),
]);
