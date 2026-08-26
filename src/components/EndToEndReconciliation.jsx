import { Equal, Plus } from 'lucide-react'
import { endToEndReconciliation } from '../data'

export default function EndToEndReconciliation() {
  const r = endToEndReconciliation

  return (
    <section className="panel">
      <h2 className="panel-title">End-to-End Reconciliation</h2>
      <div className="e2e-recon-row">
        <div className="e2e-recon-box">
          <div className="e2e-recon-label">Received</div>
          <div className="e2e-recon-value color-blue">{r.received}</div>
        </div>
        <Equal size={18} className="e2e-recon-op" />
        <div className="e2e-recon-box">
          <div className="e2e-recon-label">Posted</div>
          <div className="e2e-recon-value color-blue">{r.posted}</div>
        </div>
        <Plus size={16} className="e2e-recon-op" />
        <div className="e2e-recon-box">
          <div className="e2e-recon-label">In Process</div>
          <div className="e2e-recon-value color-blue">{r.inProcess}</div>
        </div>
        <Plus size={16} className="e2e-recon-op" />
        <div className="e2e-recon-box">
          <div className="e2e-recon-label">Rejected with Reason</div>
          <div className="e2e-recon-value color-blue">{r.rejected}</div>
        </div>
        <Plus size={16} className="e2e-recon-op" />
        <div className="e2e-recon-box">
          <div className="e2e-recon-label">Confirmed Duplicate</div>
          <div className="e2e-recon-value color-blue">{r.confirmedDuplicate}</div>
        </div>
      </div>

      <div className="e2e-recon-balance">
        <div className="e2e-recon-balance-label">{r.balancedLabel}</div>
        <div className="e2e-recon-balance-value color-green">{r.balancedPercent}</div>
      </div>
    </section>
  )
}
