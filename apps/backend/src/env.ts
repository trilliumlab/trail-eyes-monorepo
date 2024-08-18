import { t } from 'elysia';
import { RenameFields, parse } from '@repo/util';

export const envSchema = RenameFields(
  t.Object({
    // Http server settings
    NEXT_PUBLIC_BACKEND_URL: t.String(),
  }),
  {
    NEXT_PUBLIC_BACKEND_URL: 'BACKEND_URL',
  },
);

export const env = parse(envSchema, { ...process.env });
