import { Elysia, error, StatusMap, t } from 'elysia';
import { models, db, errors } from '@repo/database';

export const auth = new Elysia({ prefix: '/auth' }).post(
  '/register',
  async ({ body }) => {
    try {
      await db.auth.createUser(body);
    } catch (e) {
      if (e instanceof errors.auth.RegistrationConflictError) {
        return error(StatusMap.Conflict, e);
      }
      throw e;
    }
  },
  {
    // Make sure to only allow the fields we want a user to be able to control.
    // If fields like verified or role were included, they could be set by a malicious user.
    // Elysia/Typebox will remove all fields not on a schema.
    body: t.Pick(models.auth.UserCreateSchema, ['email', 'password', 'firstName', 'lastName']),
  },
);
