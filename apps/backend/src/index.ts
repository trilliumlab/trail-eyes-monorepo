import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'

import { ResponseHeadersPlugin } from '@orpc/server/plugins'

import { pub } from './orpc';

import { contract } from '@repo/contract';
import { publicEnv } from '@repo/env';
import { authPlugin } from './plugins/auth';
import { csrfPlugin } from './plugins/csrf';
import { geojsonRouter } from './routes/geojson';
import { spritesRouter } from './routes/sprites';
import { stylesRouter } from './routes/styles';
import { auth } from '@repo/database/auth';

const allowedOrigins = [publicEnv().authUrl, publicEnv().panelUrl, publicEnv().backendUrl];

const router = pub.router({
  geojson: geojsonRouter,
  sprites: spritesRouter,
  styles: stylesRouter,
})

const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: allowedOrigins
    }),
    new ResponseHeadersPlugin()
  ]
})

// const openApiHandler = new OpenApi

// const 

Bun.serve({
  port: 3000,
  async fetch(request: Request) {
    // Handle oRPC rpc requests
    const { matched: rpcMatched, response: rpcResponse } = await rpcHandler.handle(request)
    if (rpcMatched) {
      return rpcResponse
    }

    // Handle oRPC openapi requests

    // Handle better-auth requests
    const authResponse = await auth.handler(request);
    if (authResponse.status !== 404) {
      return authResponse;
    }

    return new Response('Not found', { status: 404 })
  }
})

console.log('Server is running on port 3000');

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
