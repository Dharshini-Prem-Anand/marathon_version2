// Rows come from /preValidationKpis (topRuleFailureDrivers). `rows` is null
// until it answers.
export default function TopRuleFailureDrivers({ rows, rangeLabel }) {
  return (
    <section className="panel">
      <h2 className="panel-title">
        Top Rule Failure Drivers{rangeLabel ? ` (${rangeLabel})` : ''}
      </h2>
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
            {!rows ? (
              <tr>
                <td colSpan={3} className="table-empty-cell">
                  Loading rule failures…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty-cell">
                  No rule failures in this period.
                </td>
              </tr>
            ) : (
              rows.map((d) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
