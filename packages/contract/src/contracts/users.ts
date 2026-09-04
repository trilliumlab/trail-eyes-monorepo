import { oc } from '@orpc/contract';
import { z } from 'zod';

export const getUserCountContract = oc
  .route({
    method: 'GET',
    path: '/count',
    summary: 'Get the total number of registered user accounts',
  })
  .output(z.object({ count: z.number() }));

export const getPendingStaffContract = oc
  .route({
    method: 'GET',
    path: '/pending-staff',
    summary: 'List staff (tier 3) signups awaiting admin approval. Admin only.',
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        createdAt: z.coerce.date(),
      }),
    ),
  );

export const approveStaffContract = oc
  .route({
    method: 'POST',
    path: '/{id}/approve',
    summary: 'Approve a pending staff signup. Admin only.',
  })
  .input(z.object({ id: z.string() }));

export const usersContract = {
  getUserCount: getUserCountContract,
  getPendingStaff: getPendingStaffContract,
  approveStaff: approveStaffContract,
};
