import { db } from '@repo/database';
import { adminOnly, pub } from '../orpc';

export const getUserCount = pub.users.getUserCount.handler(async () => {
  return { count: await db.getUserCount() };
});

export const getPendingStaff = adminOnly.users.getPendingStaff.handler(async () => {
  return await db.getPendingStaff();
});

export const approveStaff = adminOnly.users.approveStaff.handler(async ({ input }) => {
  await db.approveStaff(input.id);
});

export const usersRouter = {
  getUserCount: getUserCount,
  getPendingStaff: getPendingStaff,
  approveStaff: approveStaff,
};
