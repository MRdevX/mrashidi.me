import path from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

const migrations = await readD1Migrations(path.join(import.meta.dirname, "migrations"));

export default defineConfig({
  plugins: [
    cloudflareTest({
      main: "./src/index.ts",
      // Tests inject a mock model; nothing may reach Workers AI.
      remoteBindings: false,
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        bindings: {
          CONTENT_API_TOKEN: "test-token",
          GH_API_TOKEN: "test-github-token",
          RESEND_API_TOKEN: "test-resend-token",
          TEST_MIGRATIONS: migrations,
        },
      },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
  },
});
