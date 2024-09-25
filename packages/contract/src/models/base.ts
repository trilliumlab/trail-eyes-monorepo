import { z } from 'zod';

export const ErrorResponseBaseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  code: z.string().optional(),
});

export const InvalidSessionResponseSchema = ErrorResponseBaseSchema.extend({
  statusCode: z.literal(401),
  error: z.literal('Unauthorized'),
  code: z.literal('INVALID_SESSION'),
});

export const InvalidCredentialsResponseSchema = ErrorResponseBaseSchema.extend({
  statusCode: z.literal(401),
  error: z.literal('Unauthorized'),
  code: z.literal('INVALID_CREDENTIALS'),
});
