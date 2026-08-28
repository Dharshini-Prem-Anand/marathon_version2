import { measureConfiguration, measureCategoryOptions, measureOwnerOptions } from '../data'

export default function MeasureConfiguration() {
  const c = measureConfiguration

  return (
    <section className="panel measure-config">
      <div className="panel-title-row">
        <h2 className="panel-title">Measure Configuration</h2>
        <button className="btn-primary btn-sm">Save Changes</button>
      </div>

      <div className="measure-config-row-3">
        <div className="filter-field">
          <label>Measure Name</label>
          <input type="text" defaultValue={c.measureName} readOnly />
        </div>
        <div className="filter-field">
          <label>Category</label>
          <select defaultValue={c.category} onChange={() => {}}>
            {measureCategoryOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label>Business Owner</label>
          <select defaultValue={c.businessOwner} onChange={() => {}}>
            {measureOwnerOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="measure-config-row-3">
        <div className="filter-field">
          <label>Baseline</label>
          <input type="text" defaultValue={c.baseline} readOnly />
        </div>
        <div className="filter-field">
          <label>Current</label>
          <input type="text" defaultValue={c.current} readOnly />
        </div>
        <div className="filter-field">
          <label>Target</label>
          <input type="text" defaultValue={c.target} readOnly />
        </div>
      </div>

      <div className="filter-field measure-config-full">
        <label>Calculation Formula</label>
        <textarea readOnly value={c.calculationFormula} rows={2} />
      </div>

      <div className="measure-calc-example">
        <div className="measure-calc-example-label">Calculation Example</div>
        <div>{c.calculationExample}</div>
      </div>

      <div className="measure-config-row-source">
        <div className="filter-field">
          <label>System of Record / Source</label>
          <input type="text" defaultValue={c.systemOfRecord} readOnly />
        </div>
        <div className="measure-toggle-field">
          <span>Include in executive scorecard</span>
          <span className={`toggle-switch${c.includeInScorecard ? ' on' : ''}`}>
            <span className="toggle-switch-knob" />
          </span>
        </div>
      </div>
    </section>
  )
}
