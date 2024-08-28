import { publicEnv } from './public-env';
import type { LoggerOptions } from 'pino';

/**
 * Creates pino logger options.
 * @param name - The name of the logger.
 * @returns The logger options.
 */
export function createLoggerOptions(name: string) {
  return {
    name,
    level: publicEnv.LOG_LEVEL,
    transport:
      typeof window === 'undefined' && publicEnv.LOG_FORMAT === 'pretty'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  } satisfies LoggerOptions;
}
