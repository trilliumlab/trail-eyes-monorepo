import { oc } from '@orpc/contract';
import { oz } from '@orpc/zod';
import { z } from 'zod';
import { SpriteJsonSchema, SpritePathSchema } from '~/models/sprites';

export const getSpriteJsonContract = oc
  .input(z.object({ path: SpritePathSchema }))
  .output(SpriteJsonSchema);

export const getSpritePngContract = oc
  .input(z.object({ path: SpritePathSchema }))
  .output(oz.blob());
  // .type('image/*')

export const spritesContract = {
  getSpriteJson: getSpriteJsonContract,
  getSpritePng: getSpritePngContract,
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
