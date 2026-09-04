import { useMemo } from 'react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

export default function LineItemExtraction({ columns = [], rows = [], loading, error, hasDocument }) {
  const colCount = columns.length + 1

  const COLUMNS = useMemo(() => {
    const cols = { itemNumber: (row) => row.itemNumber }
    for (const c of columns) {
      cols[c.key] = (row) => row.cells[c.key]?.value
    }
    return cols
  }, [columns])

  const ctl = useColumnSortFilter(rows, COLUMNS)

  return (
    <section className="panel line-item-extraction">
      <div className="panel-title-row">
        <h2 className="panel-title">Line-Item Extraction</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <SortFilterTh columnKey="itemNumber" label="Item" ctl={ctl} />
              {columns.map((c) => (
                <SortFilterTh key={c.key} columnKey={c.key} label={c.label} ctl={ctl} />
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasDocument ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Select a document to see its line items.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Loading line items…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  {error}
                </td>
              </tr>
            ) : ctl.rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No line items extracted for this document.
                </td>
              </tr>
            ) : (
              ctl.rows.map((row) => (
                <tr key={row.itemNumber}>
                  <td>{row.itemNumber}</td>
                  {columns.map((c) => {
                    const cell = row.cells[c.key]
                    if (!cell) return <td key={c.key}>—</td>
                    return (
                      <td key={c.key}>
                        <span className="line-item-value" title={cell.value}>
                          {cell.value}
                        </span>
                        <span className={`confidence-badge confidence-${confidenceClass(cell.confidence)}`}>
                          {cell.confidence}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

