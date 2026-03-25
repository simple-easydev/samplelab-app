import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = env.VITE_SUPABASE_URL

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 3001,
      // Same-origin proxy so Edge Function calls work in the browser without CORS during local dev.
      // Production still requires the function to send CORS headers (see sampleDownload.ts).
      proxy: supabaseUrl
        ? {
            '/functions/v1': {
              target: supabaseUrl,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  }
})
