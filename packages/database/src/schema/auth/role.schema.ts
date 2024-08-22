import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['developer', 'superAdmin', 'admin', 'volunteer', 'member']);
