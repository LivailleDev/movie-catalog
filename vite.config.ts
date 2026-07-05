/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5175 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Force demo mode so the API layer is tested offline against sample data —
    // deterministic, and never hits the real TMDB API (or needs a key in CI).
    env: { VITE_TMDB_KEY: '' },
  },
});
