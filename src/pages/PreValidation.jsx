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
} from '../data'
import { FIELD_RULE_CATEGORY } from '../utils/preValidationMappers'
import { fetchPreValidation } from '../api/invoiceAutomation'
import { buildPreValidationRecords } from '../utils/preValidationRules'
import { isTodayRange } from '../utils/dateRange'

const DEFAULT_DATE_RANGE = 'Today'

const CONFIDENCE_BAND_BY_BADGE = {
  'HIGH CONFIDENCE': 'High (90-100%)',
  'MEDIUM CONFIDENCE': 'Medium (70-89%)',
  'LOW CONFIDENCE': 'Low (< 70%)',
}

// Row-level vendor labels matching vendorOptions casing — seed rows only; live
// rows carry the vendor straight from PreValidation.
const VENDOR_BY_ID = {
  'INV-2025-10456': 'Global Industrial Supply',
  'INV-2025-10412': 'Office Depot',
  'INV-2025-10398': 'Cintas Corporation',
  'INV-2025-10422': 'Verizon Wireless',
  'CM-2025-10077': 'Grainger',
}

// Seed data shown for any date range other than Today — PreValidation has no
// historical window to page through yet. Reshaped to the same { ids, records }
// contract buildPreValidationRecords returns so both sources render alike.
const MOCK_DATA = (() => {
  const ids = [...preValidationQueue]
  const records = {}
  for (const id of ids) {
    const record = preValidationRecords[id]
    records[id] = {
      ...record,
      invoiceNumber: id,
      vendor: VENDOR_BY_ID[id] ?? record.invoice.vendorName,
      amount: record.invoice.grossAmount.replace(' USD', ''),
    }
  }
  return { ids, records }
})()

// Document Type / Confidence Band / Validation Status all come off the
// invoice's own rule set, so the filters work the same for live and seed rows.
function deriveAttributes(record, rules) {
  const failedCount = rules.filter((r) => r.result === 'failed').length
  const reviewCount = rules.filter((r) => r.result === 'review').length

  return {
    vendor: record.vendor,
    documentType: record.documentClassification.find((d) => d.selected)?.label ?? 'Invoice',
    confidenceBand: CONFIDENCE_BAND_BY_BADGE[record.invoice.confidenceBadge] ?? '—',
    validationStatus: failedCount > 0 ? 'Failed' : reviewCount > 0 ? 'Review' : 'Passed',
  }
}

export default function PreValidation({ onNavigate, onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(preValidationFilters)
  const [selectedId, setSelectedId] = useState(null)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  // The queue, the invoice preview, the rule results and the vendor/payee
  // panel all come from PreValidation — one call, keyed by invoice.
  const [liveData, setLiveData] = useState({ ids: [], records: {} })
  const [liveError, setLiveError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLiveError(null)

    fetchPreValidation()
      .then((rows) => {
        if (cancelled) return
        setLiveData(buildPreValidationRecords(rows))
      })
      .catch((err) => {
        if (cancelled) return
        setLiveData({ ids: [], records: {} })
        setLiveError(`Could not load pre-validation data — ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // A field correction marks that field's rule as passed, for that invoice only.
  const [ruleOverrides, setRuleOverrides] = useState({})

  const showLive = isTodayRange(appliedDateRange)
  const { ids, records } = showLive ? liveData : MOCK_DATA

  const rulesFor = (id) => ruleOverrides[id] ?? records[id]?.validationRuleResults ?? []

  // Vendor options come from the loaded data — the seed list holds different
  // names, so a static dropdown would filter every live row out.
  const filterFields = useMemo(() => {
    const vendors = [...new Set(ids.map((id) => records[id].vendor))].sort()
    return preValidationFilters.map((f) =>
      f.label === 'Vendor' ? { ...f, options: ['All', ...vendors] } : f
    )
  }, [ids, records])

  const filteredQueue = ids.filter((id) => {
    const attrs = deriveAttributes(records[id], rulesFor(id))
    return (
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], attrs.vendor) &&
      matchesOption(applied['Document Type'], attrs.documentType) &&
      matchesOption(applied['Confidence Band'], attrs.confidenceBand) &&
      matchesOption(applied['Validation Status'], attrs.validationStatus)
    )
  })

  const selectedRecordId = filteredQueue.includes(selectedId) ? selectedId : filteredQueue[0] ?? null
  const selectedRecord = selectedRecordId ? records[selectedRecordId] : null
  const selectedRules = selectedRecordId ? rulesFor(selectedRecordId) : []

  const handleCorrectField = (fieldKey) => {
    const category = FIELD_RULE_CATEGORY[fieldKey]
    if (!category || !selectedRecordId) return
    setRuleOverrides((prev) => ({
      ...prev,
      [selectedRecordId]: rulesFor(selectedRecordId).map((r) =>
        r.category === category ? { ...r, result: 'passed', confidence: '99%', issue: '—' } : r
      ),
    }))
  }

  const queueRows = filteredQueue.map((id) => {
    const record = records[id]
    const attrs = deriveAttributes(record, rulesFor(id))
    return {
      id,
      invoiceNumber: record.invoiceNumber ?? id,
      vendor: attrs.vendor,
      amount: record.amount,
      status: attrs.validationStatus,
    }
  })

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
        fields={filterFields}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        onGo={handleGo}
        hideAdaptLink
      />
      <StatsRow stats={stats} />

      {selectedRecord ? (
        <>
          <div className="pv-page-grid">
            <PreValidationQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="pv-main-grid">
                <InvoicePreviewValidation
                  invoice={selectedRecord.invoice}
                  rules={selectedRules}
                  onCorrectField={(fieldKey) => handleCorrectField(fieldKey)}
                />
                <ValidationRuleResults rules={selectedRules} />
                <VendorPayeePanel vendorPayee={selectedRecord.vendorPayeeValidation} />
              </div>

              <PreValidationPipelinePanel
                invoice={selectedRecord.invoice}
                validationRuleResults={selectedRules}
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
      ) : (
        <FilterEmptyState
          message={(showLive && liveError) || 'No invoice matches the selected filters.'}
        />
      )}
    </>
  )
}
