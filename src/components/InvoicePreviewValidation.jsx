import { useEffect, useRef, useState } from 'react'
import { Globe, Pencil, Check, X, Maximize2 } from 'lucide-react'
import { ruleForField } from '../utils/preValidationMappers'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TableExpandModal from './TableExpandModal'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const LINE_ITEM_COLUMNS = {
  line: (row) => row.line,
  description: (row) => row.description,
  quantity: (row) => row.quantity,
  uom: (row) => row.uom,
  unitPrice: (row) => row.unitPrice,
  amount: (row) => row.amount,
}

function LineItemsTable({ ctl }) {
  return (
    <div className="table-wrap">
      <table className="pv-line-items table-fixed">
        <colgroup>
          <col style={{ width: '6%' }} />
          <col style={{ width: '34%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '22%' }} />
        </colgroup>
        <thead>
          <tr>
            <SortFilterTh columnKey="line" label="#" ctl={ctl} />
            <SortFilterTh columnKey="description" label="Description" ctl={ctl} />
            <SortFilterTh columnKey="quantity" label="Qty" ctl={ctl} />
            <SortFilterTh columnKey="uom" label="UOM" ctl={ctl} />
            <SortFilterTh columnKey="unitPrice" label="Price" ctl={ctl} />
            <SortFilterTh columnKey="amount" label="Amount" ctl={ctl} />
          </tr>
        </thead>
        <tbody>
          {ctl.rows.map((li) => (
            <tr key={li.line}>
              <td>{li.line}</td>
              <td className="cell-ellipsis" title={li.description}>
                {li.description}
              </td>
              <td>{li.quantity}</td>
              <td>{li.uom}</td>
              <td>{li.unitPrice}</td>
              <td>{li.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function InvoicePreviewValidation({ invoice, rules = [], onCorrectField }) {
  const inv = invoice
  const [editingField, setEditingField] = useState(null)
  const [draftValue, setDraftValue] = useState('')
  const [expanded, setExpanded] = useState(false)
  const contentAnchorRef = useRef(null)
  const ctl = useColumnSortFilter(inv?.lineItems || [], LINE_ITEM_COLUMNS)

  // Switching to a different invoice (or a correction landing) should never
  // leave a stale edit box open for a field that belongs to the last one.
  useEffect(() => {
    setEditingField(null)
    setDraftValue('')
  }, [invoice])

  if (!inv) {
    return (
      <section className="panel pv-preview">
        <h2 className="panel-title">Selected Invoice Preview</h2>
        <div className="table-empty-cell">Select an invoice from the queue.</div>
      </section>
    )
  }

  const startEdit = (fieldKey, value) => {
    setEditingField(fieldKey)
    setDraftValue(value)
  }

  const cancelEdit = () => {
    setEditingField(null)
    setDraftValue('')
  }

  const submitEdit = (fieldKey) => {
    const value = draftValue.trim()
    if (value) onCorrectField?.(fieldKey, value)
    setEditingField(null)
    setDraftValue('')
  }

  // Fields whose extraction confidence is low (their mapped validation rule
  // isn't "passed") get an inline Correct Field control; submitting it
  // re-runs that rule against the corrected value.
  const renderField = (fieldKey, label, value) => {
    const rule = ruleForField(rules, fieldKey)
    const needsCorrection = Boolean(rule) && rule.result !== 'passed'
    const isEditing = editingField === fieldKey

    return (
      <div className="pv-field-row" key={fieldKey}>
        <span className="pv-field-label">{label}:</span>
        {isEditing ? (
          <span className="pv-field-edit">
            <input
              className="pv-field-input"
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitEdit(fieldKey)
                if (e.key === 'Escape') cancelEdit()
              }}
              autoFocus
            />
            <button className="pv-field-icon-btn" title="Save" onClick={() => submitEdit(fieldKey)}>
              <Check size={14} />
            </button>
            <button className="pv-field-icon-btn" title="Cancel" onClick={cancelEdit}>
              <X size={14} />
            </button>
          </span>
        ) : (
          <>
            <span className="pv-field-box">{value}</span>
            {needsCorrection && (
              <button className="pv-correct-field-btn" onClick={() => startEdit(fieldKey, value)}>
                <Pencil size={12} />
                Correct Field
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  // Everything below the panel's own header — shared between the inline
  // card and its expanded modal so the two never drift apart.
  const renderPreviewBody = () => (
    <>
      <div className="pv-invoice-brand">
        <Globe size={22} className="color-blue" />
        <span>{inv.vendorName}</span>
      </div>

      <div className="pv-field-list">
        {renderField('invoiceNumber', 'Invoice No', inv.invoiceNumber)}
        <div className="pv-field-row">
          <span className="pv-field-label">Invoice Date:</span>
          <span className="pv-field-box">{inv.invoiceDate}</span>
        </div>
        {renderField('poNumber', 'PO Number', inv.poNumber)}
        {renderField('grossAmount', 'Gross Amount', inv.grossAmount)}
      </div>

      <div className="panel-title-row">
        <h3 className="preview-subheading">Line Items</h3>
        <TableSearchInput ctl={ctl} placeholder="Search line items..." />
      </div>
      <LineItemsTable ctl={ctl} />

      <div className="pv-total-row">
        <span className="pv-field-label">Total Amount Due:</span>
        <span className="pv-field-box pv-total-box">{inv.totalAmountDue}</span>
      </div>
    </>
  )

  return (
    <section className="panel pv-preview">
      <div className="panel-title-row">
        <h2 className="panel-title">Selected Invoice Preview</h2>
        <span className="badge badge-green">{inv.confidenceBadge}</span>
        <button
          className="icon-btn table-expand-btn"
          onClick={() => setExpanded(true)}
          aria-label="Expand Selected Invoice Preview"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div ref={contentAnchorRef}>{renderPreviewBody()}</div>

      {expanded && (
        <TableExpandModal
          title="Selected Invoice Preview"
          anchorRef={contentAnchorRef}
          onClose={() => setExpanded(false)}
        >
          {renderPreviewBody()}
        </TableExpandModal>
      )}
    </section>
  )
}
