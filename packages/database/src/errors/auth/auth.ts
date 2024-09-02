import { StatusMap } from 'elysia';
import type { TEError } from '@repo/util/errors';

export const RegistrationEmailConflictError = {
  code: 'EMAIL_CONFLICT',
  status: StatusMap.Conflict,
  message: 'Email already registered.',
} as const satisfies TEError;
