import { oc } from '@orpc/contract';
import { oz } from '@orpc/zod';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { SpriteJsonSchema, SpritePathSchema } from '~/models/sprites';

export const spritesContract = oc.prefix('/sprites').router({
  getSpriteJson: oc
    .route({
      method: 'GET',
      path: '/{path}.json',
      summary: 'Get a sprite',
    })
    .input(
      z.object({
        path: SpritePathSchema,
      }),
    )
    .output(SpriteJsonSchema),
  getSpritePng: oc
    .route({
      method: 'GET',
      path: '/{path}.png',
      summary: 'Get a sprite',
    })
    .input(
      z.object({
        path: SpritePathSchema,
      }),
    )
    .output(oz.file().type('image/*')),
});

// const c = initContract();

// export const spritesContract = c.router(
//   {
//     getSpriteJson: {
//       method: 'GET',
//       path: '/:path.json',
//       pathParams: z.object({
//         path: SpritePathSchema,
//       }),
//       summary: 'Get a sprite',
//       responses: {
//         200: SpriteJsonSchema,
//       },
//     },
//     getSpritePng: {
//       method: 'GET',
//       path: '/:path.png',
//       pathParams: z.object({
//         path: SpritePathSchema,
//       }),
//       summary: 'Get a sprite',
//       responses: {
//         200: z.instanceof(Blob),
//       },
//     },
//   },
//   {
//     pathPrefix: '/sprites',
//   },
// );
