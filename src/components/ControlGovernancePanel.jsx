import { controlGovernance } from '../data'

export default function ControlGovernancePanel() {
  return (
    <section className="panel">
      <h2 className="panel-title">Control and Governance</h2>
      <div className="control-governance-list">
        {controlGovernance.map((item) => (
          <div className="control-governance-row" key={item.label}>
            <span>{item.label}</span>
            <span className={`control-governance-value color-${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
