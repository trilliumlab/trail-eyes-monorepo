import { createLoggerOptions } from '@repo/util/logger';
import { pino, type Logger } from 'pino';

let logger: Logger | undefined;
export function getLogger() {
  if (logger) {
    return logger;
  }
  logger = pino(createLoggerOptions('panel'));
  return logger;
}
