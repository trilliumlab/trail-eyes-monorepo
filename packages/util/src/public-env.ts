import { Type } from '@sinclair/typebox';
import { parseEnv } from './typebox/parse';
import * as TEType from './typebox/types';

/**
 * Typebox schema of the public env variables.
 */
export const PublicEnvSchema = TEType.RemovePrefix(
  Type.Object({
    // Http server settings
    NEXT_PUBLIC_APP_NAME: Type.String(),
    NEXT_PUBLIC_BACKEND_URL: Type.String(),
    NEXT_PUBLIC_PANEL_URL: Type.String(),
    NEXT_PUBLIC_AUTH_URL: Type.String(),
    NEXT_PUBLIC_PROTO_API_KEY: Type.String(),
  }),
  'NEXT_PUBLIC_',
);

/**
 * Validated public env variables.
 */
export const publicEnv = parseEnv(
  PublicEnvSchema,
  (import.meta.resolve as unknown) ? import.meta.resolve('../../../.env') : undefined,
  {
    // For some reason process.env = {}, but all these are defined. Thanks nextjs
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_PROTO_API_KEY: process.env.NEXT_PUBLIC_PROTO_API_KEY,
  },
);
