import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import DocAiPipelineStepper from '../components/DocAiPipelineStepper'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import PainPointTable from '../components/PainPointTable'
import LearningModelPerformance from '../components/LearningModelPerformance'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { documentAiFilters, documentAiStats } from '../data'
import {
  fetchDocumentPdf,
  fetchDocumentQueue,
  fetchExtractedHeaderFields,
  fetchExtractedLineItemFields,
  reprocessExtraction,
} from '../api/invoiceAutomation'
import { groupLineItemFields, mapDocumentRow, mapHeaderField } from '../utils/documentMappers'
import { ALL_DATES_RANGE, dateRangeFilter } from '../utils/dateRange'

const LOW_CONFIDENCE_THRESHOLD = 80
const DEFAULT_DATE_RANGE = 'Today'

export default function DocumentAiExtraction({ pendingSelectId, onPendingSelectConsumed, onNavigate, onNavigateToEmail }) {
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
  const [refreshKey, setRefreshKey] = useState(0)
  const [rerunning, setRerunning] = useState(false)
  const [rerunError, setRerunError] = useState(null)
  const [showFormatDiagnostics, setShowFormatDiagnostics] = useState(false)

  const statsActions = useMemo(
    () => ({
      'Overall Extraction Accuracy': {
        label: showFormatDiagnostics ? 'Hide Format Diagnostics' : 'View Format Diagnostics',
        onClick: () => setShowFormatDiagnostics((v) => !v),
      },
    }),
    [showFormatDiagnostics]
  )

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
  }, [refreshKey])

  // Every row is live; the Date Range filter narrows them by when the email
  // carrying the document was received, rather than switching the page to a
  // different data source.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  // A deep link from Email & Attachment Triage arrives as a documentId; once
  // that document has loaded into the queue, select it and clear the pending
  // flag. Each page keeps its own Date Range, so the linked document can sit
  // outside this one's window — drop the constraint rather than land on
  // another document.
  useEffect(() => {
    if (!pendingSelectId) return
    const target = documents.find((d) => d.id === pendingSelectId)
    if (!target) return
    setSelectedId(pendingSelectId)
    if (!inDateRange(target.receivedDateTime)) {
      setDateRange(ALL_DATES_RANGE)
      setAppliedDateRange(ALL_DATES_RANGE)
    }
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId, documents])

  const filteredQueue = documents
    .filter(
      (row) =>
        inDateRange(row.receivedDateTime) &&
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
  }, [docKey, refreshKey])

  // The PDF bytes come from the Python service, fetched as a blob so the
  // Authorization header can be attached, then bound to the iframe.
  const dieDocumentId = selectedDoc?.dieDocumentId ?? null

  useEffect(() => {
    if (!dieDocumentId) {
      setPdfUrl(null)
      setPdfError(
        selectedDoc ? 'No DIE document ID on this record.' : null
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
    // from "no selection yet" to a row that has no DIE id, so docKey is
    // needed too or this effect silently never re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, dieDocumentId])

  const statsLoading = documentsLoading

  // The tiles count the queue as filtered, so the Date Range and the other
  // filters visibly move them.
  const stats = useMemo(() => {
    const total = filteredQueue.length
    const lowConfidence = filteredQueue.filter(
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
  }, [filteredQueue, statsLoading])

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  // Re-runs extraction, then reloads the queue AND the field tables. The
  // queue reload matters as much as the fields: the service issues a new DIE
  // job and deletes the old one, so the row's DieDocumentID goes stale and the
  // PDF pane would point at a job that no longer exists.
  const handleRerun = () => {
    if (!dieDocumentId) return
    setRerunning(true)
    setRerunError(null)

    reprocessExtraction(dieDocumentId)
      .then(() => setRefreshKey((k) => k + 1))
      .catch((err) => setRerunError(`Could not re-run extraction — ${err.message}`))
      .finally(() => setRerunning(false))
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
      <StatsRow stats={stats} actions={statsActions} />

      <div className={`docai-top-tiles${showFormatDiagnostics ? '' : ' docai-top-tiles-no-chart'}`}>
        <DocumentQueueTable
          rows={filteredQueue}
          selectedId={selectedDoc?.id ?? null}
          onSelect={setSelectedId}
          loading={documentsLoading}
          error={documentsError}
          onOpenEmail={onNavigateToEmail}
          wide={!showFormatDiagnostics}
        />
        {showFormatDiagnostics && (
          <FormatPerformanceChart onClose={() => setShowFormatDiagnostics(false)} />
        )}
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
        onRerun={handleRerun}
        rerunning={rerunning}
        rerunError={rerunError}
        canRerun={Boolean(dieDocumentId)}
      />

      {selectedDoc && (
        <section className="panel">
          <h2 className="panel-title">Processing Pipeline</h2>
          <DocAiPipelineStepper
            document={selectedDoc}
            headerFields={headerFields}
            fieldsError={fieldsError}
            onNavigate={onNavigate}
          />
        </section>
      )}
    </>
  )
}

