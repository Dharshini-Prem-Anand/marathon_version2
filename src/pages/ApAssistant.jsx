import PageHeader from '../components/PageHeader'
import ApQueryPanel from '../components/ApQueryPanel'
import InvoiceContextPanel from '../components/InvoiceContextPanel'
import AssistantRecommendationPanel from '../components/AssistantRecommendationPanel'
import AssistantWhatIfScenarios from '../components/AssistantWhatIfScenarios'
import ExpectedValueImpactPanel from '../components/ExpectedValueImpactPanel'
import { apAssistantPageHeader } from '../data'

export default function ApAssistant() {
  return (
    <>
      <PageHeader title={apAssistantPageHeader.title} subtitle={apAssistantPageHeader.subtitle} />

      <div className="assistant-top-grid">
        <ApQueryPanel />
        <InvoiceContextPanel />
      </div>

      <AssistantRecommendationPanel />

      <div className="assistant-bottom-grid">
        <AssistantWhatIfScenarios />
        <ExpectedValueImpactPanel />
      </div>
    </>
  )
}
