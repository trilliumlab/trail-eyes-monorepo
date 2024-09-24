import { defineConfig } from '@tanstack/start/config';
import { envOnlyMacros } from 'vite-env-only';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    preset: 'node-server',
  },
  vite: {
    plugins: () => [tsConfigPaths(), envOnlyMacros()],
  },
});
