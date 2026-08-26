import { Star, Ban } from 'lucide-react'
import { whatIfScenarios } from '../data'

const tagConfig = {
  recommended: { icon: Star, label: 'Recommended', color: 'green' },
  'not-allowed': { icon: Ban, label: 'Not Allowed', color: 'red' },
}

export default function WhatIfResolutionScenarios() {
  return (
    <section className="panel">
      <h2 className="panel-title">What-If Resolution Scenarios</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Scenario</th>
              <th>Action</th>
              <th>Cycle Time</th>
              <th>Manual Minutes</th>
              <th>Late-Payment Risk</th>
              <th>Estimated Cost</th>
              <th>Control Status</th>
            </tr>
          </thead>
          <tbody>
            {whatIfScenarios.map((s) => {
              const tag = tagConfig[s.tag]
              return (
                <tr key={s.scenario} className={s.rowStyle ? `scenario-row-${s.rowStyle}` : undefined}>
                  <td>
                    {tag && (
                      <span className={`scenario-tag scenario-tag-${tag.color}`}>
                        <tag.icon size={12} />
                        {tag.label}
                      </span>
                    )}
                  </td>
                  <td>{s.scenario}</td>
                  <td>{s.action}</td>
                  <td className={s.valueColor ? `color-${s.valueColor}` : undefined}>{s.cycleTime}</td>
                  <td className={s.valueColor ? `color-${s.valueColor}` : undefined}>{s.manualMinutes}</td>
                  <td className={`color-${s.latePaymentRiskColor}`}>{s.latePaymentRisk}</td>
                  <td className={s.valueColor ? `color-${s.valueColor}` : undefined}>{s.estimatedCost}</td>
                  <td className={s.valueColor ? `color-${s.valueColor}` : undefined}>{s.controlStatus}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
