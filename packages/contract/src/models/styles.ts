import { z } from 'zod';

export const StylesQuerySchema = z.object({
  key: z.string(),
  mobile: z.stringbool().default(false),
});
