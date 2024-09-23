import { z } from 'zod';
import { tez } from '@repo/zod-utils';
import type { CamelKeys, ReplaceKeys } from 'string-ts';
import { camelKeys, replaceKeys } from 'string-ts';

/**
 * Creates a typed environment function.
 *
 * @template T - The type of the environment variables.
 * @param schema - A function that defines the schema for parsing the environment variables.
 * @returns - A function that parses and transforms the environment variables based on the provided schema.
 */
function makeTypedEnvironment<T>(schema: (v: unknown) => T) {
  // Instantiate a cache to store parsed environment variables.
  let cache: CamelKeys<ReplaceKeys<T, 'VITE_', ''>>;

  return (args: Record<string, unknown>) => {
    // If the environment variables are already cached, return the cached value.
    if (cache) return cache;

    // Otherwise, parse the environment variables and transform the keys
    const withoutPrefix = replaceKeys(schema({ ...args }), 'VITE_', '');
    const camelCased = camelKeys(withoutPrefix);
    cache = camelCased;
    return cache;
  };
}

export const PublicEnvSchema = z.object({
  MODE: z.enum(['development', 'production']).optional(),
  VITE_APP_NAME: z.string(),
  VITE_BACKEND_URL: z.string().url(),
  VITE_PANEL_URL: z.string().url(),
  VITE_AUTH_URL: z.string().url(),
  VITE_PROTO_API_KEY: z.string(),
  VITE_LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  VITE_LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
});

export const PrivateEnvSchema = z.object({
  // packages/database
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),
  DB_SSL: tez.coerce.boolean(),
  // packages/email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_SENDER: z.string(),
  SMTP_SENDER_NAME: z.string(),
});

const publicTypedEnv = makeTypedEnvironment(PublicEnvSchema.parse);

/**
 * Parses and validates the public environment variables based on the defined schema.
 *
 * This function uses the `PublicEnvSchema` to validate the environment variables
 * passed to it. It transforms the keys by
 * removing the 'VITE_' prefix and converting them to camelCase.
 *
 * The parsed and transformed environment variables are cached for subsequent calls.
 *
 * @returns An object containing the parsed and validated public environment variables.
 *
 * @example
 * console.log(publicEnv().appName); // Logs the value of VITE_APP_NAME
 * console.log(publicEnv().backendUrl); // Logs the value of VITE_BACKEND_URL
 */
export function publicEnv() {
  return publicTypedEnv((import.meta && import.meta.env) ?? process.env);
}

const privateTypedEnv = makeTypedEnvironment(PrivateEnvSchema.parse);

/**
 * Parses and validates the public environment variables based on the defined schema.
 *
 * This function uses the `PrivateEnvSchema` to validate the environment variables
 * passed to it. It transforms the keys by converting them to camelCase.
 *
 * The parsed and transformed environment variables are cached for subsequent calls.
 *
 * @returns An object containing the parsed and validated private environment variables.
 *
 * @example
 * console.log(privateEnv().dbName); // Logs the value of DB_NAME
 * console.log(privateEnv().smtpHost); // Logs the value of SMTP_HOST
 */
export function privateEnv() {
  return privateTypedEnv((import.meta && import.meta.env) ?? process.env);
}
