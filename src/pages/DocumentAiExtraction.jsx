import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import LineItemExtraction from '../components/LineItemExtraction'
import PainPointTable from '../components/PainPointTable'
import LearningModelPerformance from '../components/LearningModelPerformance'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { documentAiFilters, documentAiStats } from '../data'
import {
  fetchDocumentPdf,
  fetchDocumentQueue,
  fetchExtractedHeaderFields,
  fetchExtractedLineItemFields,
} from '../api/invoiceAutomation'
import { groupLineItemFields, mapDocumentRow, mapHeaderField } from '../utils/documentMappers'

const LOW_CONFIDENCE_THRESHOLD = 80

export default function DocumentAiExtraction({ pendingSelectId, onPendingSelectConsumed, onNavigate }) {
  const { draft, applied, setField, apply } = useFilters(documentAiFilters)
  const [selectedId, setSelectedId] = useState(null)

  const [documents, setDocuments] = useState([])
  const [documentsLoading, setDocumentsLoading] = useState(true)
  const [documentsError, setDocumentsError] = useState(null)

  const [headerFields, setHeaderFields] = useState([])
  const [lineItems, setLineItems] = useState({ columns: [], rows: [] })
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [fieldsError, setFieldsError] = useState(null)

  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setDocumentsLoading(true)
    setDocumentsError(null)

    fetchDocumentQueue()
      .then((records) => {
        if (cancelled) return
        setDocuments(records.map(mapDocumentRow))
      })
      .catch((err) => {
        if (cancelled) return
        setDocuments([])
        setDocumentsError(`Could not load documents — ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setDocumentsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // A deep link from Email & Attachment Triage arrives as a documentId; once
  // that document has loaded into the queue, select it and clear the pending flag.
  useEffect(() => {
    if (!pendingSelectId) return
    if (!documents.some((d) => d.id === pendingSelectId)) return
    setSelectedId(pendingSelectId)
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId, documents])

  const filteredQueue = documents.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Invoice Channel'], row.channel) &&
      (applied['Status'] === 'All' || row.status == null || row.status === applied['Status'])
  )

  const selectedDoc = filteredQueue.find((d) => d.id === selectedId) ?? filteredQueue[0] ?? null
  const docKey = selectedDoc ? `${selectedDoc.messageId}::${selectedDoc.fileName}` : null

  // Header fields and line items are keyed by the same (MessageID, FileName).
  useEffect(() => {
    if (!selectedDoc) {
      setHeaderFields([])
      setLineItems({ columns: [], rows: [] })
      setFieldsError(null)
      setFieldsLoading(false)
      return
    }

    let cancelled = false
    const { messageId, fileName } = selectedDoc
    setFieldsLoading(true)
    setFieldsError(null)

    Promise.all([
      fetchExtractedHeaderFields(messageId, fileName),
      fetchExtractedLineItemFields(messageId, fileName),
    ])
      .then(([header, lines]) => {
        if (cancelled) return
        setHeaderFields(header.map(mapHeaderField))
        setLineItems(groupLineItemFields(lines))
      })
      .catch((err) => {
        if (cancelled) return
        setHeaderFields([])
        setLineItems({ columns: [], rows: [] })
        setFieldsError(`Could not load extracted fields — ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setFieldsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey])

  // The PDF bytes come from the Python service, fetched as a blob so the
  // Authorization header can be attached, then bound to the iframe.
  const dieDocumentId = selectedDoc?.dieDocumentId ?? null

  useEffect(() => {
    if (!dieDocumentId) {
      setPdfUrl(null)
      setPdfError(selectedDoc ? 'No DIE document ID on this record.' : null)
      setPdfLoading(false)
      return
    }

    let cancelled = false
    let objectUrl = null
    setPdfLoading(true)
    setPdfError(null)

    fetchDocumentPdf(dieDocumentId)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch((err) => {
        if (cancelled) return
        setPdfUrl(null)
        setPdfError(err.message)
      })
      .finally(() => {
        if (!cancelled) setPdfLoading(false)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dieDocumentId])

  const stats = useMemo(() => {
    const total = documents.length
    const lowConfidence = documents.filter(
      (d) => Number.isFinite(d.confidenceValue) && d.confidenceValue < LOW_CONFIDENCE_THRESHOLD
    ).length

    return documentAiStats.map((stat) => {
      if (stat.label === 'Documents Processed') {
        return { ...stat, value: documentsLoading ? '…' : total.toLocaleString(), target: null }
      }
      if (stat.label === 'Low Confidence') {
        return { ...stat, value: documentsLoading ? '…' : String(lowConfidence) }
      }
      return stat
    })
  }, [documents, documentsLoading])

  return (
    <>
      <FilterBar fields={documentAiFilters} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={stats} />

      <div className="docai-main-grid">
        <DocumentQueueTable
          rows={filteredQueue}
          selectedId={selectedDoc?.id ?? null}
          onSelect={setSelectedId}
          loading={documentsLoading}
          error={documentsError}
        />
        <InvoicePreviewPanel
          document={selectedDoc}
          headerFields={headerFields}
          fieldsLoading={fieldsLoading}
          fieldsError={fieldsError}
          pdfUrl={pdfUrl}
          pdfLoading={pdfLoading}
          pdfError={pdfError}
          onNavigate={onNavigate}
        />
      </div>

      <div className="doc-ai-secondary-grid">
        <FormatPerformanceChart />
        <LineItemExtraction
          columns={lineItems.columns}
          rows={lineItems.rows}
          loading={fieldsLoading}
          error={fieldsError}
          hasDocument={Boolean(selectedDoc)}
        />
        <PainPointTable />
      </div>

      <LearningModelPerformance />
    </>
  )
}

