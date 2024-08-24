import { loadParseEnv } from '@repo/util';
import { Type } from '@sinclair/typebox';

export const EnvSchema = Type.Object({
  SMTP_HOST: Type.String(),
  SMTP_PORT: Type.Number(),
  SMTP_USER: Type.String(),
  SMTP_PASS: Type.String(),
  SMTP_SENDER: Type.String(),
  SMTP_SENDER_NAME: Type.String(),
});

export const env = loadParseEnv(EnvSchema, import.meta.resolve('../.env'));
