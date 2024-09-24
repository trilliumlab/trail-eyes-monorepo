export function invalidCredentialsResponse() {
  return {
    status: 401,
    body: {
      statusCode: 401,
      error: 'Unauthorized',
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid login credentials',
    },
  } as const;
}

export function invalidSessionResponse() {
  return {
    status: 401,
    body: {
      statusCode: 401,
      error: 'Unauthorized',
      code: 'INVALID_SESSION',
      message: 'Invalid session token',
    },
  } as const;
}

export function internalServerErrorResponse(e: unknown) {
  return {
    status: 500,
    body: {
      statusCode: 500,
      message: String(e),
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  } as const;
}
