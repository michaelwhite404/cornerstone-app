import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/pdf': { target: 'http://localhost:8080', changeOrigin: true },
      '/csv': { target: 'http://localhost:8080', changeOrigin: true },
      '/images': { target: 'http://localhost:8080', changeOrigin: true },
      '/graphql': { target: 'http://localhost:8080', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:8080', changeOrigin: true, ws: true },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
