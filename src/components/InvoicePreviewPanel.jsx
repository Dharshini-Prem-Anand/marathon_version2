import { useEffect, useRef, useState } from 'react'
import { FileText, Maximize2, X } from 'lucide-react'
import LineItemExtraction from './LineItemExtraction'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

// Drag-to-resize state for a two-pane split. `containerRef` goes on the flex
// row, `paneRef` on the resizing pane. While dragging, the pane's flex-basis
// is written straight to the DOM (bypassing React) so the drag doesn't force
// a re-render of everything on the page — including the line-items table —
// on every pixel of mouse movement, which is what made it feel laggy.
// `ratio` state only updates once, on mouseup, so React's picture stays in
// sync without paying the per-frame render cost during the drag itself.
function useSplitRatio(initial, min = 0.28, max = 0.8) {
  const [ratio, setRatio] = useState(initial)
  const containerRef = useRef(null)
  const paneRef = useRef(null)
  const draggingRef = useRef(false)
  const ratioRef = useRef(initial)

  useEffect(() => {
    function onMouseMove(e) {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const next = Math.min(max, Math.max(min, (e.clientX - rect.left) / rect.width))
      ratioRef.current = next
      if (paneRef.current) paneRef.current.style.flexBasis = `${next * 100}%`
    }
    function onMouseUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      window.document.body.classList.remove('is-resizing-cols')
      setRatio(ratioRef.current)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [min, max])

  function startResize(e) {
    e.preventDefault()
    ratioRef.current = ratio
    draggingRef.current = true
    window.document.body.classList.add('is-resizing-cols')
  }

  return { ratio, paneRef, containerRef, startResize }
}

function PaneSplitter({ onMouseDown }) {
  return (
    <div
      className="invoice-preview-splitter"
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize invoice preview"
    />
  )
}

// Header field cards + Line-Item Extraction table — shared between the inline
// panel and the full-screen split view so the two never drift apart.
function ExtractedFieldsContent({ document, headerFields, fieldsLoading, fieldsError, lineItems }) {
  return (
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
  )
}

function PdfExpandModal({ document, pdfUrl, headerFields, fieldsLoading, fieldsError, lineItems, onClose }) {
  const { ratio, paneRef, containerRef, startResize } = useSplitRatio(0.6, 0.32, 0.82)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal pdf-modal-split" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <span className="pdf-modal-filename" title={document.fileName}>
            {document.fileName}
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
        <div className="pdf-modal-split-body" ref={containerRef}>
          <div className="pdf-modal-pdf-pane" ref={paneRef} style={{ flexBasis: `${ratio * 100}%` }}>
            <iframe className="pdf-modal-frame" src={pdfUrl} title={document.fileName} />
          </div>

          <PaneSplitter onMouseDown={startResize} />

          <div className="pdf-modal-fields-pane">
            <ExtractedFieldsContent
              document={document}
              headerFields={headerFields}
              fieldsLoading={fieldsLoading}
              fieldsError={fieldsError}
              lineItems={lineItems}
            />
          </div>
        </div>
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
}) {
  const [expanded, setExpanded] = useState(false)
  const { ratio: splitRatio, paneRef, containerRef: splitRef, startResize } = useSplitRatio(0.56)

  useEffect(() => {
    setExpanded(false)
  }, [document?.id])

  return (
    <section className="panel invoice-preview">
      <h2 className="panel-title">Invoice Preview &amp; Extracted Fields</h2>
      <div className="invoice-preview-split" ref={splitRef}>
        <div className="invoice-preview-pane" ref={paneRef} style={{ flexBasis: `${splitRatio * 100}%` }}>
          <PdfPane
            document={document}
            pdfUrl={pdfUrl}
            pdfLoading={pdfLoading}
            pdfError={pdfError}
            onExpand={() => setExpanded(true)}
          />
        </div>

        <PaneSplitter onMouseDown={startResize} />

        <div className="invoice-preview-fields-col">
          <ExtractedFieldsContent
            document={document}
            headerFields={headerFields}
            fieldsLoading={fieldsLoading}
            fieldsError={fieldsError}
            lineItems={lineItems}
          />
        </div>
      </div>

      {expanded && document && pdfUrl && (
        <PdfExpandModal
          document={document}
          pdfUrl={pdfUrl}
          headerFields={headerFields}
          fieldsLoading={fieldsLoading}
          fieldsError={fieldsError}
          lineItems={lineItems}
          onClose={() => setExpanded(false)}
        />
      )}
    </section>
  )
}
