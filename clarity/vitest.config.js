import { defineConfig } from "vitest/config";

export default defineConfig({
  // Some versions of vitest-environment-clarinet expect this at the top-level
  coverageFilename: "coverage-final.json",
  test: {
    globals: true,
    environment: "clarinet",
    setupFiles: ["./tests/helpers/test-utils.ts"],
    environmentOptions: {
      coverageFilename: "coverage-final.json",
    },
    coverage: {
      enabled: false,
      reporter: ["text"],
      reportsDirectory: "./coverage",
    },
  },
});
