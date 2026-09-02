import PipelineStepper from './PipelineStepper'
import { poMatchingContext, threeWayMatchLines } from '../data'

export default function PoMatchingPipelineStepper({ onNavigate }) {
  const mismatchLine = threeWayMatchLines.find((l) => l.matchStatus === 'mismatch')
  const toleranceCount = threeWayMatchLines.filter((l) => l.matchStatus === 'tolerance').length
  const matchedCount = threeWayMatchLines.filter((l) => l.matchStatus === 'matched').length
  const hasException = Boolean(mismatchLine) || poMatchingContext.status === 'Mismatch'
  const posted = !hasException

  const steps = [
    {
      key: 'fetch',
      label: 'Fetching Invoice Data',
      done: true,
      caption: `${poMatchingContext.vendor} · ${poMatchingContext.channel}`,
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
        ? `Mismatch on line ${mismatchLine.invLine}`
        : `${matchedCount} matched · ${toleranceCount} in tolerance`,
    },
    {
      key: 'post',
      label: 'Post to SAP',
      done: posted,
      caption: posted ? 'Posted to SAP automatically' : 'Blocked by exception',
      isLink: hasException,
      onClick: hasException ? () => onNavigate?.('Exceptions & Recommendations') : undefined,
      linkTitle: 'Open Exceptions & Recommendations',
      exception: hasException,
      exceptionText: 'Exception — routed for manual review',
    },
  ]

  return <PipelineStepper steps={steps} />
}
