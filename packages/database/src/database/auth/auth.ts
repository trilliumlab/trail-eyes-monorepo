import {
  hashAlgo,
  verificationExpirationMinutes,
  verificationRefreshMinutes,
  verificationTimeoutSeconds,
} from '../../consts';
import { client } from '../../db-client';
import type { auth as authModels } from '../../models';
import { auth as authSchema } from '../../schema';
import { mailer } from '@repo/email';
import { createOtpCode } from '../../util';
import { addMinute, addSecond } from '@formkit/tempo';
import { and, eq, gt } from 'drizzle-orm';
import postgres from 'postgres';
import {
  InvalidCredentialsError,
  RegistrationConflictError,
  UserNotFoundError,
} from '../../errors/auth';

/**
 * Creates a user with the provided information.
 *
 * @param user - The user object containing user details.
 * @returns A promise that resolves when the user is created successfully.
 */
export async function createUser({ password, ...user }: authModels.UserCreate) {
  // Hash password with argon2.
  const hash = await Bun.password.hash(password, hashAlgo);

  // Put insertion into transaction to make sure a user doesn't get created without a password.
  try {
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
        await createOrRefreshVerification(dbUser, { db: txn });
      }
    });
  } catch (e) {
    if (e instanceof postgres.PostgresError) {
      // Unique constraint violation
      if (e.code === '23505') {
        throw new RegistrationConflictError();
      }
    }
    throw e;
  }
}

/**
 * Verifies a user's credentials.
 *
 * @param user - The user object containing email and password.
 * @returns A promise that resolves when the user is verified.
 * @throws {UserNotFoundError} If the user is not found.
 * @throws {InvalidCredentialsError} If the credentials are invalid.
 */
export async function verifyUser(user: authModels.UserCredentials) {
  const dbUser = await client.query.users.findFirst({
    where: eq(authSchema.users.email, user.email),
  });
  if (!dbUser) {
    throw new UserNotFoundError();
  }

  const password = await client.query.passwords.findFirst({
    where: eq(authSchema.passwords.userId, dbUser.id),
    columns: {
      hash: true,
    },
  });
  if (!password) {
    throw new UserNotFoundError();
  }

  const verified = await Bun.password.verify(password.hash, user.password);
  if (!verified) {
    throw new InvalidCredentialsError();
  }

  return dbUser;
}

/**
 * Creates or refreshes the verification code for a user.
 *
 * @param user - The user object.
 * @param options - Options for the verification code.
 * @param options.forceRefresh - Whether to force refresh the verification code (sends a new verification code if allowed). Otherwise, will only send a new code if previous codes are almost expired.
 * @param options.sendEmail - Whether to send an email with the verification code.
 * @param options.db - The database client to use (useful for transactions).
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
        expirationString: `${verificationExpirationMinutes / 60} hour${verificationExpirationMinutes === 60 ? '' : 's'}`,
      });
    }

    return verificationCode;
  }
}

/**
 * Updates a session in the database.
 *
 * @param session - The session object to update.
 */
export async function updateSession(session: Partial<authModels.SessionInsert> & { id: string }) {
  const { id, ...update } = session;
  await client
    .update(authSchema.sessions)
    .set(update)
    .where(eq(authSchema.sessions.id, session.id));
}
