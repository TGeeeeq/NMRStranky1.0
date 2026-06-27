import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    // Point SMTP at a dead address so e2e order placement never sends real mail
    // (the order action catches the send failure and still saves the order).
    env: { ...process.env, SMTP_HOST: "localhost", SMTP_PORT: "2" },
  },
});
