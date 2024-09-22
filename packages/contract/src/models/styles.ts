import { tez } from '@repo/zod-utils';
import { z } from 'zod';

export const StylesQuerySchema = z.object({
  key: z.string(),
  mobile: tez.coerce.boolean().default(false),
});
