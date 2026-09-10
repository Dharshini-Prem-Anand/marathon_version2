import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TriageQueueTable from '../components/TriageQueueTable'
import EmailPreviewPanel from '../components/EmailPreviewPanel'
import IntakeByChannel from '../components/IntakeByChannel'
import PreprocessingMetrics from '../components/PreprocessingMetrics'
import ValueDeliveredRow from '../components/ValueDeliveredRow'
import { useFilters, matchesOption } from '../hooks/useFilters'
import { emailTriageFilters, emailTriageStats } from '../data'
import { fetchEmailAttachments, fetchEmailMetadata, fetchTriageKpis } from '../api/invoiceAutomation'
import { ALL_DATES_RANGE, dateRangeFilter } from '../utils/dateRange'
import {
  KPI_UNAVAILABLE,
  kpiDateParams,
  kpiRangeSubtitle,
  mergeKpiStats,
  TRIAGE_KPI_FIELDS,
} from '../utils/kpiTiles'
import { buildRemotePreview, mapEmailAttachment, mapEmailMetadata } from '../utils/triageMappers'

const DEFAULT_DATE_RANGE = 'Today'

// Category / Priority aren't known for live rows until their attachments load,
// so those filters only constrain rows that actually carry the value.
function matchesWhenKnown(selected, actual) {
  if (actual == null) return true
  return matchesOption(selected, actual)
}

export default function EmailTriage({ onNavigateToDocument, pendingSelectId, onPendingSelectConsumed }) {
  const { draft, applied, setField, apply } = useFilters(emailTriageFilters)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)
  const [selectedId, setSelectedId] = useState(null)

  const [emails, setEmails] = useState([])
  const [emailsLoading, setEmailsLoading] = useState(true)
  const [emailsError, setEmailsError] = useState(null)

  const [attachments, setAttachments] = useState([])
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const [attachmentsError, setAttachmentsError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setEmailsLoading(true)
    setEmailsError(null)

    fetchEmailMetadata()
      .then((records) => {
        if (cancelled) return
        setEmails(records.map(mapEmailMetadata))
      })
      .catch((err) => {
        if (cancelled) return
        setEmails([])
        setEmailsError(`Could not load emails — ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setEmailsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Every row is live; the Date Range filter narrows them by when the email
  // was received rather than switching the page to a different data source.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  const filteredRows = emails
    .filter(
      (row) =>
        inDateRange(row.receivedDateTime) &&
        matchesOption(applied['Source'], row.source) &&
        matchesWhenKnown(applied['Sender / Vendor'], row.vendor) &&
        matchesWhenKnown(applied['Proposed Category'], row.category) &&
        matchesWhenKnown(applied['Priority'], row.priority)
    )
    // Newest first — the order the queue table opens in, so the email
    // previewed by default is its top row and not whichever one the service
    // happened to return first.
    .sort((a, b) => new Date(b.receivedDateTime ?? 0) - new Date(a.receivedDateTime ?? 0))

  // Arriving from a document's "Source Email" link: select that email once its
  // row has loaded. Rows are keyed by MessageID, which is what the link sends.
  // Each page keeps its own Date Range, so the linked email can sit outside
  // this one's window — drop the constraint rather than land on another email.
  useEffect(() => {
    if (!pendingSelectId) return
    const target = emails.find((r) => r.id === pendingSelectId)
    if (!target) return
    setSelectedId(pendingSelectId)
    if (!inDateRange(target.receivedDateTime)) {
      setDateRange(ALL_DATES_RANGE)
      setAppliedDateRange(ALL_DATES_RANGE)
    }
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId, emails])

  const selectedRow = filteredRows.find((r) => r.id === selectedId) ?? filteredRows[0] ?? null
  const previewId = selectedRow?.id ?? null
  const selectedMessageId = selectedRow?.messageId ?? null

  useEffect(() => {
    if (!selectedMessageId) {
      setAttachments([])
      setAttachmentsError(null)
      setAttachmentsLoading(false)
      return
    }

    let cancelled = false
    setAttachmentsLoading(true)
    setAttachmentsError(null)

    fetchEmailAttachments(selectedMessageId)
      .then((records) => {
        if (cancelled) return
        setAttachments(records.map(mapEmailAttachment))
      })
      .catch((err) => {
        if (cancelled) return
        setAttachments([])
        setAttachmentsError(`Could not load attachments — ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setAttachmentsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedMessageId])

  const preview = useMemo(
    () => (selectedRow ? buildRemotePreview(selectedRow, attachments) : null),
    [selectedRow, attachments]
  )

  // Document AI & Extraction keys its queue by (MessageID, FileName), so a
  // direct link only resolves once the attachments have loaded.
  const documentId = useMemo(() => {
    if (!selectedRow) return null
    const primary = attachments[0]
    if (!primary) return null
    return `${selectedRow.messageId}::${primary.fileName}`
  }, [selectedRow, attachments])

  // The stepper reads category / confidence off the row; those come from the
  // leading attachment.
  const stepperRow = useMemo(() => {
    if (!selectedRow) return null
    return {
      ...selectedRow,
      category: attachments[0]?.category ?? '—',
      confidence: attachments[0]?.confidence ?? '0%',
    }
  }, [selectedRow, attachments])

  // The tile row comes from /triageKpis, over whatever window the Date Range
  // filter has applied. null until it answers, so the tiles show a placeholder
  // instead of the sample numbers they're defined with.
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchTriageKpis(kpiDateParams(appliedDateRange))
      .then((res) => {
        if (!cancelled) setKpis(res)
      })
      .catch(() => {
        if (!cancelled) setKpis(KPI_UNAVAILABLE)
      })

    return () => {
      cancelled = true
    }
  }, [appliedDateRange])

  const stats = useMemo(() => {
    const merged = mergeKpiStats(emailTriageStats, TRIAGE_KPI_FIELDS, kpis)
    // This tile counts arrivals over the applied window, so it says which
    // window under the number instead of hard-coding "Today" in the label.
    return merged.map((stat) =>
      stat.label === 'Emails Received' ? { ...stat, target: kpiRangeSubtitle(appliedDateRange) } : stat
    )
  }, [kpis, appliedDateRange])

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  return (
    <>
      <FilterBar
        fields={emailTriageFilters}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        onGo={handleGo}
      />
      <StatsRow stats={stats} />

      <div className="triage-main-grid">
        <TriageQueueTable
          rows={filteredRows}
          selectedId={previewId}
          onSelect={setSelectedId}
          loading={emailsLoading}
          error={emailsError}
        />
        {previewId && (
          <EmailPreviewPanel
            row={stepperRow}
            preview={preview}
            loadingAttachments={Boolean(selectedMessageId) && attachmentsLoading}
            attachmentsError={attachmentsError}
            documentId={documentId}
            onNavigateToDocument={onNavigateToDocument}
          />
        )}
      </div>

      <div className="triage-secondary-grid">
        <IntakeByChannel />
        <PreprocessingMetrics />
      </div>

      <ValueDeliveredRow />
    </>
  )
}
