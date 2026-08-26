import { measurementGovernance } from '../data'

export default function MeasurementGovernancePanel() {
  return (
    <section className="panel">
      <h2 className="panel-title">Measurement Governance</h2>
      <div className="control-governance-list">
        {measurementGovernance.map((item) => (
          <div className="control-governance-row" key={item.label}>
            <span>{item.label}</span>
            <span className={item.link ? 'btn-link measure-gov-link' : 'color-blue measure-gov-value'}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
