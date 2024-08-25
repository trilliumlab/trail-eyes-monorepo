import { createLoggerOptions } from '@repo/util/logger';
import { pino } from 'pino';

export const logger = pino(createLoggerOptions('auth'));
