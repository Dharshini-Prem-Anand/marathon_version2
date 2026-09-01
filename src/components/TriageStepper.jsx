import { Check, AlertTriangle } from 'lucide-react'

const STEP_DEFS = [
  { key: 'fetch', num: 1, label: 'Fetch Email' },
  { key: 'classify', num: 2, label: 'Invoice Classification' },
  { key: 'extract', num: 3, label: 'Document AI Extraction' },
  { key: 'fields', num: 4, label: 'Mandatory Field Checks' },
  { key: 'persist', num: 5, label: 'Persist to Object Store' },
  { key: 'dup', num: 6, label: 'Duplication Check' },
  { key: 'match', num: 7, label: 'Three-Way Match (PO, GRN)' },
  { key: 'post', num: 8, label: 'Posting to SAP' },
]

const STEP_ROWS = [STEP_DEFS.slice(0, 4), STEP_DEFS.slice(4, 8)]

function getTriageProgress(row, preview) {
  const confidence = parseInt(row.confidence, 10) || 0
  const isDocument = row.category !== 'Inquiry' && row.category !== 'Non-Invoice'
  const isDuplicate = row.category === 'Duplicate' || preview.attachments.some((a) => a.category === 'Duplicate')
  const fieldsPass = isDocument && confidence >= 85
  const persisted = fieldsPass
  const dupChecked = persisted
  const matchEligible = dupChecked && !isDuplicate
  const isException = matchEligible && row.priority === 'High'
  const isMatched = matchEligible && !isException
  const posted = isMatched

  return {
    fetch: { done: true, caption: `Received ${row.time}` },
    classify: { done: true, caption: `${row.category} · ${row.confidence} confidence` },
    extract: {
      done: isDocument,
      caption: isDocument ? `${row.attachments} file${row.attachments > 1 ? 's' : ''} parsed` : 'Not applicable',
    },
    fields: {
      done: fieldsPass,
      caption: !isDocument ? 'Not applicable' : fieldsPass ? 'All required fields present' : 'Low-confidence fields',
    },
    persist: { done: persisted, caption: persisted ? 'Stored in document archive' : 'Pending' },
    dup: {
      done: dupChecked,
      caption: isDuplicate ? 'Duplicate detected' : dupChecked ? 'No duplicates found' : 'Pending',
      flagged: isDuplicate,
    },
    match: {
      done: matchEligible,
      caption: !matchEligible ? (isDuplicate ? 'Skipped — duplicate' : 'Pending') : isException ? 'PO / GRN mismatch found' : 'PO & GRN matched',
      isException,
      isMatched,
    },
    post: {
      done: posted,
      caption: posted ? 'Document posted to SAP' : isException ? 'Blocked by exception' : 'Not posted',
    },
  }
}

export default function TriageStepper({ row, preview }) {
  const progress = getTriageProgress(row, preview)

  return (
    <div className="triage-stepper">
      {STEP_ROWS.map((stepsInRow, rowIndex) => (
        <div key={rowIndex}>
          {rowIndex > 0 && <div className={`stepper-row-connector ${progress.fields.done ? 'is-done' : ''}`} />}
          <div className="stepper-line">
            {stepsInRow.map((step, i) => {
              const info = progress[step.key]
              const next = stepsInRow[i + 1]
              const connectorDone = info.done && next && progress[next.key].done

              return (
                <div className="stepper-item-wrap" key={step.key}>
                  <div className="stepper-item">
                    <div className={`stepper-circle ${info.done ? 'is-done' : 'is-pending'} ${info.flagged ? 'is-flagged' : ''}`}>
                      {info.done ? <Check size={14} strokeWidth={3} /> : step.num}
                    </div>
                    <div className="stepper-label">{step.label}</div>
                    <div className="stepper-caption">{info.caption}</div>

                    {step.key === 'match' && info.done && (
                      <div className={`stepper-branch ${info.isException ? 'is-exception' : 'is-success'}`}>
                        {info.isException ? (
                          <>
                            <AlertTriangle size={11} /> Exception — review email triggered
                          </>
                        ) : (
                          <>
                            <Check size={11} /> Match success — posted to SAP
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {next && <div className={`stepper-connector ${connectorDone ? 'is-done' : ''}`} />}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
