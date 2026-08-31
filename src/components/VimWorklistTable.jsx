import { useState } from 'react'
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

const priorityColor = { High: 'red', Medium: 'orange', Low: 'blue' }

export default function VimWorklistTable({ rows }) {
  const [page] = useState(1)

  return (
    <section className="panel vim-worklist">
      <h2 className="panel-title">VIM Worklist</h2>
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
              <th>Priority</th>
              <th>Invoice ID</th>
              <th>VIM Doc</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>VIM Status</th>
              <th>Workflow Step</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Aging</th>
              <th>Touch.</th>
              <th>Last Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={13} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            )}
            {rows.map((row) => {
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
        <span>Showing {rows.length === 0 ? 0 : 1} to {rows.length} of {rows.length} entries</span>
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
