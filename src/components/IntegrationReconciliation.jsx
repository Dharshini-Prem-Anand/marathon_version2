import { integrationReconciliation, integrationActions } from '../data'

export default function IntegrationReconciliation() {
  const d = integrationReconciliation

  return (
    <section className="panel integration-reconciliation">
      <h2 className="panel-title">Integration &amp; Reconciliation</h2>

      <div className="connection-row">
        {d.connections.map((c) => (
          <div className="connection-badge" key={c.label}>
            <span>{c.label}</span>
            <span className="connection-status">
              <span className="connection-dot" />
              {c.status}
            </span>
          </div>
        ))}
      </div>

      <div className="integration-details-grid">
        {d.details.map((item) => (
          <div className="integration-detail-item" key={item.label}>
            <div className="integration-detail-label">{item.label}</div>
            <div className="integration-detail-value cell-ellipsis" title={item.value}>
              {item.value}
            </div>
          </div>
        ))}
        <div className="integration-detail-item">
          <div className="integration-detail-label">Reconciliation status</div>
          <div>
            <span className="badge badge-green">{d.reconciliationStatus}</span>
          </div>
        </div>
      </div>

      <div className="integration-actions">
        {integrationActions.map((a) => (
          <button key={a.label} className={a.variant === 'outline-red' ? 'btn-outline btn-outline-red' : 'btn-outline'}>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  )
}
