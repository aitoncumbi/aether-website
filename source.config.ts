import { defineConfig } from 'fumadocs-mdx/config';
import { aetherDark, aetherLight } from './lib/code-theme';

// Global MDX options; the docs collection itself is defined with the macro in lib/source.ts.
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: aetherLight, dark: aetherDark },
      defaultColor: false,
    },
  },
});
