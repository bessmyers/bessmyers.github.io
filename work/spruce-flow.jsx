const { useState, useEffect, useRef } = React;

function StepIcon({ stepNum }) {
  const iconProps = {
    width: '32',
    height: '32',
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  if (stepNum === 0) {
    return (
      <svg {...iconProps}>
        <circle cx="16" cy="16" r="14" />
        <polygon points="12 10 12 22 24 16" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (stepNum === 1) {
    return (
      <svg {...iconProps}>
        <path d="M 4 6 L 4 26 L 28 26 L 28 10 L 14 10 L 10 6 Z" />
        <path d="M 8 14 L 24 14" strokeWidth="1.5" />
        <path d="M 8 18 L 24 18" strokeWidth="1.5" />
        <path d="M 8 22 L 20 22" strokeWidth="1.5" />
      </svg>
    );
  }
  if (stepNum === 2) {
    return (
      <svg {...iconProps}>
        <circle cx="13" cy="13" r="9" />
        <path d="M 21 21 L 28 28" strokeWidth="2" />
        <circle cx="13" cy="13" r="5" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }
  if (stepNum === 3) {
    return (
      <svg {...iconProps}>
        <path d="M 8 20 Q 8 8 16 8 Q 24 8 24 20" />
        <circle cx="16" cy="20" r="2" fill="currentColor" />
        <path d="M 16 20 L 16 12" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg {...iconProps}>
      <path d="M 6 2 L 6 30 L 26 30 L 26 8 L 20 8 L 20 2 Z" />
      <path d="M 10 12 L 22 12" strokeWidth="1.5" />
      <path d="M 10 16 L 22 16" strokeWidth="1.5" />
      <path d="M 10 20 L 18 20" strokeWidth="1.5" />
    </svg>
  );
}

const STEP_LABELS = [
  'Run Spruce',
  'Scan high-traffic directories',
  'Detect issues',
  'Rate severity by issue type, string liveness, and daily views',
  'Draft diffs'
];

function SpruceFlowAnimation() {
  const [step, setStep] = useState(0);
  const totalSteps = STEP_LABELS.length - 1;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // When a button disables at either end, keep keyboard focus on the other one
  useEffect(() => {
    const active = document.activeElement;
    if (step === totalSteps && active === nextRef.current) prevRef.current.focus();
    if (step === 0 && active === prevRef.current) nextRef.current.focus();
  }, [step]);

  const stateOf = (idx) => (idx === step ? 'is-current' : idx < step ? 'is-done' : 'is-upcoming');

  return (
    <div className="spruce-flow-app">
      <div className="spruce-flow-stage">
        <ol className="spruce-flow-steps">
          {STEP_LABELS.map((label, idx) => (
            <li key={idx} className={'spruce-flow-step ' + stateOf(idx)} aria-current={idx === step ? 'step' : undefined}>
              <span className="spruce-flow-icon" aria-hidden="true"><StepIcon stepNum={idx} /></span>
              <span className="spruce-flow-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {'Step ' + (step + 1) + ' of ' + STEP_LABELS.length + ': ' + STEP_LABELS[step]}
      </p>

      <div className="spruce-flow-controls">
        <button type="button" ref={prevRef} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="spruce-flow-btn">
          ← Previous
        </button>
        <button type="button" ref={nextRef} onClick={() => setStep(Math.min(totalSteps, step + 1))} disabled={step === totalSteps} className="spruce-flow-btn">
          Next →
        </button>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('spruce-flow-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<SpruceFlowAnimation />);
}
