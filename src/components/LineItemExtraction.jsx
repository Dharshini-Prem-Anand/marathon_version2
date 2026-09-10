import { useMemo } from 'react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'
import { useColumnOrder } from '../hooks/useColumnOrder'
import { confidenceTone } from '../utils/confidenceBands'

// Item is the grouping key rather than an extracted field, but as far as the
// table is concerned it's a column like any other — sortable, filterable and
// draggable along with the rest.
const ITEM_COLUMN = { key: 'itemNumber', label: 'Item' }

export default function LineItemExtraction({ columns = [], rows = [], loading, error, hasDocument }) {
  const allColumns = useMemo(() => [ITEM_COLUMN, ...columns], [columns])
  const { columns: orderedColumns, dragPropsFor, dragStateFor, scrollRef } = useColumnOrder(allColumns)
  const colCount = allColumns.length

  const COLUMNS = useMemo(() => {
    const cols = { [ITEM_COLUMN.key]: (row) => row.itemNumber }
    for (const c of columns) {
      cols[c.key] = (row) => row.cells[c.key]?.value
    }
    return cols
  }, [columns])

  const ctl = useColumnSortFilter(rows, COLUMNS)

  return (
    <section className="panel line-item-extraction">
      <div className="panel-title-row">
        <h2 className="panel-title">Line-Items</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap" ref={scrollRef}>
        <table>
          <thead>
            <tr>
              {orderedColumns.map((c) => (
                <SortFilterTh
                  key={c.key}
                  columnKey={c.key}
                  label={c.label}
                  ctl={ctl}
                  dragProps={dragPropsFor(c.key)}
                  dragState={dragStateFor(c.key)}
                />
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
                  {orderedColumns.map((c) => {
                    if (c.key === ITEM_COLUMN.key) return <td key={c.key}>{row.itemNumber}</td>
                    const cell = row.cells[c.key]
                    if (!cell) return <td key={c.key}>—</td>
                    return (
                      <td key={c.key}>
                        <span className="line-item-value" title={cell.value}>
                          {cell.value}
                        </span>
                        <span className={`confidence-badge confidence-${confidenceTone(cell.confidence)}`}>
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
