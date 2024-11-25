import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e/playwright',
  use: {
    baseURL: 'http://localhost:4173', // Adjust this URL to your development server
    headless: false, // Run tests in headless mode by default
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry', // Record trace on first retry
    video: 'on-first-retry', // Record video on first retry
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    // {
    //   name: 'firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'webkit',
    //   use: { browserName: 'webkit' },
    // },
  ],
});
