import { valueDeliveredBreakdown } from '../data'

export default function ValueDeliveredBreakdown() {
  return (
    <section className="panel">
      <h2 className="panel-title">Value Delivered</h2>
      <div className="value-breakdown-list">
        {valueDeliveredBreakdown.items.map((item) => (
          <div className="value-breakdown-row" key={item.label}>
            <span>{item.label}</span>
            <span className={`color-${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="value-breakdown-net">
        <span>{valueDeliveredBreakdown.netLabel}</span>
        <span className="color-blue">{valueDeliveredBreakdown.netValue}</span>
      </div>
    </section>
  )
}
