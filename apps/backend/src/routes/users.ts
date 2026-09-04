import { db } from '@repo/database';
import { pub } from '../orpc';

export const getUserCount = pub.users.getUserCount.handler(async () => {
  return { count: await db.getUserCount() };
});

export const usersRouter = {
  getUserCount: getUserCount,
};
