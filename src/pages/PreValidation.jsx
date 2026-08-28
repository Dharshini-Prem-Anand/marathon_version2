import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import InvoicePreviewValidation from '../components/InvoicePreviewValidation'
import ValidationRuleResults from '../components/ValidationRuleResults'
import VendorPayeePanel from '../components/VendorPayeePanel'
import ActionButtonsRow from '../components/ActionButtonsRow'
import TopRuleFailureDrivers from '../components/TopRuleFailureDrivers'
import PreventedExceptionsByType from '../components/PreventedExceptionsByType'
import CorrectionHistoryModelLearning from '../components/CorrectionHistoryModelLearning'
import ApprovalBanner from '../components/ApprovalBanner'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { preValidationFilters, preValidationStats } from '../data'

// The selected invoice's own attributes, derived from its actual data, used to
// evaluate whether it matches the applied filters.
const invoiceAttributes = {
  vendor: 'Global Industrial Supply',
  documentType: 'Invoice',
  confidenceBand: 'High (90-100%)',
  validationStatus: 'Failed',
}

export default function PreValidation() {
  const { draft, applied, setField, apply } = useFilters(preValidationFilters)

  const matchesFilters =
    matchesCompanyCode(applied['Company Code']) &&
    matchesOption(applied['Vendor'], invoiceAttributes.vendor) &&
    matchesOption(applied['Document Type'], invoiceAttributes.documentType) &&
    matchesOption(applied['Confidence Band'], invoiceAttributes.confidenceBand) &&
    matchesOption(applied['Validation Status'], invoiceAttributes.validationStatus)

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

      {matchesFilters ? (
        <>
          <div className="pv-main-grid">
            <InvoicePreviewValidation />
            <ValidationRuleResults />
            <VendorPayeePanel />
            <ActionButtonsRow />
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
