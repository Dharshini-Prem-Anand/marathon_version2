// Deployed entry point: serves the built React bundle and proxies the OData
// calls through the BTP destination so no credential reaches the browser.
//
// Run locally with `npm run dev` instead — Vite's proxy covers dev, and there
// is no destination service bound outside Cloud Foundry.

import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { resolveDestination } from './destination.js'

const app = express()
const port = process.env.PORT || 3001
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')

const DESTINATION_NAME = process.env.CAP_DESTINATION_NAME || 'MarathonInvoiceAutomation-srv-api'
// Path the frontend calls, and the path appended to the destination URL.
const ODATA_BASE_PATH = process.env.CAP_ODATA_BASE_PATH || '/odata/v4/invoice-automation'

app.get('/health', (req, res) => {
  res.json({ status: 'ok', destination: DESTINATION_NAME })
})

// Reports what the destination resolved to, without leaking the token.
app.get('/health/destination', async (req, res) => {
  try {
    const dest = await resolveDestination(DESTINATION_NAME)
    res.json({
      name: DESTINATION_NAME,
      url: dest.url,
      authentication: dest.authentication ?? 'unknown',
      sendsAuthHeader: Object.keys(dest.headers).length > 0,
    })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.use(ODATA_BASE_PATH, async (req, res) => {
  try {
    const dest = await resolveDestination(DESTINATION_NAME)

    // The destination may point at the service root or already include the
    // OData base path — only add it when it isn't there already.
    const prefix = dest.url.endsWith(ODATA_BASE_PATH) ? '' : ODATA_BASE_PATH
    const target = `${dest.url}${prefix}${req.url}`

    const upstream = await fetch(target, {
      method: req.method,
      headers: { Accept: 'application/json', ...dest.headers },
    })

    res.status(upstream.status)
    const contentType = upstream.headers.get('content-type')
    if (contentType) res.set('Content-Type', contentType)
    res.send(Buffer.from(await upstream.arrayBuffer()))
  } catch (err) {
    console.error(`[odata-proxy] ${req.method} ${req.url} failed:`, err.message)
    res.status(502).json({ error: { message: err.message, code: '502' } })
  }
})

app.use(express.static(distDir))

// Single-page app: anything unmatched falls back to index.html.
app.use((req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(port, () => {
  console.log(`UI + OData proxy listening on ${port}`)
  console.log(`  destination: ${DESTINATION_NAME}`)
  console.log(`  odata path:  ${ODATA_BASE_PATH}`)
})
