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
import ApprovalBanner from '../components/ApprovalBanner'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption, withLiveOptions } from '../hooks/useFilters'
import { preValidationFilters, preValidationStats } from '../data'
import { buildInvoicePreviewFromExtractedFields, FIELD_RULE_CATEGORY } from '../utils/preValidationMappers'
import {
  fetchExtractedHeaderFieldsByInvoice,
  fetchPreValidation,
  fetchPreValidationKpis,
  fetchVendorNameFields,
} from '../api/invoiceAutomation'
import { buildPreValidationRecords } from '../utils/preValidationRules'
import { buildVendorNamesByInvoice } from '../utils/vendorNames'
import {
  KPI_UNAVAILABLE,
  kpiDateParams,
  kpiRangeSubtitle,
  mergeKpiStats,
  PRE_VALIDATION_KPI_FIELDS,
} from '../utils/kpiTiles'
import {
  mapPreventedExceptions,
  mapRuleFailureDrivers,
  preValidationTilePayload,
} from '../utils/kpiPanels'
import { dateRangeFilter, parseRowDate } from '../utils/dateRange'

const DEFAULT_DATE_RANGE = 'Today'

const CONFIDENCE_BAND_BY_BADGE = {
  'HIGH CONFIDENCE': 'High (90-100%)',
  'MEDIUM CONFIDENCE': 'Medium (70-89%)',
  'LOW CONFIDENCE': 'Low (< 70%)',
}

// The invoice's own CreationDate, unformatted, as a Date — what the queue
// sorts and the Date Range filter matches on. Missing/unparseable dates sort
// last regardless of direction (handled by useColumnSortFilter's null check).
function invoiceDateValue(record) {
  return parseRowDate(record?.creationDate)
}

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

    // Vendor names live in the extraction, not on PreValidation (whose
    // VendorName column is null on every row) — fetched alongside so the queue
    // renders once, with names already resolved.
    Promise.all([fetchPreValidation(), fetchVendorNameFields().catch(() => [])])
      .then(([rows, vendorFields]) => {
        if (cancelled) return
        setLiveData(buildPreValidationRecords(rows, buildVendorNamesByInvoice(vendorFields)))
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

  // The tile row comes from /preValidationKpis, over whatever window the Date
  // Range filter has applied. null until it answers, so the tiles show a
  // placeholder instead of the sample numbers they're defined with.
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchPreValidationKpis(kpiDateParams(appliedDateRange))
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

  // A field correction marks that field's rule as passed, for that invoice only.
  const [ruleOverrides, setRuleOverrides] = useState({})

  const { ids, records } = liveData

  // Every row is live; the Date Range filter narrows them by when the pipeline
  // wrote the row (managed createdAt), falling back to the invoice's own date
  // where that's missing.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  const rulesFor = (id) => ruleOverrides[id] ?? records[id]?.validationRuleResults ?? []

  // Every dropdown is filled from the loaded rows — a static list would offer
  // choices no live row can match. Company Code is left alone: PreValidation
  // carries no company code (null on every row).
  const filterFields = useMemo(() => {
    const attrs = ids.map((id) => deriveAttributes(records[id], rulesFor(id)))
    return withLiveOptions(preValidationFilters, {
      Vendor: attrs.map((a) => a.vendor),
      'Document Type': attrs.map((a) => a.documentType),
      'Confidence Band': attrs.map((a) => a.confidenceBand),
      'Validation Status': attrs.map((a) => a.validationStatus),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, records, ruleOverrides])

  const filteredQueue = ids
    .filter((id) => {
      const attrs = deriveAttributes(records[id], rulesFor(id))
      return (
        inDateRange(records[id].createdAt ?? records[id].creationDate) &&
        matchesCompanyCode(applied['Company Code']) &&
        matchesOption(applied['Vendor'], attrs.vendor) &&
        matchesOption(applied['Document Type'], attrs.documentType) &&
        matchesOption(applied['Confidence Band'], attrs.confidenceBand) &&
        matchesOption(applied['Validation Status'], attrs.validationStatus)
      )
    })
    // Latest invoice first, by actual invoice date — same ordering the queue
    // table defaults to, so the auto-selected invoice matches its top row.
    .sort((a, b) => {
      const dateA = invoiceDateValue(records[a])
      const dateB = invoiceDateValue(records[b])
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      return dateB.getTime() - dateA.getTime()
    })

  const selectedRecordId = filteredQueue.includes(selectedId) ? selectedId : filteredQueue[0] ?? null
  const selectedRecord = selectedRecordId ? records[selectedRecordId] : null
  const selectedRules = selectedRecordId ? rulesFor(selectedRecordId) : []

  // The Selected Invoice Preview panel prefers the DIE-extracted header/line
  // fields over /PreValidation's own (which for some invoices carries no
  // vendor name and no line-item description or UOM — see
  // preValidationRules.js). Falls back to selectedRecord.invoice untouched
  // when this fetch fails or the invoice has no extracted fields yet.
  const [extractedPreview, setExtractedPreview] = useState(null)

  useEffect(() => {
    if (!selectedRecordId) {
      setExtractedPreview(null)
      return
    }

    let cancelled = false
    fetchExtractedHeaderFieldsByInvoice(selectedRecordId)
      .then((rows) => {
        if (cancelled) return
        setExtractedPreview(buildInvoicePreviewFromExtractedFields(rows, selectedRecordId))
      })
      .catch(() => {
        if (cancelled) return
        setExtractedPreview(null)
      })

    return () => {
      cancelled = true
    }
  }, [selectedRecordId])

  // confidenceBadge isn't part of the extracted-fields shape (it comes from
  // validation rules, already on selectedRecord.invoice) — spreading
  // extractedPreview on top only overrides the fields it actually carries.
  const previewInvoice = selectedRecord
    ? { ...selectedRecord.invoice, ...(extractedPreview ?? {}) }
    : null

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
      date: invoiceDateValue(record),
    }
  })

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  // The tile numbers arrive nested under `preValidationKpis`; the same
  // response also carries the three panels at the bottom of the page.
  const stats = useMemo(
    () => mergeKpiStats(preValidationStats, PRE_VALIDATION_KPI_FIELDS, preValidationTilePayload(kpis)),
    [kpis]
  )
  const rangeSubtitle = kpiRangeSubtitle(appliedDateRange)
  const ruleFailureDrivers = useMemo(() => mapRuleFailureDrivers(kpis), [kpis])
  const preventedExceptions = useMemo(() => mapPreventedExceptions(kpis), [kpis])

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
                  invoice={previewInvoice}
                  rules={selectedRules}
                  onCorrectField={(fieldKey) => handleCorrectField(fieldKey)}
                />
                <ValidationRuleResults rules={selectedRules} />
                <VendorPayeePanel vendorPayee={selectedRecord.vendorPayeeValidation} />
              </div>

              <PreValidationPipelinePanel
                invoice={previewInvoice}
                validationRuleResults={selectedRules}
                invoiceId={selectedRecordId}
                onNavigate={onNavigate}
                onNavigateToException={onNavigateToException}
              />
            </div>
          </div>

          <div className="doc-ai-secondary-grid">
            <TopRuleFailureDrivers rows={ruleFailureDrivers} rangeLabel={rangeSubtitle} />
            <PreventedExceptionsByType rows={preventedExceptions} rangeLabel={rangeSubtitle} />
          </div>

          <ApprovalBanner />
        </>
      ) : (
        <FilterEmptyState
          message={liveError || 'No invoice matches the selected filters.'}
        />
      )}
    </>
  )
}
