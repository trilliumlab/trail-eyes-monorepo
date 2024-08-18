import { RenameFields } from './typebox';
import { Type } from '@sinclair/typebox';

export const SharedEnvSchema = RenameFields(
  Type.Object({
    // Http server settings
    NEXT_PUBLIC_BACKEND_URL: Type.String(),
  }),
  {
    NEXT_PUBLIC_BACKEND_URL: 'BACKEND_URL',
  },
);
