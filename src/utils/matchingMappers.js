// Builds the PO & Line Matching view model from three flat entity sets.
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
    poByLine.set(`${po.PurchaseOrder}::${po.PurchaseOrderItem}`, po)
  }

  // Goods receipts summed per PO line — partial receipts are common.
  const grByLine = new Map()
  for (const gr of goodsReceipts) {
    const key = `${gr.PONumber}::${gr.Orderitem_number}`
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
    let poFoundCount = 0

    const matchLines = lines.map((line) => {
      const lineKey = `${line.PurchaseOrder}::${line.ItemNumber}`
      const po = poByLine.get(lineKey)
      const gr = grByLine.get(lineKey)

      const invAmount = num(line.AmountInDocCurrency)
      const poAmount = po ? num(po.NetAmount) : null
      invTotal += invAmount
      if (po) {
        poTotal += poAmount
        poFoundCount += 1
      }
      if (gr) receivedTotal += gr.amount

      const verified = isVerified(line.VerificationStatus)
      if (verified) matchedCount += 1

      // No PO line to compare against outranks the verification flag.
      const matchStatus = !po ? 'notfound' : verified ? 'matched' : 'mismatch'

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

    // Invoice-level status rolls up its lines.
    let status
    if (poFoundCount === 0) status = 'Not Found'
    else if (matchedCount === lines.length) status = 'Matched'
    else if (matchedCount > 0) status = 'Partial Match'
    else status = 'Mismatch'

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
      // Raw, unformatted — what the Date Range filter reads.
      creationDate: head.CreationDate ?? null,
    }
  }

  return { ids, records }
}

// Counts for the stats tiles that the data can actually support.
export function matchingStatCounts(ids, records) {
  const statuses = ids.map((id) => records[id].context.status)
  return {
    total: ids.length,
    matched: statuses.filter((s) => s === 'Matched').length,
    partial: statuses.filter((s) => s === 'Partial Match').length,
    notFound: statuses.filter((s) => s === 'Not Found').length,
  }
}
