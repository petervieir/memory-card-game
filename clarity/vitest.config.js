import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Use node environment instead of clarinet
    setupFiles: ["./tests/helpers/test-utils.ts"],
    coverage: {
      enabled: false,
      reporter: ["text"],
      reportsDirectory: "./coverage",
    },
  },
});
