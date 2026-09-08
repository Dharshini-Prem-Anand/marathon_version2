import { useEffect, useState } from 'react'
import { X, Pencil } from 'lucide-react'
import PaneSplitter from './PaneSplitter'
import { useSplitRatio } from '../hooks/useSplitRatio'
import { fetchDieSchema, updateDieSchemaFields } from '../api/invoiceAutomation'
import {
  mapDieSchema,
  emptyField,
  buildSchemaFieldPayload,
  DATA_TYPES,
  SETUP_TYPES,
} from '../utils/schemaMappers'

const SECTION_LABEL = { header: 'Header Field', lineItem: 'Line Item Field' }

const isActiveState = (state) => String(state ?? '').trim().toLowerCase() === 'active'
const titleCase = (value) => {
  const text = String(value ?? '').trim()
  return text ? text[0].toUpperCase() + text.slice(1).toLowerCase() : ''
}

function FieldTable({ title, fields, onAdd, onEdit, editingField }) {
  return (
    <div className="schema-section">
      <div className="schema-section-header">
        <h3 className="schema-section-title">{title}</h3>
        <button className="btn-primary schema-add-btn" onClick={onAdd}>
          Add
        </button>
      </div>

      <div className="table-wrap">
        <table className="table-fixed schema-field-table">
          <colgroup>
            <col style={{ width: '26%' }} />
            <col style={{ width: '50%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Data Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty-cell">
                  No fields defined.
                </td>
              </tr>
            ) : (
              fields.map((f, i) => (
                <tr
                  key={`${f.name}-${i}`}
                  className={editingField && editingField.section === f.section && editingField.name === f.name ? 'selected' : undefined}
                >
                  <td className="cell-ellipsis schema-field-name" title={f.name}>
                    {f.name}
                  </td>
                  <td className="cell-ellipsis" title={f.description}>
                    {f.description || '—'}
                  </td>
                  <td>{f.dataType}</td>
                  <td>
                    <button
                      className="icon-btn schema-edit-btn"
                      onClick={() => onEdit(f)}
                      aria-label={`Edit ${f.name}`}
                      title={`Edit ${f.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FieldForm({ field, isNew, onChange, onSave, onCancel, saving, saveError }) {
  const canSave = field.name.trim().length > 0 && !saving

  return (
    <div className="schema-form">
      <div className="schema-form-header">
        <div>
          <h3 className="schema-section-title">{isNew ? 'New Field' : 'Edit Field'}</h3>
          <div className="schema-form-subtitle">{SECTION_LABEL[field.section]}</div>
        </div>
        <div className="schema-form-actions">
          <button className="btn-primary" onClick={onSave} disabled={!canSave}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn-outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>

      <div className="schema-form-body">
        <label className="schema-field-label">
          Name <span className="schema-required">*</span>
          <input
            className="schema-input"
            value={field.name}
            onChange={(e) => onChange({ ...field, name: e.target.value })}
            placeholder="e.g. TaxAmount"
          />
        </label>

        <label className="schema-field-label">
          Description
          <textarea
            className="schema-input schema-textarea"
            rows={4}
            value={field.description}
            onChange={(e) => onChange({ ...field, description: e.target.value })}
            placeholder="What this field means, so the extractor can find it"
          />
        </label>

        <label className="schema-field-label">
          Data Type <span className="schema-required">*</span>
          <select
            className="schema-input"
            value={field.dataType}
            onChange={(e) => onChange({ ...field, dataType: e.target.value })}
          >
            {DATA_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="schema-field-label">
          Setup Type <span className="schema-required">*</span>
          <select
            className="schema-input"
            value={field.setupType}
            onChange={(e) => onChange({ ...field, setupType: e.target.value })}
          >
            {SETUP_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        {saveError && <p className="schema-form-error">{saveError}</p>}
      </div>
    </div>
  )
}

export default function SchemaConfigurationDialog({ onClose }) {
  const [schema, setSchema] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Same drag-to-resize divider as the document / extracted-fields split.
  const { ratio, paneRef, containerRef, startResize } = useSplitRatio(0.58, 0.3, 0.8)

  useEffect(() => {
    let cancelled = false
    fetchDieSchema()
      .then((res) => {
        if (!cancelled) setSchema(mapDieSchema(res))
      })
      .catch((err) => {
        if (!cancelled) setError(`Could not load the extraction schema — ${err.message}`)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const startAdd = (section) => {
    setSaveError(null)
    setEditing(emptyField(section))
    setIsNew(true)
  }

  const startEdit = (field) => {
    setSaveError(null)
    setEditing({ ...field })
    setIsNew(false)
  }

  const closeForm = () => {
    setEditing(null)
    setIsNew(false)
    setSaveError(null)
  }

  // Persist, then re-read the schema so the list shows what the service
  // actually stored rather than what we hoped it stored.
  const saveField = () => {
    setSaving(true)
    setSaveError(null)

    updateDieSchemaFields(buildSchemaFieldPayload(schema, editing, isNew))
      .then(() => fetchDieSchema())
      .then((res) => {
        setSchema(mapDieSchema(res))
        setEditing(null)
        setIsNew(false)
      })
      .catch((err) => setSaveError(`Could not save the field — ${err.message}`))
      .finally(() => setSaving(false))
  }

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal schema-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <div className="schema-modal-heading">
            <span className="schema-modal-title">Schema Configuration</span>
            {schema && (
              <>
                <span className="schema-modal-meta">{schema.name}</span>
                {schema.state && (
                  <span className={`schema-state schema-state-${isActiveState(schema.state) ? 'active' : 'inactive'}`}>
                    <span className="schema-state-dot" />
                    {titleCase(schema.state)}
                  </span>
                )}
              </>
            )}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close schema configuration">
            <X size={18} />
          </button>
        </div>

        <div className="schema-modal-body" ref={containerRef}>
          <div
            className="schema-list-pane"
            ref={paneRef}
            style={editing ? { flexBasis: `${ratio * 100}%` } : { flexBasis: '100%' }}
          >
            {error ? (
              <div className="table-empty-cell">{error}</div>
            ) : !schema ? (
              <div className="table-empty-cell">Loading schema…</div>
            ) : (
              <>
                <FieldTable
                  title="Header Fields"
                  fields={schema.headerFields}
                  onAdd={() => startAdd('header')}
                  onEdit={startEdit}
                  editingField={editing}
                />
                <FieldTable
                  title="Line Item Fields"
                  fields={schema.lineItemFields}
                  onAdd={() => startAdd('lineItem')}
                  onEdit={startEdit}
                  editingField={editing}
                />
              </>
            )}
          </div>

          {editing && (
            <>
              <PaneSplitter onMouseDown={startResize} />
              <div className="schema-form-pane">
                <FieldForm
                  field={editing}
                  isNew={isNew}
                  onChange={setEditing}
                  onSave={saveField}
                  onCancel={closeForm}
                  saving={saving}
                  saveError={saveError}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
