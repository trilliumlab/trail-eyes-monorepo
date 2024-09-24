import { defineConfig } from '@tanstack/start/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { envOnlyMacros } from 'vite-env-only';
import type { Plugin } from 'vinxi/dist/types/lib/vite-dev';

export default defineConfig({
  deployment: {
    preset: 'node-server',
  },
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: envOnlyMacros is a plugin.
    plugins: () => [tsConfigPaths(), envOnlyMacros() as any],
  },
});
