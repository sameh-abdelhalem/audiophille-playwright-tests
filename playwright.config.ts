import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    baseURL: "https://sameh-abdelhalem.github.io/",
  },
  timeout: 60 * 1000,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // --- Responsive (mobile/tablet) layer ---
    {
      name: "mobile-chromium-pixel7",
      testMatch: "responsive.spec.ts",
      use: {
        ...devices["Pixel 7"],
      },
      metadata: { formFactor: "mobile", device: "pixel7" },
    },
    {
      name: "mobile-webkit-iphone14",
      testMatch: "responsive.spec.ts",
      use: {
        ...devices["iPhone 14"],
      },
      metadata: { formFactor: "mobile", device: "iphone14" },
    },
    {
      name: "tablet-chromium-ipad",
      testMatch: "responsive.spec.ts",
      use: {
        ...devices["iPad Air"],
      },
      metadata: { formFactor: "tablet", device: "ipad-air" },
    },
  ],
});
