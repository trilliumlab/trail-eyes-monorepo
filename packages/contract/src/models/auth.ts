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
