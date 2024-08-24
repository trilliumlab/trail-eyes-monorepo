import { TEType, parseEnv } from '@repo/util';
import { Type } from '@sinclair/typebox';

/**
 * Typebox schema of the project wide env variables.
 */
export const EnvSchema = TEType.RemovePrefix(
  Type.Object({
    // Http server settings
    NEXT_PUBLIC_PROTO_API_KEY: Type.String(),
  }),
  'NEXT_PUBLIC_',
);

/**
 * Validated project wide env variables.
 */
export const env = parseEnv(
  EnvSchema,
  (import.meta.resolve as unknown) ? import.meta.resolve('../.env') : undefined,
  {
    // For some reason process.env = {}, but all these are defined. Thanks nextjs
    NEXT_PUBLIC_PROTO_API_KEY: process.env.NEXT_PUBLIC_PROTO_API_KEY,
  },
);
