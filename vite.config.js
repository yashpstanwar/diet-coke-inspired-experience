import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    preserveSymlinks: true
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext'
  }
});
