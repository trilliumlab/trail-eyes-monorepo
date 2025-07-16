import { geojsonContract } from './contracts/geojson';
import { reportsContract } from './contracts/reports';
import { spritesContract } from './contracts/sprites';
import { stylesContract } from './contracts/styles';
import { oc } from '@orpc/contract';

export const contract = {
  geojson: oc.prefix('/geojson').router(geojsonContract),
  reports: oc.prefix('/reports').router(reportsContract),
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
