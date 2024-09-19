import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { models, db, errors } from '@repo/database';

export const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  summary: 'Register a new user',
  description: 'Register a new user',
  tags: ['auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: models.auth.UserCreateSchema.pick({
            email: true,
            password: true,
            firstName: true,
            lastName: true,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User created successfully',
    },
    409: {
      // TODO: Use a specific error type here.
      description: 'User already exists',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

export const auth = new OpenAPIHono().openapi(registerRoute, async (ctx) => {
  const body = ctx.req.valid('json');
  try {
    await db.auth.createUser(body);
  } catch (e) {
    if (e instanceof errors.auth.RegistrationConflictError) {
      return ctx.json(e, 409);
    }
    // TODO: Use a specific json error type here.
    return ctx.text('Internal server error', 500);
  }
  return ctx.newResponse(null, 200);
});
