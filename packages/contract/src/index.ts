import { initContract } from '@ts-rest/core';
import { authContract } from './auth';
import { geojsonContract } from './geojson';
import { spritesContract } from './sprites';
import { stylesContract } from './styles';
import { z } from 'zod';

export const ErrorResponseBaseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  code: z.string().optional(),
});

const c = initContract();

export const contract = c.router(
  {
    auth: authContract,
    geojson: geojsonContract,
    sprites: spritesContract,
    styles: stylesContract,
  },
  {
    commonResponses: {
      500: ErrorResponseBaseSchema.extend({
        statusCode: z.literal(500),
        error: z.literal('Internal Server Error'),
      }),
      404: ErrorResponseBaseSchema.extend({
        statusCode: z.literal(404),
        error: z.literal('Not Found'),
      }),
    },
  },
);
