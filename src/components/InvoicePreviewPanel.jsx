import { useEffect, useState } from 'react'
import { FileText, Maximize2, X } from 'lucide-react'
import DocAiPipelineStepper from './DocAiPipelineStepper'
import LineItemExtraction from './LineItemExtraction'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

function PdfExpandModal({ document, pdfUrl, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <span className="pdf-modal-filename" title={document.fileName}>
            {document.fileName}
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
        <iframe className="pdf-modal-frame" src={pdfUrl} title={document.fileName} />
      </div>
    </div>
  )
}

function PdfPane({ document, pdfUrl, pdfLoading, pdfError, onExpand }) {
  if (!document) {
    return <div className="pdf-pane pdf-pane-empty">Select a document to preview it.</div>
  }
  if (pdfLoading) {
    return <div className="pdf-pane pdf-pane-empty">Loading document…</div>
  }
  if (pdfError) {
    return (
      <div className="pdf-pane pdf-pane-empty">
        <FileText size={22} />
        <div className="pdf-pane-filename">{document.fileName}</div>
        <div className="pdf-pane-error">{pdfError}</div>
      </div>
    )
  }
  return (
    <div className="pdf-pane-wrap">
      <iframe className="pdf-pane" src={pdfUrl} title={document.fileName} />
      <button className="icon-btn pdf-expand-btn" onClick={onExpand} aria-label="Expand preview">
        <Maximize2 size={16} />
      </button>
    </div>
  )
}

export default function InvoicePreviewPanel({
  document,
  headerFields = [],
  fieldsLoading,
  fieldsError,
  lineItems = { columns: [], rows: [] },
  pdfUrl,
  pdfLoading,
  pdfError,
  onNavigate,
}) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [document?.id])

  return (
    <section className="panel invoice-preview">
      <h2 className="panel-title">Invoice Preview &amp; Extracted Fields</h2>
      <div className="invoice-preview-grid">
        <PdfPane
          document={document}
          pdfUrl={pdfUrl}
          pdfLoading={pdfLoading}
          pdfError={pdfError}
          onExpand={() => setExpanded(true)}
        />

        <div className="extracted-fields">
          {!document ? (
            <div className="table-empty-cell">Select a document.</div>
          ) : fieldsLoading ? (
            <div className="table-empty-cell">Loading fields…</div>
          ) : fieldsError ? (
            <div className="table-empty-cell">{fieldsError}</div>
          ) : headerFields.length === 0 ? (
            <div className="table-empty-cell">No header fields extracted for this document.</div>
          ) : (
            <div className="docai-field-list">
              {headerFields.map((f, i) => (
                <div className="docai-field-row" key={`${f.key}-${i}`}>
                  <div className="docai-field-row-head">
                    <span className="docai-field-label">{f.field}</span>
                    <span className={`confidence-badge confidence-${confidenceClass(f.confidence)}`}>
                      {f.confidence}
                    </span>
                  </div>
                  <span className="docai-field-box">{f.value}</span>
                </div>
              ))}
            </div>
          )}

          <LineItemExtraction
            columns={lineItems.columns}
            rows={lineItems.rows}
            loading={fieldsLoading}
            error={fieldsError}
            hasDocument={Boolean(document)}
          />
        </div>
      </div>

      {document && (
        <>
          <h3 className="preview-subheading">Processing Pipeline</h3>
          <DocAiPipelineStepper
            document={document}
            headerFields={headerFields}
            fieldsError={fieldsError}
            onNavigate={onNavigate}
          />
        </>
      )}

      {expanded && document && pdfUrl && (
        <PdfExpandModal document={document} pdfUrl={pdfUrl} onClose={() => setExpanded(false)} />
      )}
    </section>
  )
}

