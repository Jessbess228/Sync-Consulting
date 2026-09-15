import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Serve the app under /sync on the site origin.
  base: '/sync/',
  server: {
    host: '127.0.0.1',
    allowedHosts: ['jessicaberry.info'],
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
