import { geojsonContract } from './contracts/geojson';
import { spritesContract } from './contracts/sprites';
import { stylesContract } from './contracts/styles';
// import { ErrorResponseBaseSchema } from './models/base';
import { oc } from '@orpc/contract';

export const contract = {
  geojson: oc.prefix('/geojson').router(geojsonContract),
  sprites: oc.prefix('/sprites').router(spritesContract),
  styles: oc.prefix('/styles').router(stylesContract),
};

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
