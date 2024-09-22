import { z } from 'zod';

export const ErrorResponseBaseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  code: z.string().optional(),
});
