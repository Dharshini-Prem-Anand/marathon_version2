import PreValidationPipelineStepper from './PreValidationPipelineStepper'

export default function PreValidationPipelinePanel({
  invoice,
  validationRuleResults,
  invoiceId,
  onNavigate,
  onNavigateToException,
}) {
  return (
    <section className="panel pv-pipeline-panel">
      <h2 className="panel-title">Processing Pipeline</h2>
      <PreValidationPipelineStepper
        invoice={invoice}
        validationRuleResults={validationRuleResults}
        invoiceId={invoiceId}
        onNavigate={onNavigate}
        onNavigateToException={onNavigateToException}
      />
    </section>
  )
}
