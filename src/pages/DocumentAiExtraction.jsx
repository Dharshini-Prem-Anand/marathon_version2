import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import DocAiPipelineStepper from '../components/DocAiPipelineStepper'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import { useFilters, matchesCompanyCode, matchesOption, withLiveOptions } from '../hooks/useFilters'
import { useSharedDateRange } from '../context/DateRangeContext'
import { documentAiFilters, documentAiStats } from '../data'
import {
  fetchDocumentPdf,
  fetchDocumentQueue,
  fetchExtractionKpis,
  fetchExtractedHeaderFields,
  fetchExtractedLineItemFields,
  fetchPipelineStatus,
  fetchVendorNameFields,
  reprocessExtraction,
} from '../api/invoiceAutomation'
import { groupLineItemFields, mapDocumentRow, mapHeaderField } from '../utils/documentMappers'
import { buildVendorNamesByDocument } from '../utils/vendorNames'
import { pipelineOutcome, pipelineRowsForDocument } from '../utils/pipelineStatus'
import { ALL_DATES_RANGE, dateRangeFilter } from '../utils/dateRange'
import { DOCUMENT_AI_KPI_FIELDS, KPI_UNAVAILABLE, kpiDateParams, mergeKpiStats } from '../utils/kpiTiles'
import { mapFormatPerformance } from '../utils/kpiPanels'

const DEFAULT_DATE_RANGE = 'Today'

export default function DocumentAiExtraction({ pendingSelectId, onPendingSelectConsumed, onNavigate, onNavigateToEmail }) {
  const { draft, applied, setField, apply, reset } = useFilters(documentAiFilters)
  const {
    dateRange,
    appliedDateRange,
    customRange,
    setDateRange,
    setCustomRange,
    applyDateRange,
    resetDateRange,
    setDateRangeImmediate,
  } = useSharedDateRange()
  const [selectedId, setSelectedId] = useState(null)

  const [documents, setDocuments] = useState([])
  const [documentsLoading, setDocumentsLoading] = useState(true)
  const [documentsError, setDocumentsError] = useState(null)

  const [headerFields, setHeaderFields] = useState([])
  // PipelineStatus rows for the selected document's email, narrowed to the
  // document itself once its invoice number is known.
  const [pipelineRows, setPipelineRows] = useState([])
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

    // The vendor on a row is the name the extraction read off the invoice, not
    // whoever mailed it in, so the queue and the extracted vendor-name fields
    // are fetched together and joined on (MessageID, FileName). A document
    // with no extraction yet simply has no vendor.
    Promise.all([fetchDocumentQueue(), fetchVendorNameFields().catch(() => [])])
      .then(([records, vendorFields]) => {
        if (cancelled) return
        const vendorByDocument = buildVendorNamesByDocument(vendorFields)
        setDocuments(
          records.map(mapDocumentRow).map((row) => ({ ...row, vendor: vendorByDocument[row.id] ?? '—' }))
        )
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

  // Invoice Channel, Vendor and Status are filled from the loaded documents —
  // Status especially: the live value is "Pending Review", which no hardcoded
  // list had, so that dropdown could never match a row. Vendor lists the
  // extracted vendor names. Company Code is left as defined; neither
  // EmailAttachments nor EmailMetadata carries one.
  const filterFields = useMemo(
    () =>
      withLiveOptions(documentAiFilters, {
        'Invoice Channel': documents.map((row) => row.channel),
        Vendor: documents.map((row) => row.vendor),
        Status: documents.map((row) => row.status),
      }),
    [documents]
  )

  // Every row is live; the Date Range filter narrows them by when the email
  // carrying the document was received, rather than switching the page to a
  // different data source.
  const inDateRange = useMemo(
    () => dateRangeFilter(appliedDateRange, undefined, customRange),
    [appliedDateRange, customRange]
  )

  // A deep link from Email & Attachment Triage arrives as a documentId; once
  // that document has loaded into the queue, select it and clear the pending
  // flag. The Date Range is shared across pages, so widening it here also
  // widens it wherever else it's shown — the linked document can sit outside
  // the current window, and dropping the constraint beats landing on another
  // document.
  useEffect(() => {
    if (!pendingSelectId) return
    const target = documents.find((d) => d.id === pendingSelectId)
    if (!target) return
    setSelectedId(pendingSelectId)
    if (!inDateRange(target.receivedDateTime)) {
      setDateRangeImmediate(ALL_DATES_RANGE)
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
      setPipelineRows([])
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
      // The pipeline record only decides whether the two actions are offered;
      // a failure to read it must not blank the fields.
      fetchPipelineStatus(messageId).catch(() => []),
    ])
      .then(([header, lines, pipeline]) => {
        if (cancelled) return
        setHeaderFields(header.map(mapHeaderField))
        setLineItems(groupLineItemFields(lines))
        setPipelineRows(pipeline)
      })
      .catch((err) => {
        if (cancelled) return
        setHeaderFields([])
        setLineItems({ columns: [], rows: [] })
        setPipelineRows([])
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

  // Re-run Extraction and Schema Configuration are the two ways to correct a
  // document, so they're only offered while there's something to correct: a
  // document whose whole pipeline succeeded is done, and both are hidden. They
  // stay visible while the pipeline outcome is unknown — nothing has run yet,
  // or PipelineStatus couldn't be read.
  const extractedInvoiceNumber = useMemo(
    () => headerFields.find((field) => String(field.key ?? '').toLowerCase() === 'invoicenumber')?.value ?? null,
    [headerFields]
  )

  const pipelineDone = useMemo(() => {
    if (!selectedDoc) return false
    const rows = pipelineRowsForDocument(pipelineRows, {
      fileName: selectedDoc.fileName,
      invoiceNumber: extractedInvoiceNumber,
    })
    return pipelineOutcome(rows) === 'success'
  }, [pipelineRows, selectedDoc, extractedInvoiceNumber])

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

  // Accuracy and timing come from /getExtractionKpis, over the applied window.
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchExtractionKpis(kpiDateParams(appliedDateRange, undefined, customRange))
      .then((res) => {
        if (!cancelled) setKpis(res)
      })
      .catch(() => {
        if (!cancelled) setKpis(KPI_UNAVAILABLE)
      })

    return () => {
      cancelled = true
    }
  }, [appliedDateRange, customRange])

  const formatPerformance = useMemo(() => mapFormatPerformance(kpis), [kpis])

  // Documents Processed is the one tile the page can count for itself — it
  // tracks the queue as filtered. Every other tile comes from the service.
  const stats = useMemo(() => {
    const local = documentAiStats.map((stat) =>
      stat.label === 'Documents Processed'
        ? { ...stat, value: statsLoading ? '…' : filteredQueue.length.toLocaleString(), target: null }
        : // "-0.4 min vs prior 7 days" is a sample trend the service doesn't
          // return, so it goes with the sample number.
          { ...stat, target: stat.label === 'Average Extraction Time' ? null : stat.target }
    )
    return mergeKpiStats(local, DOCUMENT_AI_KPI_FIELDS, kpis)
  }, [filteredQueue, statsLoading, kpis])

  const handleGo = () => {
    apply()
    applyDateRange()
  }

  const handleReset = () => {
    reset()
    resetDateRange()
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
        fields={filterFields}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onGo={handleGo}
        onReset={handleReset}
      />
      <StatsRow stats={stats} actions={statsActions} />

      <div className={`docai-top-tiles${showFormatDiagnostics ? '' : ' docai-top-tiles-no-chart'}`}>
        <DocumentQueueTable
          rows={filteredQueue}
          selectedId={selectedDoc?.id ?? null}
          revealSelected={selectedDoc?.id === selectedId}
          onSelect={setSelectedId}
          loading={documentsLoading}
          error={documentsError}
          onOpenEmail={onNavigateToEmail}
          wide={!showFormatDiagnostics}
        />
        {showFormatDiagnostics && (
          <FormatPerformanceChart
            rows={formatPerformance}
            loading={kpis == null}
            onClose={() => setShowFormatDiagnostics(false)}
          />
        )}
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
        showActions={!pipelineDone}
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

