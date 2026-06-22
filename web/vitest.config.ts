import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// Load .env.local so integration tests get DATABASE_URL (no-op if the file is absent).
try {
  (process as { loadEnvFile?: (p: string) => void }).loadEnvFile?.(".env.local");
} catch {
  /* .env.local not present — unit tests don't need it */
}

// Stub Next's `server-only` / `client-only` markers with a real empty module
// (absolute path) so server modules import cleanly under vitest's node env.
const emptyStub = resolve(process.cwd(), "tests/stubs/empty.ts");

export default defineConfig({
  resolve: {
    alias: [
      { find: /^server-only$/, replacement: emptyStub },
      { find: /^client-only$/, replacement: emptyStub },
    ],
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    // Integration tests use the app's Neon Pool singleton over a WebSocket. Running files
    // in parallel (concurrent load) or re-creating the pool per file (isolate) both make
    // the pooled connection flaky. One process, one shared pool, run sequentially.
    fileParallelism: false,
    isolate: false,
  },
});
