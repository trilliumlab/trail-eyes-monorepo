import type { TSchema, StaticDecode } from '@sinclair/typebox';
import url from 'node:url';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { parseEnv } from './parse';

/**
 * Loads and parses env variables from a Typebox schema and provides helpful error messages for missing variables.
 *
 * @param schema The Typebox schema of the env variables to parse.
 * @param envPath The path to the .env file the variables are loaded from. Used to load variables and generate more detailed errors.
 */
export function loadParseEnv<T extends TSchema, R = StaticDecode<T>>(
  schema: T,
  envPath: string,
): R {
  const path = envPath.startsWith('file://') ? url.fileURLToPath(envPath) : envPath;
  const buffer = fs.readFileSync(path);
  const customEnv = dotenv.parse(buffer);
  return parseEnv(schema, envPath, customEnv);
}
