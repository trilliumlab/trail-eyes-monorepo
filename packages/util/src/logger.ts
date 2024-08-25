import { publicEnv } from './public-env';
import type { LoggerOptions } from 'pino';

export function createLoggerOptions(name: string) {
  return {
    name,
    level: publicEnv.LOG_LEVEL,
    transport:
      publicEnv.LOG_FORMAT === 'pretty'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  } satisfies LoggerOptions;
}
