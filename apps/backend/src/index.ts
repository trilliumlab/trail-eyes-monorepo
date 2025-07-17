import { RPCHandler } from '@orpc/server/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import { ResponseHeadersPlugin } from '@orpc/server/plugins';

import { pub } from './orpc';

import { publicEnv } from '@repo/env';
import { geojsonRouter } from './routes/geojson';
import { spritesRouter } from './routes/sprites';
import { stylesRouter } from './routes/styles';
import { auth } from '@repo/database/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { ZodToJsonSchemaConverter } from '@orpc/zod';
import { reportsRouter } from './routes/reports';
import { onError } from '@orpc/server';
import { logger } from './logger';

const allowedOrigins = [publicEnv().panelUrl, publicEnv().backendUrl];

const router = pub.router({
  geojson: geojsonRouter,
  reports: reportsRouter,
  sprites: spritesRouter,
  styles: stylesRouter,
});

const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: allowedOrigins,
    }),
    new ResponseHeadersPlugin(),
  ],
  interceptors: [onError((error) => logger.error(error))],
});

const openApiHandler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: allowedOrigins,
    }),
    new ResponseHeadersPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'TrailEyes API',
          version: '0.0.1',
        },
      },
    }),
  ],
  interceptors: [onError((error) => logger.error(error))],
});

const app = new Hono();

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

// Handle oRPC rest requests
app.use('*', async (c, next) => {
  const { matched, response } = await openApiHandler.handle(c.req.raw);
  if (matched) {
    return c.newResponse(response.body, response);
  }

  return next();
});

// Handle oRPC rpc requests
app.use('/rpc/*', async (c, next) => {
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: '/rpc',
  });
  if (matched) {
    return c.newResponse(response.body, response);
  }

  return next();
});

// Handle better-auth requests
app.on(['POST', 'GET'], '/auth/*', async (c, next) => {
  const authResponse = await auth.handler(c.req.raw);
  if (authResponse.status !== 404) {
    return authResponse;
  }

  return next();
});

export default {
  port: 8000,
  fetch: app.fetch,
};

// Bun.serve({
//   port: 8000,
//   async fetch(request: Request) {
//     let res = new Response('Not found', { status: 404 });

//     const { matched: rpcMatched, response: rpcResponse } = await rpcHandler.handle(request)
//     if (rpcMatched) {
//       res = rpcResponse;
//     }

//     // Handle oRPC openapi requests (TODO)

//     const authResponse = await auth.handler(request);
//     if (authResponse.status !== 404) {
//       res = authResponse;
//     }

//     // CORS
//     res.headers.set('Access-Control-Allow-Origin', '*');
//     res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

//     return res
//   }
// })

// console.log('Server is running on port 8000');

// const app = fastify();

// // Register middleware
// app.register(fastifyCookie);
// app.register(fastifyCors, { origin: allowedOrigins, credentials: true });
// app.register(csrfPlugin, { allowedOrigins });
// app.register(authPlugin);

// // Register oRPC routers (mount each router at its prefix)
// app.register(authRouter, { prefix: '/auth' });
// app.register(geojsonRouter, { prefix: '/geojson' });
// app.register(spritesRouter, { prefix: '/sprites' });
// app.register(stylesRouter, { prefix: '/styles' });

// // OpenAPI schema
// app.get('/openapi.json', async (req, reply) => {
//   return reply.send(
//     generateOpenApi(contract, {
//       info: {
//         title: 'TrailEyes API',
//         version: '1.0.0',
//       },
//     }),
//   );
// });
// app.register(apiReference, {
//   routePrefix: '/docs',
//   configuration: {
//     spec: {
//       url: '/openapi.json',
//     },
//     theme: 'kepler',
//   },
// });

// await app.listen({ port: 8000, host: '0.0.0.0' });
