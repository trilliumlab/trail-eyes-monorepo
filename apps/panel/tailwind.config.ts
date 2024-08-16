import baseConfig from '@repo/ui/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
  ...baseConfig,
  content: [...baseConfig.content, '../../packages/ui/**/*.{ts,tsx}'],
} satisfies Config;
