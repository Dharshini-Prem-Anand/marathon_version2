import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TriageQueueTable from '../components/TriageQueueTable'
import EmailPreviewPanel from '../components/EmailPreviewPanel'
import IntakeByChannel from '../components/IntakeByChannel'
import PreprocessingMetrics from '../components/PreprocessingMetrics'
import ValueDeliveredRow from '../components/ValueDeliveredRow'
import { emailTriageFilters, emailTriageStats, triageQueue } from '../data'

export default function EmailTriage() {
  const [selectedId, setSelectedId] = useState(triageQueue[0].id)

  return (
    <>
      <FilterBar fields={emailTriageFilters} />
      <StatsRow stats={emailTriageStats} />

      <div className="triage-main-grid">
        <TriageQueueTable selectedId={selectedId} onSelect={setSelectedId} />
        <EmailPreviewPanel selectedId={selectedId} />
      </div>

      <div className="triage-secondary-grid">
        <IntakeByChannel />
        <PreprocessingMetrics />
      </div>

      <ValueDeliveredRow />
    </>
  )
}
