import { defineConfig, devices } from '@playwright/test';

// QA e2e de MaicoFit. Corre: `npm run test:e2e`.
// Levanta el dev server en :3006 (o reusa el que ya esté corriendo).
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3006';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    // Viewport/UA/touch de iPhone 13 sobre motor Chromium: la emulación mobile
    // es estable con el video continuo del hero (WebKit se cuelga esperando la red).
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npx next dev -p 3006',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
