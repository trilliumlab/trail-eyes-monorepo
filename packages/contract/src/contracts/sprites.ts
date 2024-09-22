import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { SpriteJsonSchema, SpritePathSchema } from '~/models/sprites';

const c = initContract();

export const spritesContract = c.router(
  {
    getSpriteJson: {
      method: 'GET',
      path: '/:path.json',
      pathParams: z.object({
        path: SpritePathSchema,
      }),
      summary: 'Get a sprite',
      responses: {
        200: SpriteJsonSchema,
      },
    },
    getSpritePng: {
      method: 'GET',
      path: '/:path.png',
      pathParams: z.object({
        path: SpritePathSchema,
      }),
      summary: 'Get a sprite',
      responses: {
        200: z.instanceof(Blob),
      },
    },
  },
  {
    pathPrefix: '/sprites',
  },
);

// export const sprites = new OpenAPIHono().get(
//   '/:path',
//   serveStatic({
//     root: '../../data/sprites/out',
//     rewriteRequestPath: (path) => path.replace(/^\/sprites/, ''),
//   }),
// );
