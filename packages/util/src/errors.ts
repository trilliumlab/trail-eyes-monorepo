/**
 * Represents an error object that can be sent over http.
 */
export interface TEError {
  code: string;
  status: number;
  message: string;
}

/**
 * Creates a new error object with an updated message.
 *
 * @param error - The original error object.
 * @param message - The new message for the error.
 * @returns A new error object with the updated message.
 */
export function errorWithMessage<TError extends TEError, TMessage extends string>(
  error: TError,
  message: TMessage,
) {
  return {
    ...error,
    message,
  } as Omit<TError, 'message'> & { message: TMessage };
}
