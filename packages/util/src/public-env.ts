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
    NEXT_PUBLIC_LOG_LEVEL: TEType.StringEnum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'], {
      default: 'info',
    }),
    NEXT_PUBLIC_LOG_FORMAT: TEType.StringEnum(['json', 'pretty'], { default: 'json' }),
  }),
  'NEXT_PUBLIC_',
);

// TODO: check if I can use accessor

/**
 * Validated public env variables.
 */
export const publicEnv = parseEnv(
  PublicEnvSchema,
  (import.meta?.resolve as unknown) ? import.meta.resolve('../../../.env') : undefined,
  {
    // For some reason process.env = {}, but all these are defined. Thanks nextjs
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_PROTO_API_KEY: process.env.NEXT_PUBLIC_PROTO_API_KEY,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_LOG_FORMAT: process.env.NEXT_PUBLIC_LOG_FORMAT,
  },
);
