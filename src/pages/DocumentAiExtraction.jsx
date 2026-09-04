import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import PainPointTable from '../components/PainPointTable'
import LearningModelPerformance from '../components/LearningModelPerformance'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { documentAiFilters, documentAiStats, documentAiQueue, documentAiFields } from '../data'
import {
  fetchDocumentPdf,
  fetchDocumentQueue,
  fetchExtractedHeaderFields,
  fetchExtractedLineItemFields,
} from '../api/invoiceAutomation'
import { groupLineItemFields, mapDocumentRow, mapHeaderField, formatReceived } from '../utils/documentMappers'
import { dateRangeBounds, isTodayRange, mockRowDate } from '../utils/dateRange'

const LOW_CONFIDENCE_THRESHOLD = 80
const DEFAULT_DATE_RANGE = 'Today'

export default function DocumentAiExtraction({ pendingSelectId, onPendingSelectConsumed, onNavigate }) {
  const { draft, applied, setField, apply } = useFilters(documentAiFilters)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)
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

  const showLive = isTodayRange(appliedDateRange)

  // Seed rows for every range other than Today, narrowed to the chosen
  // window — same mechanism Email Triage uses for its mockRows.
  const mockDocuments = useMemo(() => {
    const { start, end } = dateRangeBounds(appliedDateRange)
    return documentAiQueue
      .map((row, index) => ({ ...row, receivedDate: mockRowDate(row, index) }))
      .filter((row) => row.receivedDate >= start && row.receivedDate < end)
      .map((row) => ({
        ...row,
        receivedDateTime: row.receivedDate.toISOString(),
        received: formatReceived(row.receivedDate.toISOString()),
      }))
  }, [appliedDateRange])

  const sourceDocuments = showLive ? documents : mockDocuments

  const filteredQueue = sourceDocuments
    .filter(
      (row) =>
        matchesCompanyCode(applied['Company Code']) &&
        matchesOption(applied['Vendor'], row.vendor) &&
        matchesOption(applied['Invoice Channel'], row.channel) &&
        (applied['Status'] === 'All' || row.status == null || row.status === applied['Status'])
    )
    .sort((a, b) => new Date(b.receivedDateTime ?? 0) - new Date(a.receivedDateTime ?? 0))

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

    if (!selectedDoc.isRemote) {
      const seed = documentAiFields[selectedDoc.id]
      setHeaderFields(seed?.headerFields ?? [])
      setLineItems(seed?.lineItems ?? { columns: [], rows: [] })
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
      setPdfError(
        selectedDoc ? (selectedDoc.isRemote ? 'No DIE document ID on this record.' : 'Preview not available for sample data.') : null
      )
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
    // dieDocumentId alone isn't enough: it stays null across the transition
    // from "no selection yet" to "seed doc selected" (seed rows have no DIE
    // id), so docKey is needed too or this effect silently never re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, dieDocumentId])

  const statsLoading = showLive && documentsLoading

  const stats = useMemo(() => {
    const total = sourceDocuments.length
    const lowConfidence = sourceDocuments.filter(
      (d) => Number.isFinite(d.confidenceValue) && d.confidenceValue < LOW_CONFIDENCE_THRESHOLD
    ).length

    return documentAiStats.map((stat) => {
      if (stat.label === 'Documents Processed') {
        return { ...stat, value: statsLoading ? '…' : total.toLocaleString(), target: null }
      }
      if (stat.label === 'Low Confidence') {
        return { ...stat, value: statsLoading ? '…' : String(lowConfidence) }
      }
      return stat
    })
  }, [sourceDocuments, statsLoading])

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  return (
    <>
      <FilterBar
        fields={documentAiFilters}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        onGo={handleGo}
      />
      <StatsRow stats={stats} />

      <div className="docai-top-tiles">
        <DocumentQueueTable
          rows={filteredQueue}
          selectedId={selectedDoc?.id ?? null}
          onSelect={setSelectedId}
          loading={showLive && documentsLoading}
          error={showLive ? documentsError : null}
        />
        <FormatPerformanceChart />
        <PainPointTable />
        <LearningModelPerformance compact />
      </div>

      <InvoicePreviewPanel
        document={selectedDoc}
        headerFields={headerFields}
        fieldsLoading={fieldsLoading}
        fieldsError={fieldsError}
        lineItems={lineItems}
        pdfUrl={pdfUrl}
        pdfLoading={pdfLoading}
        pdfError={pdfError}
        onNavigate={onNavigate}
      />
    </>
  )
}

