import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const ODATA_HOST =
  'https://poc-mc10-org-ai-marathoninvoiceautomation-srv.cfapps.us10-001.hana.ondemand.com'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pdfHost = env.VITE_PDF_SERVICE_BASE_URL

  return {
    plugins: [react()],
    server: {
      // Proxy both backends so the browser makes same-origin calls in dev.
      proxy: {
        '/odata': {
          target: ODATA_HOST,
          changeOrigin: true,
          secure: true,
        },
        // Only registered once VITE_PDF_SERVICE_BASE_URL is set.
        ...(pdfHost
          ? {
              '/pdf-api': {
                target: pdfHost,
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/pdf-api/, ''),
              },
            }
          : {}),
      },
    },
  }
})

