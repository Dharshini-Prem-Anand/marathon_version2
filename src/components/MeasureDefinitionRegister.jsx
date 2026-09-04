import SortFilterTh from './SortFilterTh'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  measure: (row) => row.measure,
  category: (row) => row.category,
  baseline: (row) => row.baseline,
  current: (row) => row.current,
  target: (row) => row.target,
  owner: (row) => row.owner,
  status: (row) => row.status,
}

export default function MeasureDefinitionRegister({ rows }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)

  return (
    <section className="panel measure-register">
      <div className="panel-title-row">
        <h2 className="panel-title">Measure Definition Register</h2>
        <span className="measure-count">{ctl.rows.length} measures</span>
      </div>

      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="measure" label="Measure" ctl={ctl} />
              <SortFilterTh columnKey="category" label="Category" ctl={ctl} />
              <SortFilterTh columnKey="baseline" label="Baseline" ctl={ctl} />
              <SortFilterTh columnKey="current" label="Current" ctl={ctl} />
              <SortFilterTh columnKey="target" label="Target" ctl={ctl} />
              <SortFilterTh columnKey="owner" label="Owner" ctl={ctl} />
              <SortFilterTh columnKey="status" label="Status" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty-cell">
                  No measures match the selected filters.
                </td>
              </tr>
            )}
            {ctl.rows.map((row) => (
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
