import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'

function legacySyncRedirectPlugin(): Plugin {
  return {
    name: 'legacy-sync-redirect',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0] ?? ''
        if (
          path === '/sync' ||
          path === '/sync/' ||
          path === '/sync-app' ||
          path === '/sync-app/'
        ) {
          res.statusCode = 302
          res.setHeader('Location', '/website-builder/')
          res.end()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), legacySyncRedirectPlugin()],
  // Served under /website-builder so the public route is distinct from /sync.
  base: '/website-builder/',
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
