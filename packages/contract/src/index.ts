import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { authContract } from './contracts/auth';
import { geojsonContract } from './contracts/geojson';
import { spritesContract } from './contracts/sprites';
import { stylesContract } from './contracts/styles';
import { ErrorResponseBaseSchema } from './models/base';

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
    },
  },
);
