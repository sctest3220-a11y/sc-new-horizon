import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Component tests only. Logic modules are tested with `node --test` in
// scripts/ (see docs/TESTING.md). This config deliberately does not load
// vite.config.ts: the Vinext and Cloudflare plugins build the app, not tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['app/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
  },
});
