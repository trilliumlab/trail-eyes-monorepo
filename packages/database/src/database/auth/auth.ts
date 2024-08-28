import { hashAlgo, verificationCodeExpirationMinutes } from '~/consts';
import { client } from '~/db-client';
import type { auth as authModels } from '~/models';
import { auth as authSchema } from '~/schema';
import { mailer } from '@repo/email';
import { createVerificationCode } from '~/util';
import { addMinute } from '@formkit/tempo';
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
  const verificationCode = createVerificationCode();

  // Put insertion into transaction to make sure a user doesn't get created without a password.
  await client.transaction(async (txn) => {
    const [{ userId }] = (await txn
      .insert(authSchema.users)
      .values(user)
      .returning({ userId: authSchema.passwords.userId })) as [{ userId: string | undefined }];
    if (!userId) {
      txn.rollback();
    } else {
      await txn.insert(authSchema.passwords).values({
        userId,
        hash,
      });
      await txn.insert(authSchema.emailVerificationCodes).values({
        userId,
        code: verificationCode,
        expiresAt: addMinute(new Date(), verificationCodeExpirationMinutes),
      });
    }
  });

  // Send verification code
  await mailer.sendVerification(user.email, {
    code: verificationCode,
    firstName: user.firstName,
    lastName: user.lastName,
  });
}

/**
 * Refreshes the verification code for a user.
 *
 * @param userId - The ID of the user.
 * @param force - Optional. If set to true, forces the generation of a new verification code even if a valid one already exists.
 * @returns A Promise that resolves when the verification code is refreshed.
 */
export async function refreshVerificationCode(userId: string, force = false) {
  const validCodes = await client.query.emailVerificationCodes.findMany({
    where: and(
      eq(authSchema.emailVerificationCodes.userId, userId),
      gt(authSchema.emailVerificationCodes.expiresAt, new Date()),
    ),
    orderBy: (codes, { desc }) => [desc(codes.expiresAt)],
  });

  // Get the codes that are eligible to be force-refreshed.
  const refreshableCodes = validCodes.filter((code) => code.expiresAt < new Date());
  // TODO implement

  if (validCodes.length === 0 || force) {
    const verificationCode = createVerificationCode();
    await client
      .update(authSchema.emailVerificationCodes)
      .set({
        code: verificationCode,
        expiresAt: addMinute(new Date(), verificationCodeExpirationMinutes),
      })
      .where(eq(authSchema.emailVerificationCodes.userId, userId));
    return verificationCode;
  }
}
