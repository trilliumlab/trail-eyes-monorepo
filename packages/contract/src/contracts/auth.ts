import { oc } from '@orpc/contract';
import { UserCredentialsSchema } from '@repo/database/models/auth';
// import { z } from 'zod';
import {
  VerificationMetaResponseSchema,
  LoginResponseSchema,
  RegisterBodySchema,
  VerifyEmailBodySchema,
  SessionMetaResponseSchema,
  EnabledSecondFactorsResponseSchema,
} from '~/models/auth';
// import {
//   ErrorResponseBaseSchema,
//   InvalidCredentialsResponseSchema,
//   InvalidSessionResponseSchema,
// } from '~/models/base';

export const authContract = oc.prefix('/auth').router({
  getSessionMeta: oc
    .route({
      method: 'GET',
      path: '/session-meta',
      summary: 'Get session metadata',
    })
    .output(SessionMetaResponseSchema)
    .errors({
      // 401: InvalidSessionResponseSchema,
      INVALID_SESSION: {
        status: 401,
        message: 'Unauthorized',
      },
    }),
  register: oc
    .route({
      method: 'POST',
      path: '/register',
      summary: 'Register a new user',
    })
    .input(RegisterBodySchema)
    .errors({
      // 409: ErrorResponseBaseSchema.extend({
      //   statusCode: z.literal(409),
      //   error: z.literal('Conflict'),
      //   code: z.literal('REGISTRATION_CONFLICT'),
      // }),
      REGISTRATION_CONFLICT: {
        status: 409,
        message: 'Conflict',
      },
    }),
  login: oc
    .route({
      method: 'POST',
      path: '/login',
      summary: 'Log in a user',
    })
    .input(UserCredentialsSchema)
    .output(LoginResponseSchema)
    .errors({
      // 401: InvalidCredentialsResponseSchema,
      INVALID_CREDENTIALS: {
        status: 401,
        message: 'Invalid credentials',
      },
    }),
  getEnabledSecondFactors: oc
    .route({
      method: 'GET',
      path: '/enabled-second-factors',
      summary: 'Get enabled second factors',
    })
    .output(EnabledSecondFactorsResponseSchema)
    .errors({
      // 401: InvalidSessionResponseSchema,
      INVALID_SESSION: {
        status: 401,
        message: 'Unauthorized',
      },
    }),
  getVerificationMeta: oc
    .route({
      method: 'GET',
      path: '/get-verification-meta',
      summary: 'Get verification metadata',
    })
    .output(VerificationMetaResponseSchema)
    .errors({
      // 401: InvalidSessionResponseSchema,
      INVALID_SESSION: {
        status: 401,
        message: 'Unauthorized',
      },
    }),
  sendVerification: oc
    .route({
      method: 'POST',
      path: '/send-verification',
      summary: 'Send verification email',
      description:
        "Sends a verification email to the user's email address. If a code has been sent in the last 90 seconds, no action is taken.",
    })
    .output(VerificationMetaResponseSchema)
    .errors({
      // 401: InvalidSessionResponseSchema,
      INVALID_SESSION: {
        status: 401,
        message: 'Unauthorized',
      },
    }),
  verifyEmail: oc
    .route({
      method: 'POST',
      path: '/verify-email',
      summary: 'Verify email',
    })
    .input(VerifyEmailBodySchema)
    .errors({
      // 401: InvalidSessionResponseSchema,
      INVALID_SESSION: {
        status: 401,
        message: 'Unauthorized',
      },
      // 401: InvalidCredentialsResponseSchema,
      INVALID_CREDENTIALS: {
        status: 401,
        message: 'Invalid credentials',
      },
    }),
});

// const c = initContract();

// export const authContract = c.router(
//   {
//     getSessionMeta: {
//       method: 'GET',
//       path: '/session-meta',
//       summary: 'Get session metadata',
//       responses: {
//         200: SessionMetaResponseSchema,
//         401: InvalidSessionResponseSchema,
//       },
//     },
//     register: {
//       method: 'POST',
//       path: '/register',
//       summary: 'Register a new user',
//       body: RegisterBodySchema,
//       responses: {
//         200: c.noBody(),
//         409: ErrorResponseBaseSchema.extend({
//           statusCode: z.literal(409),
//           error: z.literal('Conflict'),
//           code: z.literal('REGISTRATION_CONFLICT'),
//         }),
//       },
//     },
//     login: {
//       method: 'POST',
//       path: '/login',
//       summary: 'Login a user',
//       body: UserCredentialsSchema,
//       responses: {
//         200: LoginResponseSchema,
//         401: InvalidCredentialsResponseSchema,
//       },
//     },
//     getEnabledSecondFactors: {
//       method: 'GET',
//       path: '/enabled-second-factors',
//       summary: 'Get enabled second factors',
//       responses: {
//         200: EnabledSecondFactorsResponseSchema,
//         401: InvalidSessionResponseSchema,
//       },
//     },
//     getVerificationMeta: {
//       method: 'GET',
//       path: '/get-verification-meta',
//       summary: 'Get verification metadata',
//       responses: {
//         200: VerificationMetaResponseSchema,
//         401: InvalidSessionResponseSchema,
//       },
//     },
//     sendVerification: {
//       method: 'POST',
//       path: '/send-verification',
//       summary: 'Send verification email',
//       description:
//         "Sends a verification email to the user's email address. If a code has been sent in the last 90 seconds, no action is taken.",
//       body: c.noBody(),
//       responses: {
//         200: VerificationMetaResponseSchema,
//         401: InvalidSessionResponseSchema,
//       },
//     },
//     verifyEmail: {
//       method: 'POST',
//       path: '/verify-email',
//       summary: 'Verify email',
//       body: VerifyEmailBodySchema,
//       responses: {
//         200: c.noBody(),
//         401: z.union([InvalidSessionResponseSchema, InvalidCredentialsResponseSchema]),
//       },
//     },
//   },
//   {
//     pathPrefix: '/auth',
//   },
// );
