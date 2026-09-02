import PoMatchingPipelineStepper from './PoMatchingPipelineStepper'

export default function PoMatchingPipelinePanel({ context, matchLines, invoiceId, onNavigateToException }) {
  return (
    <section className="panel pv-pipeline-panel">
      <h2 className="panel-title">Processing Pipeline</h2>
      <PoMatchingPipelineStepper
        context={context}
        matchLines={matchLines}
        invoiceId={invoiceId}
        onNavigateToException={onNavigateToException}
      />
    </section>
  )
}
