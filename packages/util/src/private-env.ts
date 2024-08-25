import { Type } from '@sinclair/typebox';
import { parseEnv } from './typebox/parse';

/**
 * Typebox schema of the private env variables.
 */
export const PrivateEnvSchema = Type.Object({
  // packages/database
  DB_NAME: Type.String(),
  DB_HOST: Type.String(),
  DB_USER: Type.String(),
  DB_PASSWORD: Type.String(),
  DB_PORT: Type.Number(),
  DB_SSL: Type.Boolean(),
  // packages/email
  SMTP_HOST: Type.String(),
  SMTP_PORT: Type.Number(),
  SMTP_USER: Type.String(),
  SMTP_PASS: Type.String(),
  SMTP_SENDER: Type.String(),
  SMTP_SENDER_NAME: Type.String(),
});

/**
 * Validated public env variables.
 */
export const privateEnv = parseEnv(
  PrivateEnvSchema,
  (import.meta?.resolve as unknown) ? import.meta.resolve('../../../.env') : undefined,
);
