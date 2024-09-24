import { addMinute, addSecond } from '@formkit/tempo';
import { mailer } from '@repo/email';
import { and, eq, gt } from 'drizzle-orm';
import postgres from 'postgres';
import {
  hashAlgo,
  verificationExpirationMinutes,
  verificationRefreshMinutes,
  verificationTimeoutSeconds,
} from '~/consts';
import { client } from '~/db-client';
import {
  InvalidCredentialsError,
  RegistrationConflictError,
  UserNotFoundError,
} from '~/errors/auth';
import type { SessionInsert, UserCreate, UserCredentials, UserSelect } from '~/models/auth';
import { emailVerificationCodes, passwords, sessions, users } from '~/schema/auth';
import { createOtpCode } from '~/utils';

/**
 * Creates a user with the provided information.
 *
 * @param user - The user object containing user details.
 * @returns A promise that resolves when the user is created successfully.
 */
export async function createUser({ password, ...user }: UserCreate) {
  // Hash password with argon2.
  const hash = await Bun.password.hash(password, hashAlgo);

  // Put insertion into transaction to make sure a user doesn't get created without a password.
  try {
    return await client.transaction(async (txn) => {
      const [dbUser] = await txn.insert(users).values(user).returning();
      if (!dbUser) {
        throw txn.rollback();
      }
      // If succesful user creation, set password
      await txn.insert(passwords).values({
        userId: dbUser.id,
        hash,
      });
      return dbUser;
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
export async function verifyUser(user: UserCredentials) {
  const dbUser = await client.query.users.findFirst({
    where: eq(users.email, user.email),
  });
  if (!dbUser) {
    throw new UserNotFoundError();
  }

  const password = await client.query.passwords.findFirst({
    where: eq(passwords.userId, dbUser.id),
    columns: {
      hash: true,
    },
  });
  if (!password) {
    throw new UserNotFoundError();
  }

  const verified = await Bun.password.verify(user.password, password.hash);
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
  user: Pick<UserSelect, 'id' | 'email' | 'firstName' | 'lastName'>,
  {
    forceRefresh = false,
    sendEmail = true,
    db = client,
  }: { forceRefresh?: boolean; sendEmail?: boolean; db?: typeof client } = {},
) {
  const refreshTable = forceRefresh ? ('allowRefreshAt' as const) : ('autoRefreshAt' as const);
  const nonRefreshableCodes = await db.query.emailVerificationCodes.findMany({
    where: and(
      eq(emailVerificationCodes.userId, user.id),
      gt(emailVerificationCodes[refreshTable], new Date()),
    ),
    orderBy: (codes, { desc }) => [desc(codes[refreshTable])],
  });

  const mostRecentCode = nonRefreshableCodes[0];

  if (mostRecentCode) {
    return mostRecentCode;
  }

  // Either no codes, or all codes are passed the refresh time. Should create a new code.
  const verificationCode = createOtpCode();
  const entry = {
    code: verificationCode,
    allowRefreshAt: addSecond(new Date(), verificationTimeoutSeconds),
    autoRefreshAt: addMinute(new Date(), verificationRefreshMinutes),
    expiresAt: addMinute(new Date(), verificationExpirationMinutes),
  } as const;
  const dbEntry = await db
    .insert(emailVerificationCodes)
    .values({
      userId: user.id,
      ...entry,
    })
    .onConflictDoUpdate({
      target: emailVerificationCodes.userId,
      set: entry,
    })
    .returning();

  // Now we've inserted code into db, so if `sendEmail` we should send the verification email
  if (sendEmail) {
    console.log('sending email');
    await mailer.sendVerification(user.email, {
      code: verificationCode,
      firstName: user.firstName,
      lastName: user.lastName,
      expirationString: `${verificationExpirationMinutes / 60} hour${verificationExpirationMinutes === 60 ? '' : 's'}`,
    });
    console.log('sent email');
  }

  return dbEntry[0];
}

/**
 * Updates a session in the database.
 *
 * @param session - The session object to update.
 */
export async function updateSession(session: Partial<SessionInsert> & { id: string }) {
  const { id, ...update } = session;
  await client.update(sessions).set(update).where(eq(sessions.id, session.id));
}
