import { authContract } from './contracts/auth';
import { geojsonContract } from './contracts/geojson';
import { spritesContract } from './contracts/sprites';
import { stylesContract } from './contracts/styles';
// import { ErrorResponseBaseSchema } from './models/base';
import { oc } from '@orpc/contract';

export const contract = oc.router({
  auth: authContract,
  geojson: geojsonContract,
  sprites: spritesContract,
  styles: stylesContract,
});

// const c = initContract();

// export const contract = c.router(
//   {
//     // auth: authContract,
//     // geojson: geojsonContract,
//     // sprites: spritesContract,
//     // styles: stylesContract,
//   },
//   {
//     commonResponses: {
//       500: ErrorResponseBaseSchema.extend({
//         statusCode: z.literal(500),
//         error: z.literal('Internal Server Error'),
//       }),
//     },
//   },
// );
