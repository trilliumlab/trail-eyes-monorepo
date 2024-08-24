import { Type } from '@sinclair/typebox';
import { parseEnv } from './typebox/parse';
import * as TEType from './typebox/types';

/**
 * Typebox schema of the repository wide env variables.
 */
export const SharedEnvSchema = TEType.RemovePrefix(
  Type.Object({
    // Http server settings
    NEXT_PUBLIC_BACKEND_URL: Type.String(),
    NEXT_PUBLIC_PANEL_URL: Type.String(),
    NEXT_PUBLIC_AUTH_URL: Type.String(),
  }),
  'NEXT_PUBLIC_',
);

/**
 * Validated repository wide env variables.
 */
export const sharedEnv = parseEnv(
  SharedEnvSchema,
  (import.meta.resolve as unknown) ? import.meta.resolve('../../../.env') : undefined,
  {
    // For some reason process.env = {}, but all these are defined. Thanks nextjs
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },
);
