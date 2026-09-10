// Rows come from /preValidationKpis (preventedDownstreamVimExceptions).
export default function PreventedExceptionsByType({ rows, rangeLabel }) {
  return (
    <section className="panel">
      <h2 className="panel-title">
        Prevented Downstream VIM Exceptions by Type{rangeLabel ? ` (${rangeLabel})` : ''}
      </h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '48%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '36%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Exception Type</th>
              <th>Prevented</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {!rows ? (
              <tr>
                <td colSpan={3} className="table-empty-cell">
                  Loading prevented exceptions…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty-cell">
                  No exceptions prevented in this period.
                </td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.type}>
                  <td className="cell-ellipsis" title={e.type}>
                    {e.type}
                  </td>
                  <td>{e.prevented}</td>
                  <td>
                    <div className="inline-bar-cell">
                      <div className="inline-bar-track">
                        <div className="inline-bar-fill inline-bar-green" style={{ width: `${e.percent}%` }} />
                      </div>
                      <span>{e.percent}%</span>
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
