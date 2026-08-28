import PlainStatsRow from '../components/PlainStatsRow'
import EndToEndReconciliation from '../components/EndToEndReconciliation'
import AuditTrailTable from '../components/AuditTrailTable'
import ControlGovernancePanel from '../components/ControlGovernancePanel'
import WorkAssignmentCapacityPanel from '../components/WorkAssignmentCapacityPanel'
import { auditPersonaSelector, auditStats, auditFooterActions } from '../data'

export default function AuditReconciliation() {
  return (
    <>
      <div className="page-persona-row">
        <label>{auditPersonaSelector.label}</label>
        <select defaultValue={auditPersonaSelector.value} onChange={() => {}}>
          {auditPersonaSelector.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <PlainStatsRow stats={auditStats} />

      <div className="audit-main-grid">
        <div className="audit-main-col">
          <EndToEndReconciliation />
          <AuditTrailTable />
          <div className="audit-footer-actions">
            {auditFooterActions.map((a) => (
              <button key={a.label} className="btn-outline btn-block">
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="audit-side-col">
          <ControlGovernancePanel />
          <WorkAssignmentCapacityPanel />
        </div>
      </div>
    </>
  )
}
