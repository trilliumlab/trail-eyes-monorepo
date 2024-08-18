import { parseEnv } from '@repo/util';
import { Type } from '@sinclair/typebox';
import { resolve } from 'import-meta-resolve';

export const EnvSchema = Type.Object({
  DB_NAME: Type.String(),
  DB_HOST: Type.String(),
  DB_USER: Type.String(),
  DB_PASSWORD: Type.String(),
  DB_PORT: Type.Number(),
  DB_SSL: Type.Boolean(),
});

export const env = parseEnv(EnvSchema, resolve('../.env', import.meta.url));
