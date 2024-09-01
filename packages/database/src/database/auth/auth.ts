import {
  hashAlgo,
  verificationExpirationMinutes,
  verificationRefreshMinutes,
  verificationTimeoutSeconds,
} from '~/consts';
import { client } from '~/db-client';
import type { auth as authModels } from '~/models';
import { auth as authSchema } from '~/schema';
import { mailer } from '@repo/email';
import { createOtpCode } from '~/util';
import { addMinute, addSecond } from '@formkit/tempo';
import { and, eq, gt } from 'drizzle-orm';

/**
 * Creates a user with the provided information.
 *
 * @param user - The user object containing user details.
 * @returns A promise that resolves when the user is created successfully.
 */
export async function createUser({ password, ...user }: authModels.UserCreate) {
  // Hash password with argon2.
  const hash = await Bun.password.hash(password, hashAlgo);
  const verificationCode = createOtpCode();

  // Put insertion into transaction to make sure a user doesn't get created without a password.
  await client.transaction(async (txn) => {
    const [dbUser] = await txn.insert(authSchema.users).values(user).returning();
    if (!dbUser) {
      txn.rollback();
    } else {
      // If succesful user creation, set password
      await txn.insert(authSchema.passwords).values({
        userId: dbUser.id,
        hash,
      });
      // Create and send verification email
      createOrRefreshVerification(dbUser, { db: txn });
    }
  });
}

/**
 * Creates or refreshes the verification code for a user.
 *
 * @param user - The ID of the user.
 * @param forceRefresh - Optional. If set to true, forces the generation of a new verification code even if a valid one already exists.
 * @returns A Promise that resolves when the verification code is refreshed.
 */
export async function createOrRefreshVerification(
  user: Pick<authModels.UserSelect, 'id' | 'email' | 'firstName' | 'lastName'>,
  {
    forceRefresh = false,
    sendEmail = true,
    db = client,
  }: { forceRefresh?: boolean; sendEmail?: boolean; db?: typeof client } = {},
) {
  const refreshTable = forceRefresh ? ('allowRefreshAt' as const) : ('autoRefreshAt' as const);
  const nonRefreshableCodes = await db.query.emailVerificationCodes.findMany({
    where: and(
      eq(authSchema.emailVerificationCodes.userId, user.id),
      gt(authSchema.emailVerificationCodes[refreshTable], new Date()),
    ),
    orderBy: (codes, { desc }) => [desc(codes[refreshTable])],
  });

  // Either no codes, or all codes are passed the refresh time. Should create a new code.
  if (nonRefreshableCodes.length === 0) {
    const verificationCode = createOtpCode();
    const entry = {
      code: verificationCode,
      allowRefreshAt: addSecond(new Date(), verificationTimeoutSeconds),
      autoRefreshAt: addMinute(new Date(), verificationRefreshMinutes),
      expiresAt: addMinute(new Date(), verificationExpirationMinutes),
    } as const;
    await db
      .insert(authSchema.emailVerificationCodes)
      .values({
        userId: user.id,
        ...entry,
      })
      .onConflictDoUpdate({
        target: authSchema.emailVerificationCodes.userId,
        set: entry,
      });

    // Now we've inserted code into db, so if `sendEmail` we should send the verification email
    if (sendEmail) {
      await mailer.sendVerification(user.email, {
        code: verificationCode,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    return verificationCode;
  }
}
