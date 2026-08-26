import { Pencil } from 'lucide-react'
import { whatIfInputs, whatIfScenariosAnalytics } from '../data'

export default function WhatIfBusinessScenarios() {
  return (
    <section className="panel what-if-business">
      <h2 className="panel-title">What-If Business Scenarios</h2>

      <div className="what-if-inputs-row">
        {whatIfInputs.map((f) => (
          <div className="filter-field" key={f.label}>
            <label>{f.label}</label>
            <div className="what-if-input-box">
              <span>{f.value}</span>
              <Pencil size={13} />
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Scenario</th>
              <th>Touchless Rate</th>
              <th>Net Annualized Value</th>
              <th>Payback Period</th>
              <th>On-Time Payment</th>
            </tr>
          </thead>
          <tbody>
            {whatIfScenariosAnalytics.map((s) => (
              <tr key={s.scenario} className={s.selected ? 'scenario-row-selected' : undefined}>
                <td>
                  <span className="radio-dot">
                    <span className={`radio-dot-inner${s.selected ? ' checked' : ''}`} />
                  </span>
                </td>
                <td className={s.selected ? 'color-blue' : undefined} style={s.selected ? { fontWeight: 700 } : undefined}>
                  {s.scenario}
                </td>
                <td>{s.touchlessRate}</td>
                <td>{s.netValue}</td>
                <td>{s.payback}</td>
                <td>{s.onTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
