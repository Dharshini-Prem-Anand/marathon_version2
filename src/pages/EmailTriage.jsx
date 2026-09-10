import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TriageQueueTable from '../components/TriageQueueTable'
import EmailPreviewPanel from '../components/EmailPreviewPanel'
import IntakeByChannel from '../components/IntakeByChannel'
import ValueDeliveredRow from '../components/ValueDeliveredRow'
import { useFilters, matchesOption, withLiveOptions } from '../hooks/useFilters'
import { emailTriageFilters, emailTriageStats } from '../data'
import {
  fetchAttachmentCategories,
  fetchEmailAttachments,
  fetchEmailMetadata,
  fetchTriageKpis,
} from '../api/invoiceAutomation'
import { ALL_DATES_RANGE, dateRangeFilter } from '../utils/dateRange'
import {
  KPI_UNAVAILABLE,
  kpiDateParams,
  kpiRangeSubtitle,
  mergeKpiStats,
  TRIAGE_KPI_FIELDS,
} from '../utils/kpiTiles'
import { mapIntakeByChannel, mapValueDelivered } from '../utils/kpiPanels'
import { buildRemotePreview, mapEmailAttachment, mapEmailMetadata } from '../utils/triageMappers'

const DEFAULT_DATE_RANGE = 'Today'

// Priority isn't set on any live row, so that filter only constrains rows that
// actually carry a value.
function matchesWhenKnown(selected, actual) {
  if (actual == null) return true
  return matchesOption(selected, actual)
}

// An email matches a category when any of its attachments was classified as
// that category — an email can carry several documents.
function matchesCategory(selected, categories) {
  return selected === 'All' || (categories ?? []).includes(selected)
}

export default function EmailTriage({ onNavigateToDocument, pendingSelectId, onPendingSelectConsumed }) {
  const { draft, applied, setField, apply } = useFilters(emailTriageFilters)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)
  const [selectedId, setSelectedId] = useState(null)

  const [emails, setEmails] = useState([])
  const [emailsLoading, setEmailsLoading] = useState(true)
  const [emailsError, setEmailsError] = useState(null)

  // MessageID -> the categories its attachments were classified as. Fetched
  // for the whole queue because the Proposed Category filter has to offer
  // every value in the data, not just the selected email's.
  const [categoriesByEmail, setCategoriesByEmail] = useState({})

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

  useEffect(() => {
    let cancelled = false

    fetchAttachmentCategories()
      .then((records) => {
        if (cancelled) return
        const byEmail = {}
        for (const record of records) {
          const category = String(record.ProposedCategory ?? '').trim()
          if (!category) continue
          const list = (byEmail[record.MessageID] ??= [])
          if (!list.includes(category)) list.push(category)
        }
        setCategoriesByEmail(byEmail)
      })
      // The queue itself doesn't depend on this; a failure just leaves the
      // Proposed Category filter with nothing to offer.
      .catch(() => {
        if (!cancelled) setCategoriesByEmail({})
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Every dropdown is filled from what came back: Source, Sender and Priority
  // from the emails, Proposed Category from their attachments' classification.
  // Priority is null on every live row today, so that one offers just 'All'.
  const filterFields = useMemo(
    () =>
      withLiveOptions(emailTriageFilters, {
        Source: emails.map((row) => row.source),
        Sender: emails.map((row) => row.vendor),
        'Proposed Category': Object.values(categoriesByEmail),
        Priority: emails.map((row) => row.priority),
      }),
    [emails, categoriesByEmail]
  )

  // Every row is live; the Date Range filter narrows them by when the email
  // was received rather than switching the page to a different data source.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  const filteredRows = emails
    .filter(
      (row) =>
        inDateRange(row.receivedDateTime) &&
        matchesOption(applied['Source'], row.source) &&
        matchesWhenKnown(applied['Sender'], row.vendor) &&
        matchesCategory(applied['Proposed Category'], categoriesByEmail[row.id]) &&
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

  // The same response carries the three panels below the queue.
  const intake = useMemo(() => mapIntakeByChannel(kpis), [kpis])
  const valueDelivered = useMemo(() => mapValueDelivered(kpis), [kpis])
  const rangeSubtitle = kpiRangeSubtitle(appliedDateRange)

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
        fields={filterFields}
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
        <IntakeByChannel channels={intake?.channels} total={intake?.total} rangeLabel={rangeSubtitle} />
        <ValueDeliveredRow items={valueDelivered} rangeLabel={rangeSubtitle} />
      </div>

    </>
  )
}
