import { oc } from '@orpc/contract';
import { z } from 'zod';
import { StylesQuerySchema } from '~/models/styles';

export const getLightStyleContract = oc
  .route({
    method: 'GET',
    path: '/light.json',
    summary: 'Get light style',
  })
  .input(StylesQuerySchema)
  .output(z.record(z.any()));

export const getDarkStyleContract = oc
  .route({ 
    method: 'GET',
    path: '/dark.json',
    summary: 'Get dark style',
  })
  .input(StylesQuerySchema)
  .output(z.record(z.any()));

export const stylesContract = {
  getLightStyle: getLightStyleContract,
  getDarkStyle: getDarkStyleContract,
};

// const c = initContract();

// export const stylesContract = c.router(
//   {
//     getLightStyle: {
//       method: 'GET',
//       path: '/light.json',
//       summary: 'Get light style',
//       query: StylesQuerySchema,
//       responses: {
//         200: z.record(z.any()),
//       },
//     },
//     getDarkStyle: {
//       method: 'GET',
//       path: '/dark.json',
//       summary: 'Get dark style',
//       query: StylesQuerySchema,
//       responses: {
//         200: z.record(z.any()),
//       },
//     },
//   },
//   {
//     pathPrefix: '/styles',
//   },
// );
