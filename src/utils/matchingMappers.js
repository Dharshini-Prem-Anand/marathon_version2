// Builds the PO & Line Matching view model from three flat entity sets.
//
// MATCHING IS NOT DECIDED HERE. The pipeline runs the three-way match and
// writes the outcome to Invoices.VerificationStatus; a line is Matched when
// that says Success and Mismatch when it doesn't, full stop. The joins below
// exist only to SHOW what was matched against — the PO line and amount, the
// goods-receipt total and the variance — never to decide the status.
//
// Invoices is line-level (one row per InvoiceNumber+FiscalYear+ItemNumber), so
// the queue groups it. The CAP associations to PurchaseOrders / GoodsReceipts
// return null, so the joins are done here:
//
//   invoice line -> PO line : PurchaseOrder + ItemNumber = PurchaseOrder + PurchaseOrderItem
//   invoice line -> receipts: PurchaseOrder + ItemNumber = PONumber + Orderitem_number  (SUMMED —
//                             a line can have several partial goods receipts)

import { vendorLabel } from './vendorNames.js'

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

// Item numbers arrive in three different paddings for the same line: the
// extracted invoice says "1", the PO line says "00001" and the goods receipt
// says "0001". Compare them by value or nothing matches — that's what made a
// whole day's invoices read "Not Found" while the backend had matched them.
const lineNo = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const unpadded = text.replace(/^0+/, '')
  return unpadded === '' ? '0' : unpadded
}

const lineKey = (order, item) => `${String(order ?? '').trim()}::${lineNo(item)}`

export const money = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num(value))

// Unit price isn't on the invoice — derive it from amount / quantity.
const unitPrice = (amount, quantity, currency = 'USD') => {
  const q = num(quantity)
  if (q === 0) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num(amount) / q)
}

const isVerified = (status) => String(status ?? '').trim().toLowerCase() === 'success'

function invoiceKey(row) {
  return `${row.InvoiceNumber}/${row.FiscalYear}`
}

// Newest invoice first. CreationDate is the only reliably-populated date on
// Invoices (PostingDate is usually null).
const creationTime = (lines) => {
  const t = new Date(lines[0]?.CreationDate ?? 0).getTime()
  return Number.isNaN(t) ? 0 : t
}

function sortGroupedByCreationDateDesc(grouped) {
  return [...grouped.entries()].sort((a, b) => creationTime(b[1]) - creationTime(a[1]))
}

export function buildMatchingRecords(invoices, purchaseOrders, goodsReceipts, vendorNamesByInvoice = {}) {
  // PO lines by "PurchaseOrder::PurchaseOrderItem"
  const poByLine = new Map()
  for (const po of purchaseOrders) {
    poByLine.set(lineKey(po.PurchaseOrder, po.PurchaseOrderItem), po)
  }

  // Goods receipts summed per PO line — partial receipts are common.
  const grByLine = new Map()
  for (const gr of goodsReceipts) {
    const key = lineKey(gr.PONumber, gr.Orderitem_number)
    const acc = grByLine.get(key) ?? { amount: 0, quantity: 0, receipts: [] }
    acc.amount += num(gr.Amount)
    acc.quantity += num(gr.Quantity)
    acc.receipts.push(gr.GRNumber)
    grByLine.set(key, acc)
  }

  // Group invoice rows into invoices, preserving first-seen order.
  const grouped = new Map()
  for (const row of invoices) {
    const key = invoiceKey(row)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(row)
  }

  const ids = []
  const records = {}

  for (const [key, lines] of sortGroupedByCreationDateDesc(grouped)) {
    const head = lines[0]
    const currency = head.Currency || 'USD'
    const poNumber = head.PurchaseOrder

    let invTotal = 0
    let poTotal = 0
    let receivedTotal = 0
    let matchedCount = 0

    const matchLines = lines.map((line) => {
      const key = lineKey(line.PurchaseOrder, line.ItemNumber)
      const po = poByLine.get(key)
      const gr = grByLine.get(key)

      const invAmount = num(line.AmountInDocCurrency)
      const poAmount = po ? num(po.NetAmount) : null
      invTotal += invAmount
      if (po) poTotal += poAmount
      if (gr) receivedTotal += gr.amount

      const verified = isVerified(line.VerificationStatus)
      if (verified) matchedCount += 1

      // The backend's verdict, unmodified — a PO line the UI couldn't join to
      // changes what the row can display, not whether the line matched.
      const matchStatus = verified ? 'matched' : 'mismatch'

      return {
        invLine: line.ItemNumber,
        description: line.MaterialDescription || line.MaterialNumber || '—',
        qty: num(line.Quantity),
        unitPrice: unitPrice(invAmount, line.Quantity, currency),
        invAmount: money(invAmount, currency),
        proposedPoLine: po ? po.PurchaseOrderItem : '—',
        poAmount: po ? money(poAmount, currency) : '—',
        variance: po ? money(invAmount - poAmount, currency) : '—',
        matchStatus,
      }
    })

    // Invoice-level status rolls up its lines' verification: every line
    // matched, none of them, or some of each.
    let status
    if (matchedCount === lines.length) status = 'Matched'
    else if (matchedCount === 0) status = 'Mismatch'
    else status = 'Partial Mismatch'

    const variance = invTotal - poTotal

    ids.push(key)
    records[key] = {
      invoiceNumber: head.InvoiceNumber,
      fiscalYear: head.FiscalYear,
      poNumber,
      context: {
        vendor: vendorLabel(vendorNamesByInvoice, head.InvoiceNumber, head.VendorNO),
        vendorCode: head.VendorNO,
        // Invoices carries no channel; these all arrive via the email pipeline.
        channel: 'Email',
        status,
      },
      summaryCards: [
        { icon: 'clipboard', label: 'SAP PO', value: money(poTotal, currency), valueColor: null },
        { icon: 'truck', label: 'Received', value: money(receivedTotal, currency), valueColor: null },
        { icon: 'fileText', label: 'Invoice', value: money(invTotal, currency), valueColor: null },
        {
          icon: 'scale',
          label: 'Variance',
          value: money(variance, currency),
          valueColor: Math.abs(variance) < 0.005 ? 'green' : 'red',
        },
      ],
      matchLines,
      // HeaderAmount is null on most invoices, so the queue amount is the
      // sum of the line amounts.
      amount: money(invTotal, currency),
      // Raw, unformatted business date.
      creationDate: head.CreationDate ?? null,
      // When the pipeline wrote the invoice (managed aspect) — what the Date
      // Range filter reads, so an older invoice ingested today counts as today.
      createdAt: head.createdAt ?? null,
    }
  }

  return { ids, records }
}

// Counts for the stats tiles that the data can actually support. PO Not Found
// isn't one of them any more — nothing on the invoice says a PO is missing, so
// that tile comes from /matchingkpis alone.
export function matchingStatCounts(ids, records) {
  const statuses = ids.map((id) => records[id].context.status)
  return {
    total: ids.length,
    matched: statuses.filter((s) => s === 'Matched').length,
    partial: statuses.filter((s) => s === 'Partial Mismatch').length,
    mismatch: statuses.filter((s) => s === 'Mismatch').length,
  }
}
