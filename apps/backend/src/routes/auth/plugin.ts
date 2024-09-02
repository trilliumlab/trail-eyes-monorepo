import { Elysia, t } from 'elysia';
import { models, db } from '@repo/database';

export const auth = new Elysia({ prefix: '/auth' }).post(
  '/register',
  async ({ body, error }) => {
    // db.auth.createUser(body);
    return error(500, 'Not implemented');
  },
  {
    // Make sure to only allow the fields we want a user to be able to control.
    // If fields like verified or role were included, they could be set by a malicious user.
    // Elysia/Typebox will remove all fields not on a schema.
    body: t.Pick(models.auth.UserCreateSchema, ['email', 'password', 'firstName', 'lastName']),
  },
);
