import { lucia } from '@repo/database/auth';
import { fastifyPlugin } from 'fastify-plugin';
import type { Session, User } from 'lucia';

export const authPlugin = fastifyPlugin(
  async (app) => {
    app.addHook('preHandler', async (req, res) => {
      const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

      if (!sessionId) {
        req.user = null;
        req.session = null;
        return;
      }

      const { session, user } = await lucia.validateSession(sessionId);
      if (session?.fresh) {
        const cookie = lucia.createSessionCookie(session.id);
        res.setCookie(cookie.name, cookie.value, cookie.attributes);
      }

      if (!session) {
        const cookie = lucia.createBlankSessionCookie();
        res.setCookie(cookie.name, cookie.value, cookie.attributes);
      }

      req.user = user;
      req.session = session;
      return;
    });
  },
  {
    name: 'auth',
    fastify: '5.x',
  },
);

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
}
