import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import LineItemExtraction from '../components/LineItemExtraction'
import PainPointTable from '../components/PainPointTable'
import LearningModelPerformance from '../components/LearningModelPerformance'
import { documentAiFilters, documentAiStats } from '../data'

export default function DocumentAiExtraction() {
  return (
    <>
      <FilterBar fields={documentAiFilters} />
      <StatsRow stats={documentAiStats} />

      <div className="docai-main-grid">
        <DocumentQueueTable />
        <InvoicePreviewPanel />
      </div>

      <div className="doc-ai-secondary-grid">
        <FormatPerformanceChart />
        <LineItemExtraction />
        <PainPointTable />
      </div>

      <LearningModelPerformance />
    </>
  )
}
