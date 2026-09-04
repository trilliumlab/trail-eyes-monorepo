import { oc } from '@orpc/contract';
import { z } from 'zod';

export const getUserCountContract = oc
  .route({
    method: 'GET',
    path: '/count',
    summary: 'Get the total number of registered user accounts',
  })
  .output(z.object({ count: z.number() }));

export const usersContract = {
  getUserCount: getUserCountContract,
};
