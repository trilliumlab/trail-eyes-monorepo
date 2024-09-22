import { contract } from '@repo/contract';
import { db } from '@repo/database';
import { lucia } from '@repo/database/auth';
import {
  InvalidCredentialsError,
  RegistrationConflictError,
  UserNotFoundError,
} from '@repo/database/errors/auth';
import { initServer } from '@ts-rest/fastify';

const s = initServer();

export const authRouter = s.router(contract.auth, {
  register: async ({ body }) => {
    try {
      await db.createUser(body);
    } catch (e) {
      if (e instanceof RegistrationConflictError) {
        return { status: 409 };
      }
      // TODO: Use a specific json error type here.
      // return ctx.text('Internal server error', 500);
      return { status: 500, body: 'Internal server error' };
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
          requiresSecondFactor: false,
          enabledSecondFactors: [],
        },
      };
    } catch (e) {
      if (e instanceof InvalidCredentialsError || e instanceof UserNotFoundError) {
        return { status: 401 };
      }
      console.error(e);
      return { status: 500, body: 'Internal server error' };
    }
  },
});
