import { Check, ArrowRight, AlertTriangle } from 'lucide-react'

// Generic renderer for a linear automation pipeline. Each step:
// { key, label, done, caption, failed?, isLink?, onClick?, linkTitle?,
//   exception?, exceptionText?, exceptionOnClick?, exceptionLinkTitle? }
export default function PipelineStepper({ steps }) {
  return (
    <div className="triage-stepper">
      <div className="stepper-line">
        {steps.map((step, i) => {
          const next = steps[i + 1]
          const connectorDone = step.done && next && next.done

          return (
            <div className="stepper-item-wrap" key={step.key}>
              <div className="stepper-item">
                <div className={`stepper-circle ${step.done ? 'is-done' : 'is-pending'} ${step.failed ? 'is-flagged' : ''}`}>
                  {step.done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </div>
                {step.isLink ? (
                  <button
                    type="button"
                    className="stepper-label stepper-link-label"
                    onClick={step.onClick}
                    title={step.linkTitle}
                  >
                    {step.label}
                    <ArrowRight size={11} />
                  </button>
                ) : (
                  <div className="stepper-label">{step.label}</div>
                )}
                <div className={`stepper-caption${step.failed ? ' color-red' : ''}`}>{step.caption}</div>
                {step.exception &&
                  (step.exceptionOnClick ? (
                    <button
                      type="button"
                      className="stepper-branch is-exception stepper-branch-link"
                      onClick={step.exceptionOnClick}
                      title={step.exceptionLinkTitle}
                    >
                      <AlertTriangle size={11} /> {step.exceptionText ?? 'Exception'}
                      <ArrowRight size={11} />
                    </button>
                  ) : (
                    <div className="stepper-branch is-exception">
                      <AlertTriangle size={11} /> {step.exceptionText ?? 'Exception'}
                    </div>
                  ))}
              </div>
              {next && <div className={`stepper-connector ${connectorDone ? 'is-done' : ''}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
