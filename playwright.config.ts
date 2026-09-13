import { defineConfig, devices } from '@playwright/test';

/**
 * Full-flow browser suite. Runs against `wrangler pages dev` rather than the
 * Vite dev server, because the flows that matter most (Tweet -> /api/share ->
 * /p/<id>, the image API) live in the Pages Functions and only exist there.
 *
 * `npm run test:e2e`. The first run builds the site, which takes a minute.
 */
const PORT = 8790;

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: `npm run pages:dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}/traits-index.json`,
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
