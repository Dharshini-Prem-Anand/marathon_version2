import { useRef, useState } from 'react'
import { Maximize2 } from 'lucide-react'
import TableExpandModal from './TableExpandModal'

function VendorPayeeTable({ vendorPayee }) {
  return (
    <div className="table-wrap">
      <table className="table-fixed">
        <colgroup>
          <col style={{ width: '30%' }} />
          <col style={{ width: '46%' }} />
          <col style={{ width: '24%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name / ID</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {vendorPayee.map((v) => (
            <tr key={v.type}>
              <td className="cell-ellipsis" title={v.type}>
                {v.type}
              </td>
              <td className={`cell-ellipsis${v.nameColor ? ` color-${v.nameColor}` : ''}`} title={v.name}>
                {v.name}
              </td>
              <td>
                <span className={`badge badge-${v.badgeColor}`}>{v.confidence}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function VendorPayeePanel({ vendorPayee = [] }) {
  const [expanded, setExpanded] = useState(false)
  const tableAnchorRef = useRef(null)

  return (
    <div className="pv-vendor">
      <section className="panel">
        <div className="panel-title-row">
          <h2 className="panel-title">Vendor &amp; Payee Validation</h2>
          <button
            className="icon-btn table-expand-btn"
            onClick={() => setExpanded(true)}
            aria-label="Expand Vendor & Payee Validation table"
          >
            <Maximize2 size={16} />
          </button>
        </div>
        <div ref={tableAnchorRef}>
          <VendorPayeeTable vendorPayee={vendorPayee} />
        </div>

        {expanded && (
          <TableExpandModal
            title="Vendor & Payee Validation"
            anchorRef={tableAnchorRef}
            onClose={() => setExpanded(false)}
          >
            <VendorPayeeTable vendorPayee={vendorPayee} />
          </TableExpandModal>
        )}
      </section>
    </div>
  )
}
