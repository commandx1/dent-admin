import path from "path"
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
  base: '/', // Update this if deploying to a subdirectory, e.g., '/admin/'
  server: {
    proxy: {
      '/api/google-maps': {
        target: 'https://maps.googleapis.com/maps/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-maps/, ''),
      },
      '/api/dentypro': {
        target: 'http://qa-92rf.dentypro.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/dentypro/, ''),
      },
      '/api/import-xlsx': {
        target: 'http://51.20.96.242:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/import-xlsx/, '/api/user-products/import-xlsx'),
      },
    },
  },
})
