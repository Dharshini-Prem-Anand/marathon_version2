import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'app.db')

export const db = new DatabaseSync(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`)

export function isSeeded() {
  const row = db.prepare('SELECT COUNT(*) AS count FROM store').get()
  return row.count > 0
}

export function setAll(entries) {
  const insert = db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)')
  db.exec('BEGIN')
  try {
    for (const [key, value] of Object.entries(entries)) {
      insert.run(key, JSON.stringify(value))
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

export function getAll() {
  const rows = db.prepare('SELECT key, value FROM store').all()
  const result = {}
  for (const row of rows) {
    result[row.key] = JSON.parse(row.value)
  }
  return result
}

export function getOne(key) {
  const row = db.prepare('SELECT value FROM store WHERE key = ?').get(key)
  return row ? JSON.parse(row.value) : undefined
}
