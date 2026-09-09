import { chromium } from 'playwright'
import fs from 'node:fs'

const RESULT_FILE = 'C:/Users/psaig/AppData/Local/Temp/claude/c--AP-invoice-automation/edb3af61-c874-45bc-9c77-8a59004bba83/scratchpad/rerun-results.json'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultTimeout(30000)

const consoleErrors = []
page.on('pageerror', (err) => consoleErrors.push(String(err)))

async function waitForQueueLoaded() {
  await page.waitForFunction(
    () => {
      const tbody = document.querySelector('section.document-queue tbody')
      return tbody && !tbody.textContent.includes('Loading documents')
    },
    { timeout: 30000 }
  )
}

await page.goto('http://localhost:5202', { waitUntil: 'networkidle' })
await page.locator('.sidebar-item span', { hasText: 'Document AI & Extraction' }).first().click()
await page.waitForSelector('text=Document Extraction Queue')
await waitForQueueLoaded()
await page.waitForTimeout(500)

const docSection = page.locator('section.document-queue')

const viewAllBtn = docSection.locator('.view-all-link')
if (await viewAllBtn.count()) {
  await viewAllBtn.click()
  await page.waitForTimeout(300)
}

// One numbered button per page (e.g. 1..8) — count those directly rather
// than parsing "1-5 of 37" (that's the total document count, not page count).
const pageCount = await docSection.locator('.table-pagination .pagination-page').count()
console.log('PAGE_COUNT:', pageCount)

// Identify every document as (fileName, receivedDate) — fileName alone isn't
// unique (several documents share a name), so pairing it with the Received
// Date column disambiguates rows a plain filename search can't tell apart.
const identities = []
for (let p = 0; p < pageCount; p++) {
  if (p > 0) {
    await docSection.locator('.table-pagination .pagination-page', { hasText: String(p + 1) }).click()
    await page.waitForTimeout(250)
  }
  const rows = docSection.locator('tbody tr')
  const rowCount = await rows.count()
  for (let r = 0; r < rowCount; r++) {
    const fileName = (await rows.nth(r).locator('td:nth-child(1) .cell-ellipsis').innerText()).trim()
    const receivedDate = (await rows.nth(r).locator('td:nth-child(2)').innerText()).trim()
    identities.push({ fileName, receivedDate })
  }
}

console.log('TOTAL_DOCUMENTS_FOUND:', identities.length)
console.log('IDENTITIES:', JSON.stringify(identities, null, 2))

// Multiple rows can share a filename — pick the one whose Received Date
// matches what we captured for this identity during the pre-mutation scan.
// Retries a few times with growing waits: an isolated repro of this exact
// sequence never reproduced a miss, so a failure here is most likely a rare
// render/search-debounce race rather than the row genuinely being gone.
async function findRow(fileName, receivedDate) {
  const searchInput = docSection.locator('input[placeholder]')
  for (const waitMs of [400, 1200, 2500]) {
    await searchInput.fill('')
    await searchInput.fill(fileName)
    await page.waitForTimeout(waitMs)

    const candidates = docSection.locator('tbody tr', { hasText: fileName })
    const candidateCount = await candidates.count()
    for (let c = 0; c < candidateCount; c++) {
      const rowDate = (await candidates.nth(c).locator('td:nth-child(2)').innerText()).trim()
      if (rowDate === receivedDate) return candidates.nth(c)
    }
  }
  return null
}

const results = []

for (const [i, { fileName, receivedDate }] of identities.entries()) {
  const label = `[${i + 1}/${identities.length}] ${fileName} (${receivedDate})`
  try {
    const target = await findRow(fileName, receivedDate)
    if (!target) {
      console.log(`${label} -> SKIPPED (row not found after search)`)
      results.push({ fileName, receivedDate, status: 'skipped', reason: 'row not found' })
      continue
    }

    await target.click()
    await page.waitForTimeout(400)

    const rerunBtn = page.locator('.rerun-btn')
    const isDisabled = await rerunBtn.isDisabled()
    if (isDisabled) {
      console.log(`${label} -> SKIPPED (no DIE job / rerun disabled)`)
      results.push({ fileName, receivedDate, status: 'skipped', reason: 'rerun disabled (no dieDocumentId)' })
      continue
    }

    await rerunBtn.click()
    // Wait for the button to leave "Re-running…" — that only means the
    // reprocessExtraction call resolved. It then triggers a refreshKey bump
    // that re-fetches the WHOLE document queue in the background (a
    // separate, slower network call) — searching for the next document
    // before that finishes finds a stale/loading table, so wait for it too.
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('.rerun-btn')
        return btn && !btn.textContent.includes('Re-running')
      },
      { timeout: 60000 }
    )
    await waitForQueueLoaded()
    await page.waitForTimeout(500)

    const errorEl = page.locator('.rerun-error')
    if (await errorEl.count()) {
      const errText = await errorEl.innerText()
      console.log(`${label} -> FAILED (${errText})`)
      results.push({ fileName, receivedDate, status: 'failed', reason: errText })
    } else {
      console.log(`${label} -> OK`)
      results.push({ fileName, receivedDate, status: 'ok' })
    }
  } catch (err) {
    console.log(`${label} -> ERROR (${err.message})`)
    results.push({ fileName, receivedDate, status: 'error', reason: err.message })
  }
}

fs.writeFileSync(RESULT_FILE, JSON.stringify(results, null, 2))

const okCount = results.filter((r) => r.status === 'ok').length
const failCount = results.filter((r) => r.status === 'failed' || r.status === 'error').length
const skipCount = results.filter((r) => r.status === 'skipped').length
console.log('\n=== SUMMARY ===')
console.log('OK:', okCount, 'FAILED:', failCount, 'SKIPPED:', skipCount, 'TOTAL:', results.length)
console.log('CONSOLE_PAGE_ERRORS:', JSON.stringify(consoleErrors))

await browser.close()
