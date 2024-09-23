import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';

type Options = {
  enabled?: boolean;
  allowedOrigins?: string[];
};

export const csrfPlugin = fastifyPlugin(
  async (app: FastifyInstance, { enabled = true, allowedOrigins = [] }: Options) => {
    if (!enabled) {
      return;
    }

    app.addHook('preHandler', (req, reply, done) => {
      if (req.method === 'GET') {
        return done();
      }

      const originHeader = req.headers.origin ?? null;
      const hostHeader = req.headers.host ?? null;
      if (
        originHeader &&
        hostHeader &&
        !verifyRequestOrigin(originHeader, [hostHeader, ...allowedOrigins])
      ) {
        console.error('Invalid origin', { originHeader, hostHeader });
        reply.status(403);
        reply.send({
          statusCode: 403,
          message: 'Invalid origin',
          error: 'Forbidden',
          code: 'FORBIDDEN',
        });
      }
      done();
    });
  },
  {
    name: 'csrf',
    fastify: '5.x',
  },
);
