import { FileText } from 'lucide-react'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { usePagedRows } from '../hooks/usePagedRows'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const statusColor = {
  Passed: 'green',
  Review: 'orange',
  Failed: 'red',
}

const COLUMNS = {
  invoiceNumber: (row) => row.invoiceNumber,
  vendor: (row) => row.vendor,
  amount: (row) => row.amount,
  status: (row) => row.status,
  // Not shown as its own column, but drives the default "latest first" sort
  // below — a real Date, parsed upstream from the invoice's actual date.
  date: (row) => row.date,
}

export default function PreValidationQueueTable({ rows = [], selectedId, onSelect }) {
  const colCount = 4
  // Default to the latest invoice (by actual invoice date) on top.
  const ctl = useColumnSortFilter(rows, COLUMNS, { key: 'date', dir: 'desc' })
  const paging = usePagedRows(ctl.rows, undefined, { alwaysExpanded: true })
  const shownRowCount = paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <section className="panel document-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Document Pre Validation Queue</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '32%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="invoiceNumber" label="Invoice" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="amount" label="Amount" ctl={ctl} />
              <SortFilterTh
                columnKey="status"
                label="Status"
                ctl={ctl}
                filterOptions={['Failed', 'Review', 'Passed']}
              />
            </tr>
          </thead>
          <tbody>
            {paging.visibleRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            ) : (
              paging.visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect?.(row.id)}
                  className={`triage-row${selectedId === row.id ? ' selected' : ''}`}
                >
                  <td className="attachment-file cell-ellipsis" title={row.invoiceNumber}>
                    <FileText size={13} />
                    <span className="cell-ellipsis">{row.invoiceNumber}</span>
                  </td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={`badge badge-${statusColor[row.status] ?? 'gray'}`}>{row.status}</span>
                  </td>
                </tr>
              ))
            )}
            <TableFillerRows count={paging.pageSize - shownRowCount} colSpan={colCount} />
          </tbody>
        </table>
      </div>

      <TablePagination paging={paging} showCollapse={false} />
    </section>
  )
}
