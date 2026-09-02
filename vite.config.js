import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix: loads unprefixed vars too. Anything without a VITE_ prefix is
  // build-time only and never inlined into the client bundle.
  const env = loadEnv(mode, process.cwd(), '')
  const odataHost = env.CAP_SERVICE_URL
  // Same default as src/api/config.js — keeps the dev proxy working even
  // when VITE_PDF_SERVICE_BASE_URL isn't set in .env.local.
  const pdfHost =
    env.VITE_PDF_SERVICE_BASE_URL ||
    'https://poc-mc10-org-ai-marathoninvoiceautomation-pysrv.cfapps.us10-001.hana.ondemand.com'

  return {
    plugins: [react()],
    server: {
      // Proxy both backends so the browser makes same-origin calls in dev.
      proxy: {
        // Dev only — deployed, the Node server module proxies this through
        // the BTP destination instead.
        ...(odataHost
          ? {
              '/odata': {
                target: odataHost,
                changeOrigin: true,
                secure: true,
              },
            }
          : {}),
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

