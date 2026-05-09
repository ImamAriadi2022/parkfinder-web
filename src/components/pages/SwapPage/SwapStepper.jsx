export default function SwapStepper({ steps, step }) {
  return (
    <div className="pf-stepper mb-4">
      {steps.map((label, index) => (
        <div key={label} className={`pf-step ${index <= step ? 'active' : ''} ${index < step ? 'done' : ''}`}>
          <div className="pf-step-circle">{index < step ? '✓' : index + 1}</div>
          <span className="pf-step-label">{label}</span>
          {index < steps.length - 1 && <div className="pf-step-line" />}
        </div>
      ))}
    </div>
  )
}
