import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Mount under the portfolio origin at /sync-app/ (dev proxy + prod Caddy).
  base: '/sync-app/',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    proxy: {
      '/cms-api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
})
