import { defineConfig, devices } from '@playwright/test';

import { CLIENT_URL } from './support/env';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  timeout: 60_000,

  expect: {
    timeout: 15_000,
  },

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: CLIENT_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    actionTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm --filter @repo/client dev',
    url: CLIENT_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      E2E: '1',
    },
  },
});
