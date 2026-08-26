import { FileText, FileType2, FileSpreadsheet, FileImage, PenTool } from 'lucide-react'
import { documentQueue } from '../data'

const iconMap = {
  pdf: FileText,
  word: FileType2,
  excel: FileSpreadsheet,
  image: FileImage,
  handwritten: PenTool,
}

export default function DocumentQueueTable() {
  return (
    <section className="panel document-queue">
      <h2 className="panel-title">Document Extraction Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '37%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Format</th>
              <th>Documents</th>
              <th>% of Total</th>
              <th>Top Vendors</th>
              <th>Low Confidence</th>
            </tr>
          </thead>
          <tbody>
            {documentQueue.map((row) => {
              const Icon = iconMap[row.icon]
              return (
                <tr key={row.format}>
                  <td>
                    <span className="format-cell">
                      <span className={`format-icon format-icon-${row.color}`}>
                        <Icon size={14} strokeWidth={1.8} />
                      </span>
                      <span>{row.format}</span>
                    </span>
                  </td>
                  <td>{row.documents.toLocaleString()}</td>
                  <td>{row.percent}</td>
                  <td className="cell-ellipsis" title={`${row.topVendor} (${row.topVendorCount})`}>
                    {row.topVendor} ({row.topVendorCount})
                  </td>
                  <td>{row.lowConfidence}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">View All Documents</button>
    </section>
  )
}
