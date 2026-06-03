const { useState } = React;

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
  'Severity rating',
  'Draft diffs'
];

const STEP_DESCRIPTIONS = [
  'Content design AI agent can work autonomously after 7+ iterations',
  'Spruce auto-scans 30 directories in the Facebook Profile codebase throughout the week',
  'Style, brand voice, terminology, accessibility, localization',
  'Determine severity based on type of issue, string liveness and daily views',
  'Draft diffs for human review of highest-severity issues, and file eng tasks for issues outside CD scope'
];

function SpruceFlowAnimation() {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const clay = '#B5734A';
  const clayLight = '#fff5f0';
  const oat = '#FBF9F5';
  const rule = '#E5DFD4';

  return (
    <div className="spruce-flow-app">
      <div className="spruce-flow-stage">
        <div className="spruce-flow-steps">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="spruce-flow-step"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                height: step === idx ? '260px' : '200px',
                background: step >= idx ? clayLight : oat,
                border: step >= idx ? `2px solid ${clay}` : `2px solid ${rule}`,
                borderRadius: '12px',
                padding: '1rem 0.65rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: step === idx ? 'scale(1)' : 'scale(0.95)',
                opacity: step >= idx ? 1 : 0.5
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  marginBottom: '0.8rem',
                  color: step >= idx ? clay : '#ccc',
                  transition: 'all 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <StepIcon stepNum={idx} />
              </div>
              <div
                style={{
                  fontSize: step === idx ? '14px' : '12px',
                  fontWeight: step === idx ? '600' : '500',
                  color: '#1C1B18',
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}
              >
                {STEP_LABELS[idx]}
              </div>
              {step === idx && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#4A4740',
                    lineHeight: 1.4,
                    marginTop: '0.5rem',
                    animation: 'spruceFadeIn 0.4s ease-out'
                  }}
                >
                  {STEP_DESCRIPTIONS[idx]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="spruce-flow-controls">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 0}
          className="spruce-flow-btn"
          style={{
            background: step === 0 ? rule : clay,
            color: step === 0 ? '#8A857A' : '#FBF9F5',
            cursor: step === 0 ? 'default' : 'pointer'
          }}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={step === totalSteps}
          className="spruce-flow-btn"
          style={{
            background: step === totalSteps ? rule : clay,
            color: step === totalSteps ? '#8A857A' : '#FBF9F5',
            cursor: step === totalSteps ? 'default' : 'pointer'
          }}
        >
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
