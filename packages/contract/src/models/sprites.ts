import { z } from 'zod';

export const SpritePathSchema = z.enum(['dark.json', 'dark@2x.json', 'light.json', 'light@2x.json', 'sdf.json', 'sdf@2x.json', 'dark.png', 'dark@2x.png', 'light.png', 'light@2x.png', 'sdf.png', 'sdf@2x.png']);

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
