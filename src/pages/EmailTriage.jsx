import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TriageQueueTable from '../components/TriageQueueTable'
import EmailPreviewPanel from '../components/EmailPreviewPanel'
import IntakeByChannel from '../components/IntakeByChannel'
import PreprocessingMetrics from '../components/PreprocessingMetrics'
import ValueDeliveredRow from '../components/ValueDeliveredRow'
import { useFilters, matchesOption } from '../hooks/useFilters'
import { emailTriageFilters, emailTriageStats, triageQueue } from '../data'

export default function EmailTriage() {
  const [selectedId, setSelectedId] = useState(triageQueue[0].id)
  const { draft, applied, setField, apply } = useFilters(emailTriageFilters)

  const filteredRows = triageQueue.filter(
    (row) =>
      matchesOption(applied['Source'], row.source) &&
      matchesOption(applied['Channel'], row.source) &&
      matchesOption(applied['Sender / Vendor'], row.vendor) &&
      matchesOption(applied['Proposed Category'], row.category) &&
      matchesOption(applied['Priority'], row.priority)
  )

  const previewId = filteredRows.some((r) => r.id === selectedId) ? selectedId : filteredRows[0]?.id

  return (
    <>
      <FilterBar fields={emailTriageFilters} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={emailTriageStats} />

      <div className="triage-main-grid">
        <TriageQueueTable rows={filteredRows} selectedId={previewId} onSelect={setSelectedId} />
        {previewId && <EmailPreviewPanel selectedId={previewId} />}
      </div>

      <div className="triage-secondary-grid">
        <IntakeByChannel />
        <PreprocessingMetrics />
      </div>

      <ValueDeliveredRow />
    </>
  )
}
