/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // src/src is an accidental duplicate archive, not the source of record.
    exclude: ['**/node_modules/**', '**/dist/**', 'src/src/**'],
  },
});
