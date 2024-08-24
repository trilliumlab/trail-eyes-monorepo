import { parseEnv } from './typebox/parse';
import * as TEType from './typebox/types';
import { Type } from '@sinclair/typebox';

/**
 * Typebox schema of the project wide env variables.
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
 * Validated project wide env variables.
 */
export const sharedEnv = parseEnv(
  SharedEnvSchema,
  (import.meta.resolve as unknown) ? import.meta.resolve('../../../.env') : undefined,
);
