import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TriageQueueTable from '../components/TriageQueueTable'
import EmailPreviewPanel from '../components/EmailPreviewPanel'
import IntakeByChannel from '../components/IntakeByChannel'
import PreprocessingMetrics from '../components/PreprocessingMetrics'
import ValueDeliveredRow from '../components/ValueDeliveredRow'
import { useFilters, matchesOption } from '../hooks/useFilters'
import { emailTriageFilters, emailTriageStats, triageQueue } from '../data'
import { fetchEmailAttachments, fetchEmailMetadata } from '../api/invoiceAutomation'
import { dateRangeBounds, isTodayRange, mockRowDate } from '../utils/dateRange'
import { buildMockPreview, buildRemotePreview, mapEmailAttachment, mapEmailMetadata } from '../utils/triageMappers'

const DEFAULT_DATE_RANGE = 'Today'

// Category / Priority aren't known for live rows until their attachments load,
// so those filters only constrain rows that actually carry the value.
function matchesWhenKnown(selected, actual) {
  if (actual == null) return true
  return matchesOption(selected, actual)
}

export default function EmailTriage() {
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

  const showLive = isTodayRange(appliedDateRange)

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

  // Mock rows for every range other than Today, narrowed to the chosen window.
  const mockRows = useMemo(() => {
    const { start, end } = dateRangeBounds(appliedDateRange)
    return triageQueue
      .map((row, index) => ({ ...row, receivedDate: mockRowDate(row, index) }))
      .filter((row) => row.receivedDate >= start && row.receivedDate < end)
  }, [appliedDateRange])

  const sourceRows = showLive ? emails : mockRows

  const filteredRows = sourceRows.filter(
    (row) =>
      matchesOption(applied['Source'], row.source) &&
      matchesWhenKnown(applied['Sender / Vendor'], row.vendor) &&
      matchesWhenKnown(applied['Proposed Category'], row.category) &&
      matchesWhenKnown(applied['Priority'], row.priority)
  )

  const selectedRow = filteredRows.find((r) => r.id === selectedId) ?? filteredRows[0] ?? null
  const previewId = selectedRow?.id ?? null
  const selectedMessageId = selectedRow?.isRemote ? selectedRow.messageId : null

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

  const preview = useMemo(() => {
    if (!selectedRow) return null
    return selectedRow.isRemote ? buildRemotePreview(selectedRow, attachments) : buildMockPreview(selectedRow)
  }, [selectedRow, attachments])

  // The stepper reads category / confidence off the row; for live rows those
  // come from the leading attachment.
  const stepperRow = useMemo(() => {
    if (!selectedRow) return null
    if (!selectedRow.isRemote) return selectedRow
    return {
      ...selectedRow,
      category: attachments[0]?.category ?? '—',
      confidence: attachments[0]?.confidence ?? '0%',
    }
  }, [selectedRow, attachments])

  const stats = useMemo(
    () =>
      emailTriageStats.map((stat) =>
        stat.label === 'Emails Received Today'
          ? { ...stat, value: emailsLoading ? '…' : emails.length.toLocaleString() }
          : stat
      ),
    [emails.length, emailsLoading]
  )

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
          loading={showLive && emailsLoading}
          error={showLive ? emailsError : null}
        />
        {previewId && (
          <EmailPreviewPanel
            row={stepperRow}
            preview={preview}
            loadingAttachments={Boolean(selectedMessageId) && attachmentsLoading}
            attachmentsError={selectedRow?.isRemote ? attachmentsError : null}
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
