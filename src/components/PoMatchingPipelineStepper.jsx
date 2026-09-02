import PipelineStepper from './PipelineStepper'

export default function PoMatchingPipelineStepper({ context, matchLines = [], invoiceId, onNavigateToException }) {
  if (!context) return null

  const mismatchLine = matchLines.find((l) => l.matchStatus === 'mismatch' || l.matchStatus === 'notfound')
  const toleranceCount = matchLines.filter((l) => l.matchStatus === 'tolerance').length
  const matchedCount = matchLines.filter((l) => l.matchStatus === 'matched').length
  const hasException = Boolean(mismatchLine) || context.status !== 'Matched'
  const posted = !hasException

  const steps = [
    {
      key: 'fetch',
      label: 'Fetching Invoice Data',
      done: true,
      caption: `${context.vendor} · ${context.channel}`,
    },
    {
      key: 'grn',
      label: 'Fetch the Corresponding GRN & POs',
      done: true,
      caption: 'PO & GRN retrieved',
    },
    {
      key: 'dup',
      label: 'Duplicate Check (Invoice)',
      done: true,
      caption: 'No duplicates found',
    },
    {
      key: 'match',
      label: 'Three-Way Matching',
      done: true,
      caption: mismatchLine
        ? `${context.status} on line ${mismatchLine.invLine}`
        : `${matchedCount} matched · ${toleranceCount} in tolerance`,
    },
    {
      key: 'post',
      label: 'Post to SAP',
      done: posted,
      failed: hasException,
      caption: posted ? 'Posted to SAP automatically' : 'Blocked by exception',
      exception: hasException,
      exceptionText: 'Exception — routed for manual review',
      exceptionOnClick: hasException ? () => onNavigateToException?.(invoiceId) : undefined,
      exceptionLinkTitle: 'Open this invoice in Exceptions & Recommendations',
    },
  ]

  return <PipelineStepper steps={steps} />
}
