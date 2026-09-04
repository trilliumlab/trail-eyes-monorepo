import { and, count, eq } from 'drizzle-orm';
import { client } from '~/db-client';
import { users } from '~/schema/auth';

/**
 * Counts all registered user accounts.
 *
 * @returns A promise that resolves to the total number of users.
 */
export async function getUserCount() {
  const [row] = await client.select({ count: count() }).from(users);
  return row?.count ?? 0;
}

/**
 * Lists verified staff (tier 3) signups still awaiting admin approval.
 *
 * @returns A promise that resolves to the pending accounts.
 */
export async function getPendingStaff() {
  return await client
    .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
    .from(users)
    .where(
      and(eq(users.tier, '3'), eq(users.emailVerified, true), eq(users.staffApproved, false)),
    );
}

/**
 * Approves a pending staff signup, granting it staff privileges.
 *
 * @param id - The user id to approve.
 */
export async function approveStaff(id: string) {
  await client.update(users).set({ staffApproved: true }).where(eq(users.id, id));
}
