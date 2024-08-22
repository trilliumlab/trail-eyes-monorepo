import { pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['open', 'confirmed', 'inProgress', 'closed']);
