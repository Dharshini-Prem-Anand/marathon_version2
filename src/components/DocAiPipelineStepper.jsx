import PipelineStepper from './PipelineStepper'

const LOW_CONFIDENCE_THRESHOLD = 80

export default function DocAiPipelineStepper({ document, headerFields = [], fieldsError, onNavigate }) {
  if (!document) return null

  const extracted = !fieldsError && headerFields.length > 0
  const confidenceValue = document.confidenceValue
  const fieldsPass = extracted && Number.isFinite(confidenceValue) && confidenceValue >= LOW_CONFIDENCE_THRESHOLD
  const persisted = fieldsPass && Boolean(document.objectStoreKey)
  const ready = persisted

  const steps = [
    {
      key: 'extraction',
      label: 'Extraction',
      done: extracted,
      caption: extracted
        ? `${headerFields.length} field${headerFields.length === 1 ? '' : 's'} extracted`
        : fieldsError
        ? 'Extraction failed'
        : 'Pending',
    },
    {
      key: 'fields',
      label: 'Mandatory Field Check',
      done: fieldsPass,
      caption: !extracted
        ? 'Pending'
        : fieldsPass
        ? `${document.confidence} confidence — all required fields present`
        : 'Low-confidence fields',
    },
    {
      key: 'persist',
      label: 'Persist in Object Store',
      done: persisted,
      caption: persisted ? 'Stored in document archive' : 'Pending',
    },
    {
      key: 'ready',
      label: 'Ready for Pre Validation',
      done: ready,
      caption: ready ? 'Queued for pre-validation' : 'Pending',
      isLink: ready,
      onClick: ready ? () => onNavigate?.('Pre-Validation') : undefined,
      linkTitle: 'Open Pre-Validation',
    },
  ]

  return <PipelineStepper steps={steps} />
}
