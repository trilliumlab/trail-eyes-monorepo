import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const SpritePathSchema = z.enum(['dark', 'dark@2x', 'light', 'light@2x', 'sdf', 'sdf@2x']);

export const TextFitSchema = z.enum(['stretchOrShrink', 'stretchOnly', 'proportional']);
export const StretchSchema = z.array(z.tuple([z.number(), z.number()]));

export const SpriteJsonSchema = z.record(
  z.object({
    height: z.number(),
    width: z.number(),
    x: z.number(),
    y: z.number(),
    pixelRatio: z.number(),
    content: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
    stretchX: StretchSchema.optional(),
    stretchY: StretchSchema.optional(),
    sdf: z.boolean().optional(),
    textFitWidth: TextFitSchema.optional(),
    textFitHeight: TextFitSchema.optional(),
  }),
);

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
        200: z.instanceof(File),
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
