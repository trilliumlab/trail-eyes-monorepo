import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { contract } from '@repo/contract';
import { publicEnv } from '@repo/env';
import apiReference from '@scalar/fastify-api-reference';
import { initServer } from '@ts-rest/fastify';
import { generateOpenApi } from '@ts-rest/open-api';
import { fastify } from 'fastify';
import { authPlugin } from './plugins/auth';
import { csrfPlugin } from './plugins/csrf';
import { authRouter } from './routes/auth';
import { geojsonRouter } from './routes/geojson';
import { spritesRouter } from './routes/sprites';
import { stylesRouter } from './routes/styles';

const allowedOrigins = [publicEnv().authUrl, publicEnv().panelUrl, publicEnv().backendUrl];

const s = initServer();
const router = s.router(contract, {
  auth: authRouter,
  geojson: geojsonRouter,
  sprites: spritesRouter,
  styles: stylesRouter,
});

const app = fastify();

// Register middleware
app.register(fastifyCookie);
app.register(fastifyCors, { origin: allowedOrigins, credentials: true });
app.register(csrfPlugin, { allowedOrigins });
app.register(authPlugin);

// Register ts-rest routes
s.registerRouter(contract, router, app);

// OpenAPI schema
app.get('/openapi.json', async (req, reply) => {
  return reply.send(
    generateOpenApi(contract, {
      info: {
        title: 'TrailEyes API',
        version: '1.0.0',
      },
    }),
  );
});
app.register(apiReference, {
  routePrefix: '/docs',
  configuration: {
    spec: {
      url: '/openapi.json',
    },
    theme: 'kepler',
  },
});

await app.listen({ port: 8000, host: '0.0.0.0' });
