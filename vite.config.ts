import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import launchConfig from './launch.config.mjs';

/**
 * index.html is static HTML and can't import launch.config.mjs or
 * public/traits-manifest.json at runtime, so its handful of launch-day
 * values (site URL, trait count) are written in as __TOKEN__ placeholders
 * and swapped for the real values here, at build time. This is what keeps
 * index.html from being a fifth place the trait count could drift - see
 * scripts/check-copy-count.mjs, which verifies the swap actually happened.
 */
function injectLaunchValues(): Plugin {
  return {
    name: 'inject-launch-values',
    transformIndexHtml(html) {
      const manifest = JSON.parse(
        readFileSync(path.resolve(__dirname, 'public/traits-manifest.json'), 'utf8')
      );
      return html
        .replaceAll('__SITE_URL__', launchConfig.siteUrl)
        .replaceAll('__TRAIT_COUNT__', String(manifest.traits.length));
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
  }
});
