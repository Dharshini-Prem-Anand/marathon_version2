import { Globe } from 'lucide-react'
import { preValidationInvoice } from '../data'
import PreValidationPipelineStepper from './PreValidationPipelineStepper'

export default function InvoicePreviewValidation({ onNavigate }) {
  const inv = preValidationInvoice

  return (
    <section className="panel pv-preview">
      <div className="panel-title-row">
        <h2 className="panel-title">Selected Invoice Preview</h2>
        <span className="badge badge-green">{inv.confidenceBadge}</span>
      </div>

      <div className="pv-invoice-brand">
        <Globe size={22} className="color-blue" />
        <span>{inv.vendorName}</span>
      </div>

      <div className="pv-field-list">
        <div className="pv-field-row">
          <span className="pv-field-label">Invoice No:</span>
          <span className="pv-field-box">{inv.invoiceNumber}</span>
        </div>
        <div className="pv-field-row">
          <span className="pv-field-label">Invoice Date:</span>
          <span className="pv-field-box">{inv.invoiceDate}</span>
        </div>
        <div className="pv-field-row">
          <span className="pv-field-label">PO Number:</span>
          <span className="pv-field-box">{inv.poNumber}</span>
        </div>
        <div className="pv-field-row">
          <span className="pv-field-label">Gross Amount:</span>
          <span className="pv-field-box">{inv.grossAmount}</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="pv-line-items table-fixed">
          <colgroup>
            <col style={{ width: '6%' }} />
            <col style={{ width: '34%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th>UOM</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.lineItems.map((li) => (
              <tr key={li.line}>
                <td>{li.line}</td>
                <td className="cell-ellipsis" title={li.description}>
                  {li.description}
                </td>
                <td>{li.quantity}</td>
                <td>{li.uom}</td>
                <td>{li.unitPrice}</td>
                <td>{li.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pv-total-row">
        <span className="pv-field-label">Total Amount Due:</span>
        <span className="pv-field-box pv-total-box">{inv.totalAmountDue}</span>
      </div>

      <h3 className="preview-subheading">Processing Pipeline</h3>
      <PreValidationPipelineStepper onNavigate={onNavigate} />
    </section>
  )
}
