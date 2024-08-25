import { publicEnv } from './public-env';
import type { LoggerOptions } from 'pino';

export function createLoggerOptions(name: string) {
  return {
    name,
    level: publicEnv.LOG_LEVEL,
    transport:
      typeof window !== 'undefined' && publicEnv.LOG_FORMAT === 'pretty'
        ? {
            target: 'pino-pretty-browser',
            options: {
              colorize: true,
            },
          }
        : undefined,
  } satisfies LoggerOptions;
}
