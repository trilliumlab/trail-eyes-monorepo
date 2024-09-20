import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { models, db, errors } from '@repo/database';
import { lucia } from '@repo/database/auth';

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

export const LoginResponseSchema = z.object({
  requiresSecondFactor: z.boolean(),
  enabledSecondFactors: z.array(z.string()),
});

export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  summary: 'Login a user',
  description: 'Login a user',
  tags: ['auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: models.auth.UserCredentialsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
      headers: z.object({
        'set-cookie': z.string().openapi({
          example: 'auth_session=abc123; Path=/; HttpOnly; SameSite=Strict; Secure',
        }),
      }),
      description: 'User logged in successfully',
    },
    401: {
      description: 'Unauthorized',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

export const auth = new OpenAPIHono()
  .openapi(registerRoute, async (ctx) => {
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
  })
  .openapi(loginRoute, async (ctx) => {
    const body = ctx.req.valid('json');

    try {
      const user = await db.auth.verifyUser(body);
      // If it doesn't throw then the user is verified, need to create a session
      // TODO: set confirmed to false if the user has 2fa enabled
      const session = await lucia.createSession(user.id, { confirmed: true });
      const sessionCookie = await lucia.createSessionCookie(session.id);
      return ctx.json(
        {
          requiresSecondFactor: false,
          enabledSecondFactors: [],
        },
        200,
        {
          'set-cookie': sessionCookie.serialize(),
        },
      );
    } catch (e) {
      if (
        e instanceof errors.auth.InvalidCredentialsError ||
        e instanceof errors.auth.UserNotFoundError
      ) {
        return ctx.json(e, 401);
      }
      console.error(e);
      return ctx.text('Internal server error', 500);
    }
  });
