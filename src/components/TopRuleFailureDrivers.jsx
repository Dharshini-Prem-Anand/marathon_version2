import { topRuleFailureDrivers } from '../data'

export default function TopRuleFailureDrivers() {
  return (
    <section className="panel">
      <h2 className="panel-title">Top Rule Failure Drivers (This Period)</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '42%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '42%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Invoices</th>
              <th>% of Failures</th>
            </tr>
          </thead>
          <tbody>
            {topRuleFailureDrivers.map((d) => (
              <tr key={d.driver}>
                <td className="cell-ellipsis" title={d.driver}>
                  {d.driver}
                </td>
                <td>{d.invoices}</td>
                <td>
                  <div className="inline-bar-cell">
                    <div className="inline-bar-track">
                      <div className={`inline-bar-fill inline-bar-${d.color}`} style={{ width: `${d.percent}%` }} />
                    </div>
                    <span>{d.percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
