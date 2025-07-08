import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { envOnlyMacros } from 'vite-env-only';
import { join } from 'node:path';

const config = {
  srcDirectory: 'src',
} as const;

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    envOnlyMacros(),
    // tailwindcss(), sentry(), ...
    tanstackStart({
      target: 'bun',
      tsr: {
        srcDirectory: config.srcDirectory,
        generatedRouteTree: join(config.srcDirectory, 'route-tree.gen.ts'),
        quoteStyle: 'single',
        semicolons: true,
        // customScaffolding: {
        //   routeTemplate: [
        //     '%%tsrImports%%\n\n',
        //     '%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n',
        //     'function RouteComponent() { return "Hello %%tsrPath%%!" }\n',
        //   ].join(''),
        //   apiTemplate: [
        //     'import { json } from "@tanstack/start";\n',
        //     '%%tsrImports%%\n\n',
        //     '%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:\'Hello "%%tsrPath%%"!\' }) }}%%tsrExportEnd%%\n',
        //   ].join(''),
        // },
      },
    }),
  ],
});
