import { useState } from 'react'
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
import { preValidationFilters, preValidationStats, preValidationQueue, preValidationRecords } from '../data'
import { applyFieldCorrection } from '../utils/preValidationMappers'

// Row-level vendor labels (matching vendorOptions casing) — the invoice
// preview itself displays the vendor name in caps, so this is kept separate.
const VENDOR_BY_ID = {
  'INV-2025-10456': 'Global Industrial Supply',
  'INV-2025-10412': 'Office Depot',
  'INV-2025-10398': 'Cintas Corporation',
  'INV-2025-10422': 'Verizon Wireless',
  'CM-2025-10077': 'Grainger',
}

const CONFIDENCE_BAND_BY_BADGE = {
  'HIGH CONFIDENCE': 'High (90-100%)',
  'MEDIUM CONFIDENCE': 'Medium (70-89%)',
  'LOW CONFIDENCE': 'Low (< 70%)',
}

function deriveAttributes(id, record) {
  const failedCount = record.validationRuleResults.filter((r) => r.result === 'failed').length
  const reviewCount = record.validationRuleResults.filter((r) => r.result === 'review').length
  const validationStatus = failedCount > 0 ? 'Failed' : reviewCount > 0 ? 'Review' : 'Passed'
  const documentType = record.documentClassification.find((d) => d.selected)?.label ?? 'Invoice'
  const confidenceBand = CONFIDENCE_BAND_BY_BADGE[record.invoice.confidenceBadge] ?? 'High (90-100%)'

  return {
    vendor: VENDOR_BY_ID[id] ?? record.invoice.vendorName,
    documentType,
    confidenceBand,
    validationStatus,
  }
}

export default function PreValidation({ onNavigate, onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(preValidationFilters)
  const [selectedId, setSelectedId] = useState(preValidationQueue[0])
  // Local, editable copy of the seed records so a field correction can
  // update the invoice value and re-run its validation rule in place.
  const [records, setRecords] = useState(preValidationRecords)

  const handleCorrectField = (id, fieldKey, value) => {
    setRecords((prev) => ({ ...prev, [id]: applyFieldCorrection(prev[id], fieldKey, value) }))
  }

  const filteredQueue = preValidationQueue.filter((id) => {
    const attrs = deriveAttributes(id, records[id])
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

  const queueRows = filteredQueue.map((id) => {
    const record = records[id]
    const attrs = deriveAttributes(id, record)
    return {
      id,
      invoiceNumber: id,
      vendor: attrs.vendor,
      amount: record.invoice.grossAmount.replace(' USD', ''),
      status: attrs.validationStatus,
    }
  })

  return (
    <>
      <FilterBar
        fields={preValidationFilters}
        values={draft}
        onFieldChange={setField}
        onGo={apply}
        dateRangeLabel="05/11/2025 - 05/18/2025"
        hideAdaptLink
      />
      <StatsRow stats={preValidationStats} />

      {selectedRecord ? (
        <>
          <div className="pv-page-grid">
            <PreValidationQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="pv-main-grid">
                <InvoicePreviewValidation
                  invoice={selectedRecord.invoice}
                  rules={selectedRecord.validationRuleResults}
                  onCorrectField={(fieldKey, value) => handleCorrectField(selectedRecordId, fieldKey, value)}
                />
                <ValidationRuleResults rules={selectedRecord.validationRuleResults} />
                <VendorPayeePanel vendorPayee={selectedRecord.vendorPayeeValidation} />
              </div>

              <PreValidationPipelinePanel
                invoice={selectedRecord.invoice}
                validationRuleResults={selectedRecord.validationRuleResults}
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
        <FilterEmptyState message="No invoice matches the selected filters." />
      )}
    </>
  )
}
