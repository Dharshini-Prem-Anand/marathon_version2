import { fileURLToPath } from 'node:url'
import * as seedData from './seedData.js'
import { setAll } from './db.js'

export function seed() {
  setAll(seedData)
  console.log(`Seeded SQLite store with ${Object.keys(seedData).length} keys.`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seed()
}
