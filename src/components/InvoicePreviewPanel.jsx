import { Globe } from 'lucide-react'
import { invoicePreview, extractedFields } from '../data'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

export default function InvoicePreviewPanel() {
  const inv = invoicePreview

  return (
    <section className="panel invoice-preview">
      <h2 className="panel-title">Invoice Preview &amp; Extracted Fields</h2>
      <div className="invoice-preview-grid">
        <div className="invoice-mock">
          <div className="invoice-mock-header">
            <div className="invoice-mock-brand">
              <Globe size={20} />
              <span>{inv.vendorName}</span>
            </div>
            <div className="invoice-mock-heading">INVOICE</div>
          </div>

          <div className="invoice-mock-meta">
            <div>
              <span className="invoice-mock-label">Invoice Number:</span> {inv.invoiceNumber}
            </div>
            <div>
              <span className="invoice-mock-label">Invoice Date:</span> {inv.invoiceDate}
            </div>
          </div>

          <div className="invoice-mock-parties">
            <div>
              <div className="invoice-mock-label">Bill To:</div>
              <div className="invoice-mock-party-name">{inv.billTo.name}</div>
              {inv.billTo.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            <div>
              <div className="invoice-mock-label">Vendor:</div>
              <div className="invoice-mock-party-name">{inv.vendor.name}</div>
              {inv.vendor.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>

          <table className="invoice-mock-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.lineItems.map((li) => (
                <tr key={li.description}>
                  <td>{li.description}</td>
                  <td>{li.qty}</td>
                  <td>{li.unitPrice}</td>
                  <td>{li.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-mock-totals">
            <div>
              <span>Subtotal</span>
              <span>{inv.subtotal}</span>
            </div>
            <div>
              <span>Tax ({inv.taxRate})</span>
              <span>{inv.tax}</span>
            </div>
            <div className="invoice-mock-total-final">
              <span>Total (USD)</span>
              <span>{inv.total}</span>
            </div>
          </div>
        </div>

        <div className="extracted-fields">
          <table className="table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '42%' }} />
              <col style={{ width: '28%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Field</th>
                <th>Extracted Value</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {extractedFields.map((f) => (
                <tr key={f.field}>
                  <td className="cell-ellipsis">{f.field}</td>
                  <td className="cell-ellipsis" title={f.value}>
                    {f.value}
                  </td>
                  <td>
                    <span className={`confidence-badge confidence-${confidenceClass(f.confidence)}`}>
                      {f.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn-primary btn-block">Accept High Confidence</button>
          <button className="btn-outline btn-block">Correct Field</button>
          <button className="btn-outline btn-block btn-outline-red">Route to Review</button>
        </div>
      </div>
    </section>
  )
}
