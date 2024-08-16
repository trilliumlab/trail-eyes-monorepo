import type { Config } from 'tailwindcss';
import baseConfig from '@repo/ui/tailwind.config';

export default {
  ...baseConfig,
  content: [...baseConfig.content, '../../packages/ui/**/*.{ts,tsx}'],
} satisfies Config;
