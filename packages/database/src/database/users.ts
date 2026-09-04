import { count } from 'drizzle-orm';
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
