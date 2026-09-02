import PipelineStepper from './PipelineStepper'
import { preValidationInvoice, validationRuleResults } from '../data'

export default function PreValidationPipelineStepper({ onNavigate }) {
  const failedCount = validationRuleResults.filter((r) => r.result === 'failed').length
  const reviewCount = validationRuleResults.filter((r) => r.result === 'review').length
  const ready = failedCount === 0

  const steps = [
    {
      key: 'fetch',
      label: 'Fetching Invoice Data',
      done: true,
      caption: `Invoice ${preValidationInvoice.invoiceNumber} retrieved`,
    },
    {
      key: 'validate',
      label: 'Pre-Validation Process',
      done: true,
      caption: `${failedCount} failed · ${reviewCount} for review`,
    },
    {
      key: 'ready',
      label: 'Ready for Matching',
      done: ready,
      caption: ready ? 'All checks passed' : 'Blocked — validation failed',
      isLink: true,
      onClick: () => onNavigate?.(ready ? 'PO & Line Matching' : 'Exceptions & Recommendations'),
      linkTitle: ready ? 'Open PO & Line Matching' : 'Open Exceptions & Recommendations',
      exception: !ready,
      exceptionText: 'Exception — routed for review',
    },
  ]

  return <PipelineStepper steps={steps} />
}
