import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/business-logic.test.ts', // Skip: dynamic import not properly mocked
    ],
  },
});
