import { z } from 'zod';

export const LoginResponseSchema = z.object({
  requiresSecondFactor: z.boolean(),
  enabledSecondFactors: z.array(z.string()),
});
