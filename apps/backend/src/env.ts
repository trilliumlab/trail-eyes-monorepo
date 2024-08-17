import { t } from 'elysia';
import { RenameFields } from './util';
import { parse } from './util';

export const envSchema = RenameFields(
  t.Object({
    // Http server settings
    NEXT_PUBLIC_BACKEND_URL: t.String(),
    // test: t.Number(),
  }),
  {
    NEXT_PUBLIC_BACKEND_URL: 'BACKEND_URL',
  },
);

export const env = parse(envSchema, { ...process.env });
