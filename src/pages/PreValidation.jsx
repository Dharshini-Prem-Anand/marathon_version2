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
import { preValidationFilters, preValidationStats } from '../data'

export default function PreValidation() {
  return (
    <>
      <FilterBar fields={preValidationFilters} dateRangeLabel="05/11/2025 - 05/18/2025" hideAdaptLink />
      <StatsRow stats={preValidationStats} />

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
  )
}
