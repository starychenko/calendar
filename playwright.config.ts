import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:19118",
    locale: "uk-UA",
    timezoneId: "Europe/Kyiv",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer:
    process.env.CALENDAR_E2E_EXTERNAL === "1"
      ? undefined
      : {
          command: "node scripts/start-production.mjs",
          url: "http://127.0.0.1:19118",
          env: {
            PORT: "19118",
            HOSTNAME: "127.0.0.1",
            NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:19118",
          },
          reuseExistingServer: false,
          timeout: 60_000,
        },
});
