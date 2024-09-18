import { publicEnv } from '@repo/env';
import { type Adapter, Lucia } from 'lucia';
import { client } from './db-client';
import { auth as authSchema } from './schema';
import { auth as authModels } from './models';
import { eq, gt } from 'drizzle-orm';
import { Type } from '@sinclair/typebox';

/**
 * A lucia auth adapter with a custom Drizzle backend.
 */
const AuthAdapter = {
  async deleteExpiredSessions() {
    await client.delete(authSchema.sessions).where(gt(authSchema.sessions.expiresAt, new Date()));
  },
  async deleteSession(sessionId) {
    await client.delete(authSchema.sessions).where(eq(authSchema.sessions.id, sessionId));
  },
  async deleteUserSessions(userId) {
    await client.delete(authSchema.sessions).where(eq(authSchema.sessions.userId, userId));
  },
  async getSessionAndUser(sessionId) {
    const session = await client.query.sessions.findFirst({
      where: eq(authSchema.sessions.id, sessionId),
    });
    if (!session) {
      return [null, null];
    }
    const users = await client.query.users.findFirst({
      where: eq(authSchema.users.id, session.userId),
    });
    if (!users) {
      return [null, null];
    }
    return [
      { ...session, attributes: {} } ?? null,
      {
        id: session.userId,
        attributes: users,
      } ?? null,
    ];
  },
  async getUserSessions(userId) {
    const userSessions = await client.query.sessions.findMany({
      where: eq(authSchema.sessions.userId, userId),
    });
    return userSessions.map((s) => ({ ...s, attributes: {} }));
  },
  async setSession(session) {
    await client.insert(authSchema.sessions).values(session);
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    await client
      .update(authSchema.sessions)
      .set({ expiresAt })
      .where(eq(authSchema.sessions.id, sessionId));
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

const DatabaseUserAttributesSchema = Type.Omit(authModels.UserSelectSchema, ['id']);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof DatabaseUserAttributesSchema.static;
  }
}
