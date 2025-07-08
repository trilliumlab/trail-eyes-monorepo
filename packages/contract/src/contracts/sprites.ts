import { oc } from '@orpc/contract';
import { z } from 'zod';
import { SpriteJsonSchema, SpritePathSchema } from '~/models/sprites';

export const getSpriteContract = oc
  .route({
    method: 'GET',
    path: '/{path}',
    summary: 'Get a sprite JSON/PNG',
  })
  .input(z.object({ path: SpritePathSchema }))
  .output(z.union([SpriteJsonSchema, z.instanceof(Blob)]));

export const spritesContract = {
  getSprite: getSpriteContract,
};

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
