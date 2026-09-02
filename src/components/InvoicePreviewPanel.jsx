import { FileText } from 'lucide-react'
import DocAiPipelineStepper from './DocAiPipelineStepper'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

function PdfPane({ document, pdfUrl, pdfLoading, pdfError }) {
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
  return <iframe className="pdf-pane" src={pdfUrl} title={document.fileName} />
}

export default function InvoicePreviewPanel({
  document,
  headerFields = [],
  fieldsLoading,
  fieldsError,
  pdfUrl,
  pdfLoading,
  pdfError,
  onNavigate,
}) {
  return (
    <section className="panel invoice-preview">
      <h2 className="panel-title">Invoice Preview &amp; Extracted Fields</h2>
      <div className="invoice-preview-grid">
        <PdfPane document={document} pdfUrl={pdfUrl} pdfLoading={pdfLoading} pdfError={pdfError} />

        <div className="extracted-fields">
          <table className="table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '42%' }} />
              <col style={{ width: '28%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Field</th>
                <th>Extracted Value</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {!document ? (
                <tr>
                  <td colSpan={3} className="table-empty-cell">
                    Select a document.
                  </td>
                </tr>
              ) : fieldsLoading ? (
                <tr>
                  <td colSpan={3} className="table-empty-cell">
                    Loading fields…
                  </td>
                </tr>
              ) : fieldsError ? (
                <tr>
                  <td colSpan={3} className="table-empty-cell">
                    {fieldsError}
                  </td>
                </tr>
              ) : headerFields.length === 0 ? (
                <tr>
                  <td colSpan={3} className="table-empty-cell">
                    No header fields extracted for this document.
                  </td>
                </tr>
              ) : (
                headerFields.map((f, i) => (
                  <tr key={`${f.key}-${i}`}>
                    <td className="cell-ellipsis" title={f.field}>
                      {f.field}
                    </td>
                    <td className="cell-ellipsis" title={f.value}>
                      {f.value}
                    </td>
                    <td>
                      <span className={`confidence-badge confidence-${confidenceClass(f.confidence)}`}>
                        {f.confidence}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className="btn-primary btn-block">Accept High Confidence</button>
          <button className="btn-outline btn-block">Correct Field</button>
          <button className="btn-outline btn-block btn-outline-red">Route to Review</button>
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
    </section>
  )
}

