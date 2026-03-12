import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Use explicit IPv4 loopback to match uvicorn binding (127.0.0.1)
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
