import { kpiValueOutputs } from '../data'

export default function ValueOutputsPanel() {
  return (
    <section className="panel">
      <h2 className="panel-title">Value Outputs (Annualized)</h2>
      <div className="value-breakdown-list">
        {kpiValueOutputs.items.map((item) => (
          <div className="value-breakdown-row" key={item.label}>
            <span>{item.label}</span>
            <span className="color-blue">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="value-breakdown-net kpi-net-value-row">
        <span>{kpiValueOutputs.netLabel}</span>
        <span className="color-blue">{kpiValueOutputs.netValue}</span>
      </div>
    </section>
  )
}
