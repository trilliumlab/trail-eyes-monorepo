import { parse, SharedEnvSchema } from '@repo/util';

export const EnvSchema = SharedEnvSchema;

export const env = parse(EnvSchema, { ...process.env });
