import { useState } from 'react'
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const priorityColor = { High: 'red', Medium: 'orange', Low: 'blue' }

const COLUMNS = {
  priority: (row) => row.priority,
  invoiceId: (row) => row.invoiceId,
  vimDocument: (row) => row.vimDocument,
  vendor: (row) => row.vendor,
  amount: (row) => row.amount,
  vimStatus: (row) => row.vimStatus,
  workflowStep: (row) => row.workflowStep,
  currentOwner: (row) => row.currentOwner,
  dueDate: (row) => row.dueDate,
  aging: (row) => row.aging,
  touchless: (row) => row.touchless,
  lastEvent: (row) => row.lastEvent,
}

export default function VimWorklistTable({ rows }) {
  const [page] = useState(1)
  const ctl = useColumnSortFilter(rows, COLUMNS)

  return (
    <section className="panel vim-worklist">
      <div className="panel-title-row">
        <h2 className="panel-title">VIM Worklist</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '6%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="priority" label="Priority" ctl={ctl} />
              <SortFilterTh columnKey="invoiceId" label="Invoice ID" ctl={ctl} />
              <SortFilterTh columnKey="vimDocument" label="VIM Doc" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="amount" label="Amount" ctl={ctl} />
              <SortFilterTh columnKey="vimStatus" label="VIM Status" ctl={ctl} />
              <SortFilterTh columnKey="workflowStep" label="Workflow Step" ctl={ctl} />
              <SortFilterTh columnKey="currentOwner" label="Owner" ctl={ctl} />
              <SortFilterTh columnKey="dueDate" label="Due Date" ctl={ctl} />
              <SortFilterTh columnKey="aging" label="Aging" ctl={ctl} />
              <SortFilterTh columnKey="touchless" label="Touch." ctl={ctl} />
              <SortFilterTh columnKey="lastEvent" label="Last Event" ctl={ctl} />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 && (
              <tr>
                <td colSpan={13} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            )}
            {ctl.rows.map((row) => {
              const ArrowIcon = row.priorityDir === 'up' ? ArrowUp : ArrowDown
              return (
                <tr key={row.invoiceId}>
                  <td>
                    <span className={`priority-arrow color-${priorityColor[row.priority]}`}>
                      <ArrowIcon size={13} />
                      {row.priority}
                    </span>
                  </td>
                  <td className="cell-mono cell-ellipsis" title={row.invoiceId}>
                    {row.invoiceId}
                  </td>
                  <td className="cell-mono cell-ellipsis" title={row.vimDocument}>
                    {row.vimDocument}
                  </td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={`badge badge-${row.vimStatusColor}`}>{row.vimStatus}</span>
                  </td>
                  <td className="cell-ellipsis" title={row.workflowStep}>
                    {row.workflowStep}
                  </td>
                  <td className="cell-ellipsis" title={row.currentOwner}>
                    {row.currentOwner}
                  </td>
                  <td>{row.dueDate}</td>
                  <td>{row.aging}</td>
                  <td>{row.touchless}</td>
                  <td className="cell-ellipsis" title={row.lastEvent}>
                    {row.lastEvent}
                  </td>
                  <td>
                    <button className="btn-table-action">{row.action}</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <span>Showing {ctl.rows.length === 0 ? 0 : 1} to {ctl.rows.length} of {ctl.rows.length} entries</span>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>
            <ChevronLeft size={14} />
            <ChevronLeft size={14} className="pagination-btn-second" />
          </button>
          <button className="pagination-btn" disabled>
            <ChevronLeft size={14} />
          </button>
          <button className="pagination-page active">{page}</button>
          <button className="pagination-btn" disabled>
            <ChevronRight size={14} />
          </button>
          <button className="pagination-btn" disabled>
            <ChevronRight size={14} />
            <ChevronRight size={14} className="pagination-btn-second" />
          </button>
        </div>
      </div>
    </section>
  )
}
