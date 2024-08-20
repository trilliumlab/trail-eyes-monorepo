import { resolve } from 'import-meta-resolve';
import { parseEnv, RenameFields } from './typebox';
import { Type } from '@sinclair/typebox';

/**
 * Typebox schema of the project wide env variables.
 */
export const SharedEnvSchema = RenameFields(
  Type.Object({
    // Http server settings
    NEXT_PUBLIC_BACKEND_URL: Type.String(),
  }),
  {
    NEXT_PUBLIC_BACKEND_URL: 'BACKEND_URL',
  },
);

/**
 * Validated project wide env variables.
 */
export const sharedEnv = parseEnv(SharedEnvSchema, resolve('../../../.env', import.meta.url), {
  loadEnv: false,
});
