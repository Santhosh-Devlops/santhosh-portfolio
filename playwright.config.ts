import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3100);
// Set BASE_URL to test a deployed site instead, e.g. BASE_URL=https://santhosh-kumar-k-portfolio.onrender.com
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL || `http://localhost:${PORT}`,
    // Uses the Microsoft Edge already installed on Windows; set PW_CHANNEL=chromium after `npx playwright install`.
    channel: process.env.PW_CHANNEL || "msedge",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.PW_CHANNEL || "msedge" } },
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
