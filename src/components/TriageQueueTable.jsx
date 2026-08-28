import { MoreVertical } from 'lucide-react'
import { categoryColor, priorityColor, totalTriageCount } from '../data'

export default function TriageQueueTable({ rows, selectedId, onSelect }) {
  return (
    <section className="panel triage-queue">
      <h2 className="panel-title">Triage Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '21%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '5%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Time</th>
              <th>Source</th>
              <th>Sender / Vendor</th>
              <th>Subject</th>
              <th>Attach.</th>
              <th>Category</th>
              <th>Conf.</th>
              <th>Priority</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="table-empty-cell">
                  No emails match the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row.id)}
                  className={`triage-row${selectedId === row.id ? ' selected' : ''}${
                    row.category === 'Duplicate' && selectedId !== row.id ? ' flagged' : ''
                  }`}
                >
                  <td>{row.time}</td>
                  <td className="cell-ellipsis">{row.source}</td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td className="cell-ellipsis" title={row.subject}>
                    {row.subject}
                  </td>
                  <td>{row.attachments}</td>
                  <td>
                    <span className={`badge badge-${categoryColor[row.category]}`}>{row.category}</span>
                  </td>
                  <td>{row.confidence}</td>
                  <td className={`color-${priorityColor[row.priority]}`}>{row.priority}</td>
                  <td>
                    <button className="icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Row actions">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">View All ({totalTriageCount})</button>
    </section>
  )
}
