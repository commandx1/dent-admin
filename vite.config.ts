import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
      '/api': {
        target: 'http://51.21.198.138:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
