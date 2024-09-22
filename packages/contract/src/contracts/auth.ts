import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { UserCreateSchema, UserCredentialsSchema } from '@repo/database/models/auth';
import { LoginResponseSchema } from '~/models/auth';
import { ErrorResponseBaseSchema } from '~/models/base';

const c = initContract();

export const authContract = c.router(
  {
    register: {
      method: 'POST',
      path: '/register',
      summary: 'Register a new user',
      body: UserCreateSchema.pick({
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      }),
      responses: {
        200: c.noBody(),
        409: ErrorResponseBaseSchema.extend({
          statusCode: z.literal(409),
          error: z.literal('Conflict'),
          code: z.literal('REGISTRATION_CONFLICT'),
        }),
      },
    },
    login: {
      method: 'POST',
      path: '/login',
      summary: 'Login a user',
      body: UserCredentialsSchema,
      responses: {
        200: LoginResponseSchema,
        401: ErrorResponseBaseSchema.extend({
          statusCode: z.literal(401),
          error: z.literal('Unauthorized'),
          code: z.literal('UNAUTHORIZED'),
        }),
      },
    },
  },
  {
    pathPrefix: '/auth',
  },
);

// export const registerRoute = createRoute({
//   method: 'post',
//   path: '/register',
//   summary: 'Register a new user',
//   description: 'Register a new user',
//   tags: ['auth'],
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: models.auth.UserCreateSchema.pick({
//             email: true,
//             password: true,
//             firstName: true,
//             lastName: true,
//           }),
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: 'User created successfully',
//     },

//   },
// });

// export const LoginResponseSchema = z.object({
//   requiresSecondFactor: z.boolean(),
//   enabledSecondFactors: z.array(z.string()),
// });

// export const loginRoute = createRoute({
//   method: 'post',
//   path: '/login',
//   summary: 'Login a user',
//   description: 'Login a user',
//   tags: ['auth'],
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: models.auth.UserCredentialsSchema,
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       content: {
//         'application/json': {
//           schema: LoginResponseSchema,
//         },
//       },
//       headers: z.object({
//         'set-cookie': z.string().openapi({
//           example: 'auth_session=abc123; Path=/; HttpOnly; SameSite=Strict; Secure',
//         }),
//       }),
//       description: 'User logged in successfully',
//     },
//     401: {
//       description: 'Unauthorized',
//     },
//     500: {
//       description: 'Internal server error',
//     },
//   },
// });

// export const auth = new OpenAPIHono()
//   .openapi(registerRoute, async (ctx) => {
//     const body = ctx.req.valid('json');
//     try {
//       await db.auth.createUser(body);
//     } catch (e) {
//       if (e instanceof errors.auth.RegistrationConflictError) {
//         return ctx.json(e, 409);
//       }
//       // TODO: Use a specific json error type here.
//       return ctx.text('Internal server error', 500);
//     }
//     return ctx.newResponse(null, 200);
//   })
//   .openapi(loginRoute, async (ctx) => {
//     const body = ctx.req.valid('json');

//     try {
//       const user = await db.auth.verifyUser(body);
//       // If it doesn't throw then the user is verified, need to create a session
//       // TODO: set confirmed to false if the user has 2fa enabled
//       const session = await lucia.createSession(user.id, { confirmed: true });
//       const sessionCookie = await lucia.createSessionCookie(session.id);
//       return ctx.json(
//         {
//           requiresSecondFactor: false,
//           enabledSecondFactors: [],
//         },
//         200,
//         {
//           'set-cookie': sessionCookie.serialize(),
//         },
//       );
//     } catch (e) {
//       if (
//         e instanceof errors.auth.InvalidCredentialsError ||
//         e instanceof errors.auth.UserNotFoundError
//       ) {
//         return ctx.json(e, 401);
//       }
//       console.error(e);
//       return ctx.text('Internal server error', 500);
//     }
//   });
