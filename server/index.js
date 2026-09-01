import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { isSeeded, getAll, getOne } from './db.js'
import { seed } from './seed.js'

if (!isSeeded()) {
  seed()
}

const app = express()
const port = process.env.PORT || 3001
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/data', (req, res) => {
  res.json(getAll())
})

app.get('/api/data/:key', (req, res) => {
  const value = getOne(req.params.key)
  if (value === undefined) {
    res.status(404).json({ error: `Unknown key: ${req.params.key}` })
    return
  }
  res.json(value)
})

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
