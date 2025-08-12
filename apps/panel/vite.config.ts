import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { envOnlyMacros } from 'vite-env-only';
import { join } from 'node:path';
import viteReact from '@vitejs/plugin-react';

const config = {
  srcDirectory: 'src',
} as const;

export default defineConfig({
  ssr: {
    noExternal: [],
  },
  plugins: [
    tsconfigPaths(),
    envOnlyMacros(),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      target: 'bun',
      tsr: {
        srcDirectory: config.srcDirectory,
        generatedRouteTree: join(config.srcDirectory, 'route-tree.gen.ts'),
        quoteStyle: 'single',
        semicolons: true,
      },
    }),
    viteReact(),
  ],
});
