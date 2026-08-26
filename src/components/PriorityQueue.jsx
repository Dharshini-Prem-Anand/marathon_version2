import { priorityQueue } from '../data'

const priorityColor = {
  High: 'red',
  Medium: 'orange',
  Low: 'blue',
}

export default function PriorityQueue() {
  return (
    <section className="panel priority-queue">
      <h2 className="panel-title">Priority Action Queue</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Invoice</th>
              <th>Vendor</th>
              <th>Issue</th>
              <th>Due</th>
              <th>Owner</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {priorityQueue.map((row) => (
              <tr key={row.invoice}>
                <td>
                  <span className={`priority-dot color-${priorityColor[row.priority]}`} />
                  {row.priority}
                </td>
                <td className="cell-mono">{row.invoice}</td>
                <td>{row.vendor}</td>
                <td>{row.issue}</td>
                <td>{row.due}</td>
                <td>{row.owner}</td>
                <td className="cell-action">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
