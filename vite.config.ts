import type { Plugin } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import launchConfig from './launch.config.mjs';

/**
 * index.html is static HTML and can't import launch.config.mjs at runtime,
 * so its launch-day values are written in as __TOKEN__ placeholders and
 * swapped for the real values here, at build time.
 *
 * The trait count is deliberately NOT one of them any more. The OG and meta
 * copy used to quote it; it doesn't now, because a number that changes every
 * time the library changes is a poor thing to bake into a share card that
 * gets cached and re-shared. scripts/check-copy-count.mjs enforces that it
 * stays out.
 */
function injectLaunchValues(): Plugin {
  return {
    name: 'inject-launch-values',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', launchConfig.siteUrl);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectLaunchValues()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    // e2e/ is the Playwright suite (npm run test:e2e), not vitest's.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
