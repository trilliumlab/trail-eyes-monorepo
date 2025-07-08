import { publicEnv } from '@repo/env';
import { z } from 'zod';

export const RedirectSearchSchema = z.object({
  redirectUrl: z
    .string()
    .refine(
      (url) =>
        url.startsWith('/') || // relative path
        url.startsWith(publicEnv().panelUrl) ||
        url.startsWith(publicEnv().authUrl) ||
        url.startsWith(publicEnv().backendUrl),
    )
    .catch(publicEnv().panelUrl),
});
