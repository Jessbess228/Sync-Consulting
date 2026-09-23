import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Served under /sync-app so the portfolio can own /sync/ and show its Nav.
  base: '/sync-app/',
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
    // Old bookmarks and a stale Website proxy hit /sync on this server.
    // The app only lives under /sync-app/; send those requests there.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0] ?? ''
        if (path === '/sync' || path === '/sync/') {
          res.statusCode = 302
          res.setHeader('Location', '/sync-app/')
          res.end()
          return
        }
        next()
      })
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
})
