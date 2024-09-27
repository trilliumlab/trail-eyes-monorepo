import { contract } from '@repo/contract';
import { db } from '@repo/database';
import { lucia } from '@repo/database/auth';
import {
  InvalidCredentialsError,
  RegistrationConflictError,
  UserNotFoundError,
} from '@repo/database/errors/auth';
import { initServer } from '@ts-rest/fastify';
import {
  internalServerErrorResponse,
  invalidCredentialsResponse,
  invalidSessionResponse,
} from '~/responses';

const s = initServer();

export const authRouter = s.router(contract.auth, {
  register: async ({ body, reply }) => {
    try {
      const user = await db.createUser(body);

      // Once user is created, create a session
      // FIXME: Figure out why session confirmation is not persisted
      const session = await lucia.createSession(user.id, { confirmed: true });
      const sessionCookie = lucia.createSessionCookie(session.id);
      reply.header('set-cookie', sessionCookie.serialize());
    } catch (e) {
      if (e instanceof RegistrationConflictError) {
        return {
          status: 409,
          body: {
            statusCode: 409,
            message: 'Email already in use',
            error: 'Conflict',
            code: 'REGISTRATION_CONFLICT',
          },
        };
      }
      console.error(e);
      return internalServerErrorResponse(e);
    }
    return { status: 200 };
  },
  login: async ({ body, reply }) => {
    try {
      const user = await db.verifyUser(body);
      // If it doesn't throw then the user is verified, need to create a session
      // TODO: set confirmed to false if the user has 2fa enabled
      const session = await lucia.createSession(user.id, { confirmed: true });
      const sessionCookie = lucia.createSessionCookie(session.id);

      reply.header('set-cookie', sessionCookie.serialize());
      return {
        status: 200,
        body: {
          userVerified: user.verified,
          requiresSecondFactor: false,
          enabledSecondFactors: [],
        },
      };
    } catch (e) {
      if (e instanceof InvalidCredentialsError || e instanceof UserNotFoundError) {
        return invalidCredentialsResponse();
      }
      console.error(e);
      return internalServerErrorResponse(e);
    }
  },
  getSessionMeta: async ({ request }) => {
    const user = request.user;
    const session = request.session;
    if (!user || !session) {
      return invalidSessionResponse();
    }
    return {
      status: 200,
      body: {
        userVerified: user.verified,
        sessionConfirmed: session.confirmed,
      },
    };
  },
  getVerificationMeta: async ({ request }) => {
    const user = request.user;
    if (!user) {
      return invalidSessionResponse();
    }
    if (user.verified) {
      return {
        status: 200,
        body: { userVerified: true },
      };
    }
    const lastCode = await db.getValidVerificationCode(user.id);
    if (!lastCode) {
      return {
        status: 200,
        body: {
          userVerified: false,
          secondsUntilCanResend: 0,
          email: user.email,
          hasActiveCode: false,
          shouldResend: true,
        },
      };
    }

    const secondsUntilCanResend = Math.max(
      Math.ceil((lastCode.allowRefreshAt.getTime() - Date.now()) / 1000),
      0,
    );
    const shouldResend = lastCode.autoRefreshAt < new Date();
    return {
      status: 200,
      body: {
        userVerified: false,
        secondsUntilCanResend,
        email: user.email,
        hasActiveCode: true,
        shouldResend,
      },
    };
  },
  sendVerification: async ({ request }) => {
    const user = request.user;
    if (!user) {
      return invalidSessionResponse();
    }
    if (user.verified) {
      return {
        status: 200,
        body: { userVerified: true },
      };
    }
    // Send the email verification code
    const code = await db.createOrRefreshVerificationCode(user);
    if (!code) {
      return internalServerErrorResponse('Failed to create verification code');
    }
    const secondsUntilCanResend = Math.max(
      Math.ceil((code.allowRefreshAt.getTime() - Date.now()) / 1000),
      0,
    );
    return {
      status: 200,
      body: {
        userVerified: false,
        secondsUntilCanResend,
        email: user.email,
        hasActiveCode: true,
        shouldResend: false,
      },
    };
  },
  verifyEmail: async ({ body: { code }, request }) => {
    const user = request.user;
    if (!user) {
      return invalidSessionResponse();
    }
    const lastCode = await db.getValidVerificationCode(user.id);
    if (lastCode?.code === code) {
      // Update user's verified status
      await db.updateUser({ id: user.id, verified: true });
      return { status: 200, body: undefined };
    }
    return invalidCredentialsResponse();
  },
});
