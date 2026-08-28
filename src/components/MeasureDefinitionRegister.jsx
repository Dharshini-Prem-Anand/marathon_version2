export default function MeasureDefinitionRegister({ rows }) {
  return (
    <section className="panel measure-register">
      <div className="panel-title-row">
        <h2 className="panel-title">Measure Definition Register</h2>
        <span className="measure-count">{rows.length} measures</span>
      </div>

      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '26%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Measure</th>
              <th>Category</th>
              <th>Baseline</th>
              <th>Current</th>
              <th>Target</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty-cell">
                  No measures match the selected filters.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.measure} className={row.selected ? 'scenario-row-selected' : undefined}>
                <td>
                  <div className="measure-name-cell cell-ellipsis" title={row.measure}>
                    {row.measure}
                  </div>
                  <div className="measure-subtitle-cell cell-ellipsis" title={row.subtitle}>
                    {row.subtitle}
                  </div>
                </td>
                <td className="cell-ellipsis">{row.category}</td>
                <td>{row.baseline}</td>
                <td>{row.current}</td>
                <td>{row.target}</td>
                <td className="cell-ellipsis" title={row.owner}>
                  {row.owner}
                </td>
                <td>
                  <span className="badge badge-green">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
