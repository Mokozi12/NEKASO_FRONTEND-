const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  retries: 0,
  use: {
    baseURL: 'http://localhost:5175',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 5000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
