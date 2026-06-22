import { defineConfig } from "vitest/config";

// Load .env.local so integration tests get DATABASE_URL (no-op if the file is absent).
try {
  (process as { loadEnvFile?: (p: string) => void }).loadEnvFile?.(".env.local");
} catch {
  /* .env.local not present — unit tests don't need it */
}

export default defineConfig({
  // Stub Next's `server-only` / `client-only` markers so server modules import in node tests.
  resolve: { alias: { "server-only": "/dev/null", "client-only": "/dev/null" } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
  },
});
