import { publicEnv } from '@repo/env';
import { eq, gt } from 'drizzle-orm';
import { type Adapter, Lucia } from 'lucia';
import type { z } from 'zod';
import { client } from './db-client';
import { SessionSelectSchema, UserSelectSchema } from './models/auth';
import { sessions, users } from './schema/auth';

/**
 * A lucia auth adapter with a custom Drizzle backend.
 */
const AuthAdapter = {
  async deleteExpiredSessions() {
    await client.delete(sessions).where(gt(sessions.expiresAt, new Date()));
  },
  async deleteSession(sessionId) {
    await client.delete(sessions).where(eq(sessions.id, sessionId));
  },
  async deleteUserSessions(userId) {
    await client.delete(sessions).where(eq(sessions.userId, userId));
  },
  async getSessionAndUser(sessionId) {
    const session = await client.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
    });
    if (!session) {
      return [null, null];
    }
    const user = await client.query.users.findFirst({
      where: eq(users.id, session.userId),
    });
    if (!user) {
      return [null, null];
    }
    return [
      { ...session, attributes: session } ?? null,
      {
        id: user.id,
        attributes: user,
      } ?? null,
    ];
  },
  async getUserSessions(userId) {
    const userSessions = await client.query.sessions.findMany({
      where: eq(sessions.userId, userId),
    });
    return userSessions.map((s) => ({ ...s, attributes: s }));
  },
  async setSession(session) {
    await client.insert(sessions).values(session);
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    await client.update(sessions).set({ expiresAt }).where(eq(sessions.id, sessionId));
  },
} satisfies Adapter;

export const lucia = new Lucia(AuthAdapter, {
  sessionCookie: {
    attributes: {
      secure:
        publicEnv().backendUrl.startsWith('https://') &&
        publicEnv().authUrl.startsWith('https://') &&
        publicEnv().panelUrl.startsWith('https://'),
    },
  },
  getUserAttributes: (attributes) => attributes,
});

const DatabaseUserAttributesSchema = UserSelectSchema.omit({ id: true });
const DatabaseSessionAttributesSchema = SessionSelectSchema.omit({
  id: true,
  userId: true,
  expiresAt: true,
  createdAt: true,
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: z.infer<typeof DatabaseUserAttributesSchema>;
    DatabaseSessionAttributes: z.infer<typeof DatabaseSessionAttributesSchema>;
  }
}
