import { useState } from 'react'
import StatsRow from '../components/StatsRow'
import PriorityExceptionQueue from '../components/PriorityExceptionQueue'
import AiReviewRecommendation from '../components/AiReviewRecommendation'
import WhatIfResolutionScenarios from '../components/WhatIfResolutionScenarios'
import InfoBanner from '../components/InfoBanner'
import { exceptionsStats, scenarioInfoText, priorityExceptionQueue } from '../data'

export default function ExceptionsRecommendations() {
  const [selectedInvoice, setSelectedInvoice] = useState(priorityExceptionQueue[0]?.invoice ?? null)
  const [postedInvoices, setPostedInvoices] = useState(() => new Set())

  const selectedException = priorityExceptionQueue.find((row) => row.invoice === selectedInvoice) ?? null

  return (
    <>
      <StatsRow stats={exceptionsStats} />

      <div className="exceptions-main-grid">
        <PriorityExceptionQueue selectedId={selectedInvoice} onSelect={setSelectedInvoice} />
        <AiReviewRecommendation
          exception={selectedException}
          posted={selectedInvoice ? postedInvoices.has(selectedInvoice) : false}
          onPostToSap={() => {
            if (selectedInvoice) setPostedInvoices((prev) => new Set(prev).add(selectedInvoice))
          }}
        />
      </div>

      <WhatIfResolutionScenarios />
      <InfoBanner text={scenarioInfoText} />
    </>
  )
}
