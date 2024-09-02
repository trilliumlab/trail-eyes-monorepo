import swagger from '@elysiajs/swagger';
import type { ThemeId } from '@elysiajs/swagger/scalar/types';
import Elysia from 'elysia';

export const openapi = () =>
  new Elysia().use(
    swagger({
      path: 'docs',
      scalarConfig: {
        // Kepler theme is supported by swagger,
        // but hasn't been added to the list of supported elysia themes
        theme: 'kepler' as ThemeId,
      },
    }),
  );
