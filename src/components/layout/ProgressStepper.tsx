import { useAssessmentStore } from '@/store/assessmentStore';
import { WIZARD_STEPS } from '@/data/dimensions';
import type { WizardStep } from '@/types/assessment';

export function ProgressStepper() {
  const { currentStep, setStep } = useAssessmentStore();
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  // Don't show on welcome or results
  if (currentStep === 'welcome' || currentStep === 'results') return null;

  const handleStepClick = (stepKey: string, stepIndex: number) => {
    if (stepIndex >= currentIndex) return; // back-only navigation
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(stepKey as WizardStep);
  };

  return (
    // Dark surface extends the chrome from the header, easing the dark→light transition
    <div className="bg-dark-surface border-b border-white/10 px-6 py-3 flex-shrink-0">
      <div className="max-w-6xl mx-auto">
        {/* Mobile: compact */}
        <div className="md:hidden text-sm text-white/60 font-medium">
          Step {currentIndex} of {WIZARD_STEPS.length - 1}:{' '}
          <span className="text-white">
            {WIZARD_STEPS[currentIndex]?.label}
          </span>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden md:flex items-center gap-1">
          {WIZARD_STEPS.slice(1, -1).map((step, i) => {
            const stepIndex = i + 1; // offset for 'welcome'
            const isCompleted = stepIndex < currentIndex;
            const isCurrent = stepIndex === currentIndex;
            const isClickable = isCompleted;

            const stepLabel = (
              <>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-accent-green text-white'
                      : isCurrent
                      ? 'bg-accent-blue text-white'
                      : 'bg-white/15 text-white/40'
                  }`}
                >
                  {isCompleted ? '\u2713' : i + 1}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent
                      ? 'text-white font-semibold'
                      : isCompleted
                      ? 'text-white/70'
                      : 'text-white/40'
                  }`}
                >
                  {step.label}
                </span>
              </>
            );

            return (
              <div key={step.key} className="flex items-center">
                {isClickable ? (
                  <button
                    onClick={() => handleStepClick(step.key, stepIndex)}
                    className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
                    title={`Back to ${step.label}`}
                  >
                    {stepLabel}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {stepLabel}
                  </div>
                )}
                {i < WIZARD_STEPS.length - 3 && (
                  <div
                    className={`w-6 h-0.5 mx-1 ${
                      isCompleted ? 'bg-accent-green/40' : 'bg-white/15'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-blue rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex) / (WIZARD_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
