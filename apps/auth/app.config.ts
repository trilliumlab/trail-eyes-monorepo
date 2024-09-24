import { defineConfig } from '@tanstack/start/config';
import { envOnlyMacros } from 'vite-env-only';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  deployment: {
    preset: 'node-server',
  },
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: envOnlyMacros is a plugin.
    plugins: () => [tsConfigPaths(), envOnlyMacros() as any],
  },
});
