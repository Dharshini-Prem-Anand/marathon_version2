import { CheckCircle2, CircleDot, Circle } from 'lucide-react'
import { selectedInvoice } from '../data'

const statusConfig = {
  done: { icon: CheckCircle2, color: 'green' },
  inprogress: { icon: CircleDot, color: 'orange' },
  pending: { icon: Circle, color: 'muted' },
}

export default function SelectedInvoiceTimeline() {
  return (
    <section className="panel selected-invoice">
      <h2 className="panel-title">Selected Invoice</h2>
      <div className="selected-invoice-heading">
        <span className="cell-mono">{selectedInvoice.invoiceId}</span>
        <span className="selected-invoice-divider">|</span>
        <span>{selectedInvoice.vendor}</span>
        <span className="selected-invoice-divider">|</span>
        <span className="color-blue">{selectedInvoice.amount}</span>
      </div>

      <div className="invoice-timeline-list">
        {selectedInvoice.timeline.map((step) => {
          const cfg = statusConfig[step.status]
          const Icon = cfg.icon
          return (
            <div className={`invoice-timeline-row${step.status === 'inprogress' ? ' invoice-timeline-active' : ''}`} key={step.label}>
              <Icon size={17} className={`color-${cfg.color}`} />
              <span className="invoice-timeline-label">{step.label}</span>
              <span className="invoice-timeline-time">{step.time}</span>
              <span className={`invoice-timeline-note${step.badge ? ' color-orange' : ''}`}>
                {step.badge ?? step.note}
              </span>
            </div>
          )
        })}
      </div>

      <div className="invoice-timeline-legend">
        <span>
          <CheckCircle2 size={13} className="color-green" /> Completed (Automated)
        </span>
        <span>
          <CircleDot size={13} className="color-orange" /> In Progress (Human Step)
        </span>
        <span>
          <Circle size={13} className="color-muted" /> Pending
        </span>
      </div>
    </section>
  )
}
