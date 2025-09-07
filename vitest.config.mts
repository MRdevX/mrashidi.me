import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: true,
    include: ["tests/unit/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules/", "tests/e2e/", "**/*.d.ts", "**/*.config.*", "**/coverage/**", ".next/", "dist/", "build/"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "**/*.d.ts", "**/*.config.*", "**/coverage/**", ".next/", "dist/", "build/"],
    },
  },
});
