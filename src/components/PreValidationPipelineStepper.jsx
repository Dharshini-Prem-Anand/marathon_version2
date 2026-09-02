import PipelineStepper from './PipelineStepper'

export default function PreValidationPipelineStepper({
  invoice,
  validationRuleResults = [],
  invoiceId,
  onNavigate,
  onNavigateToException,
}) {
  if (!invoice) return null

  const failedCount = validationRuleResults.filter((r) => r.result === 'failed').length
  const reviewCount = validationRuleResults.filter((r) => r.result === 'review').length
  const ready = failedCount === 0

  const steps = [
    {
      key: 'fetch',
      label: 'Fetching Invoice Data',
      done: true,
      caption: `Invoice ${invoice.invoiceNumber} retrieved`,
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
      failed: !ready,
      caption: ready ? 'All checks passed' : 'Blocked — validation failed',
      isLink: ready,
      onClick: ready ? () => onNavigate?.('PO & Line Matching') : undefined,
      linkTitle: 'Open PO & Line Matching',
      exception: !ready,
      exceptionText: 'Exception — routed for review',
      exceptionOnClick: !ready ? () => onNavigateToException?.(invoiceId) : undefined,
      exceptionLinkTitle: 'Open this invoice in Exceptions & Recommendations',
    },
  ]

  return <PipelineStepper steps={steps} />
}
