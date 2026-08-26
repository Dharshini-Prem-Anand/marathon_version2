import { valueCalculationInputs } from '../data'

export default function ValueCalculationInputs() {
  return (
    <section className="panel">
      <h2 className="panel-title">Value Calculation Inputs</h2>
      <div className="value-calc-inputs-list">
        {valueCalculationInputs.map((f) => (
          <div className="filter-field" key={f.label}>
            <label>{f.label}</label>
            <input type="text" defaultValue={f.value} readOnly />
          </div>
        ))}
      </div>
    </section>
  )
}
