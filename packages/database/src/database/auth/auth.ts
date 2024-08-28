import { hashAlgo, verificationCodeExpirationMinutes } from '~/consts';
import { client } from '~/db-client';
import type { auth as authModels } from '~/models';
import { auth as authSchema } from '~/schema';
import { mailer } from '@repo/email';
import { createVerificationCode } from '~/util';
import { addMinute } from '@formkit/tempo';

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
