import { FileText } from 'lucide-react'
import { invoiceContext } from '../data'

export default function InvoiceContextPanel() {
  const c = invoiceContext

  return (
    <section className="panel invoice-context-panel">
      <div className="panel-title-row">
        <h2 className="panel-title">
          <FileText size={16} className="panel-title-icon" />
          Invoice Context
        </h2>
        <div className="marathon-logo">
          <span className="marathon-mark">M</span>
          <span className="marathon-word">marathon</span>
        </div>
      </div>

      <div className="invoice-context-list">
        <div className="invoice-context-row">
          <span>Vendor</span>
          <span>{c.vendor}</span>
        </div>
        <div className="invoice-context-row">
          <span>Invoice</span>
          <span className="cell-mono">{c.invoice}</span>
        </div>
        <div className="invoice-context-row">
          <span>PO</span>
          <span className="cell-mono">{c.po}</span>
        </div>
        <div className="invoice-context-row">
          <span>Amount</span>
          <span>{c.amount}</span>
        </div>
        <div className="invoice-context-row">
          <span>Due</span>
          <span>{c.due}</span>
        </div>
        <div className="invoice-context-row">
          <span>Exception</span>
          <span>{c.exception}</span>
        </div>
        <div className="invoice-context-row">
          <span>Payment risk</span>
          <span className="badge badge-red">{c.paymentRisk}</span>
        </div>
      </div>
    </section>
  )
}
