import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import PreValidationQueueTable from '../components/PreValidationQueueTable'
import InvoicePreviewValidation from '../components/InvoicePreviewValidation'
import ValidationRuleResults from '../components/ValidationRuleResults'
import VendorPayeePanel from '../components/VendorPayeePanel'
import PreValidationPipelinePanel from '../components/PreValidationPipelinePanel'
import TopRuleFailureDrivers from '../components/TopRuleFailureDrivers'
import PreventedExceptionsByType from '../components/PreventedExceptionsByType'
import CorrectionHistoryModelLearning from '../components/CorrectionHistoryModelLearning'
import ApprovalBanner from '../components/ApprovalBanner'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import {
  preValidationFilters,
  preValidationStats,
  preValidationQueue,
  preValidationRecords,
  validationRuleResults,
  vendorPayeeValidation,
} from '../data'
import { FIELD_RULE_CATEGORY } from '../utils/preValidationMappers'
import { fetchInvoices } from '../api/invoiceAutomation'
import { buildInvoiceSummaries, buildInvoicePreviews } from '../utils/matchingMappers'
import { isTodayRange } from '../utils/dateRange'

const DEFAULT_DATE_RANGE = 'Today'

// The queue's Document Type / Confidence Band / Validation Status columns
// have no CAP source yet, so every live invoice gets the same placeholder
// classification for now.
const UNVALIDATED_ATTRS = {
  documentType: 'Invoice',
  confidenceBand: '—',
  validationStatus: 'Review',
}

const CONFIDENCE_BAND_BY_BADGE = {
  'HIGH CONFIDENCE': 'High (90-100%)',
  'MEDIUM CONFIDENCE': 'Medium (70-89%)',
  'LOW CONFIDENCE': 'Low (< 70%)',
}

// Row-level vendor labels matching vendorOptions casing — the invoice
// preview itself displays the vendor name in caps.
const VENDOR_BY_ID = {
  'INV-2025-10456': 'Global Industrial Supply',
  'INV-2025-10412': 'Office Depot',
  'INV-2025-10398': 'Cintas Corporation',
  'INV-2025-10422': 'Verizon Wireless',
  'CM-2025-10077': 'Grainger',
}

function mockAttrs(id, record) {
  const failedCount = record.validationRuleResults.filter((r) => r.result === 'failed').length
  const reviewCount = record.validationRuleResults.filter((r) => r.result === 'review').length
  return {
    vendor: VENDOR_BY_ID[id] ?? record.invoice.vendorName,
    documentType: record.documentClassification.find((d) => d.selected)?.label ?? 'Invoice',
    confidenceBand: CONFIDENCE_BAND_BY_BADGE[record.invoice.confidenceBadge] ?? 'High (90-100%)',
    validationStatus: failedCount > 0 ? 'Failed' : reviewCount > 0 ? 'Review' : 'Passed',
  }
}

// Seed data shown for any date range other than Today — the CAP /Invoices
// data has no historical window to page through yet.
const MOCK_QUEUE = preValidationQueue.map((id) => {
  const record = preValidationRecords[id]
  return {
    id,
    invoiceNumber: id,
    amount: record.invoice.grossAmount.replace(' USD', ''),
    ...mockAttrs(id, record),
  }
})
const MOCK_PREVIEWS = Object.fromEntries(preValidationQueue.map((id) => [id, preValidationRecords[id].invoice]))

export default function PreValidation({ onNavigate, onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(preValidationFilters)
  const [selectedId, setSelectedId] = useState(null)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  // Document Pre Validation Queue and the Selected Invoice Preview both bind
  // to the same live CAP /Invoices data the PO & Line Matching page uses,
  // but only for the Today range — any other range falls back to the seed
  // queue above, same as Document AI & Extraction does.
  const [liveQueue, setLiveQueue] = useState([])
  const [livePreviews, setLivePreviews] = useState({})
  const [liveError, setLiveError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLiveError(null)

    fetchInvoices()
      .then((invoices) => {
        if (cancelled) return
        setLiveQueue(buildInvoiceSummaries(invoices).map((row) => ({ ...row, ...UNVALIDATED_ATTRS })))
        setLivePreviews(buildInvoicePreviews(invoices))
      })
      .catch((err) => {
        if (cancelled) return
        setLiveQueue([])
        setLivePreviews({})
        setLiveError(`Could not load invoice queue — ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Validation Rule Results and Vendor & Payee Validation have no CAP entity
  // yet, so they stay on fixed sample data — the same panel content no
  // matter which invoice is selected in the queue.
  const [rules, setRules] = useState(validationRuleResults)

  const handleCorrectField = (fieldKey) => {
    const category = FIELD_RULE_CATEGORY[fieldKey]
    setRules((prev) =>
      prev.map((r) => (r.category === category ? { ...r, result: 'passed', confidence: '99%', issue: '—' } : r))
    )
  }

  const showLive = isTodayRange(appliedDateRange)
  const sourceQueue = showLive ? liveQueue : MOCK_QUEUE
  const sourcePreviews = showLive ? livePreviews : MOCK_PREVIEWS

  const filteredQueue = sourceQueue.filter((row) => {
    return (
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Document Type'], row.documentType) &&
      matchesOption(applied['Confidence Band'], row.confidenceBand) &&
      matchesOption(applied['Validation Status'], row.validationStatus)
    )
  })

  const selectedRecordId = filteredQueue.some((row) => row.id === selectedId)
    ? selectedId
    : filteredQueue[0]?.id ?? null
  const selectedInvoice = selectedRecordId ? sourcePreviews[selectedRecordId] : null

  const queueRows = filteredQueue.map((row) => ({
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    vendor: row.vendor,
    amount: row.amount,
    status: row.validationStatus,
  }))

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  // "Pending Pre-Validation" tracks the queue table below it — the rest of
  // the tiles have no live source yet, so they stay on their sample values.
  const stats = useMemo(
    () =>
      preValidationStats.map((stat) =>
        stat.label === 'Pending Pre-Validation'
          ? { ...stat, value: filteredQueue.length.toLocaleString() }
          : stat
      ),
    [filteredQueue]
  )

  return (
    <>
      <FilterBar
        fields={preValidationFilters}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        onGo={handleGo}
        hideAdaptLink
      />
      <StatsRow stats={stats} />

      {filteredQueue.length === 0 ? (
        <FilterEmptyState message={(showLive && liveError) || 'No invoice matches the selected filters.'} />
      ) : (
        <>
          <div className="pv-page-grid">
            <PreValidationQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="pv-main-grid">
                <InvoicePreviewValidation
                  invoice={selectedInvoice}
                  rules={rules}
                  onCorrectField={(fieldKey) => handleCorrectField(fieldKey)}
                />
                <ValidationRuleResults rules={rules} />
                <VendorPayeePanel vendorPayee={vendorPayeeValidation} />
              </div>

              <PreValidationPipelinePanel
                invoice={selectedInvoice}
                validationRuleResults={rules}
                invoiceId={selectedRecordId}
                onNavigate={onNavigate}
                onNavigateToException={onNavigateToException}
              />
            </div>
          </div>

          <div className="doc-ai-secondary-grid">
            <TopRuleFailureDrivers />
            <PreventedExceptionsByType />
            <CorrectionHistoryModelLearning />
          </div>

          <ApprovalBanner />
        </>
      )}
    </>
  )
}
