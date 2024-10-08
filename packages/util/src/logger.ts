import { publicEnv } from '@repo/env';
import type { LoggerOptions } from 'pino';

/**
 * Creates pino logger options.
 * @param name - The name of the logger.
 * @returns The logger options.
 */
export function createLoggerOptions(name: string) {
  return {
    name,
    level: publicEnv().logLevel,
    transport:
      typeof window === 'undefined' && publicEnv().logFormat === 'pretty'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  } satisfies LoggerOptions;
}
