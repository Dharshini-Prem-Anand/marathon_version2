import { useEffect, useState } from 'react'
import StatsRow from '../components/StatsRow'
import PriorityExceptionQueue from '../components/PriorityExceptionQueue'
import AiReviewRecommendation from '../components/AiReviewRecommendation'
import WhatIfResolutionScenarios from '../components/WhatIfResolutionScenarios'
import InfoBanner from '../components/InfoBanner'
import { exceptionsStats, scenarioInfoText, priorityExceptionQueue } from '../data'

export default function ExceptionsRecommendations({ pendingSelectId, onPendingSelectConsumed }) {
  const [selectedInvoice, setSelectedInvoice] = useState(priorityExceptionQueue[0]?.invoice ?? null)
  const [postedInvoices, setPostedInvoices] = useState(() => new Set())

  // A deep link from Pre-Validation / PO & Line Matching's "Exception —
  // routed for..." link arrives as an invoice id — select that row.
  useEffect(() => {
    if (!pendingSelectId) return
    if (!priorityExceptionQueue.some((row) => row.invoice === pendingSelectId)) return
    setSelectedInvoice(pendingSelectId)
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId])

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
