import { useAssessmentStore } from '@/store/assessmentStore';
import { WIZARD_STEPS } from '@/data/dimensions';

export function ProgressStepper() {
  const { currentStep } = useAssessmentStore();
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  // Don't show on welcome or results
  if (currentStep === 'welcome' || currentStep === 'results') return null;

  return (
    <div>
      {/* Bridge: gradient line transitioning from dark header to light stepper */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

      <div className="bg-white border-b border-navy-100 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: compact */}
          <div className="md:hidden text-sm text-light-muted font-medium">
            Step {currentIndex} of {WIZARD_STEPS.length - 1}:{' '}
            <span className="text-light-text">
              {WIZARD_STEPS[currentIndex]?.label}
            </span>
          </div>

          {/* Desktop: full stepper */}
          <div className="hidden md:flex items-center gap-1">
            {WIZARD_STEPS.slice(1, -1).map((step, i) => {
              const stepIndex = i + 1; // offset for 'welcome'
              const isCompleted = stepIndex < currentIndex;
              const isCurrent = stepIndex === currentIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-accent-green text-white'
                          : isCurrent
                          ? 'bg-accent-blue text-white'
                          : 'bg-navy-200 text-navy-500'
                      }`}
                    >
                      {isCompleted ? '\u2713' : i + 1}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isCurrent ? 'text-light-text font-semibold' : 'text-light-muted'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < WIZARD_STEPS.length - 3 && (
                    <div
                      className={`w-6 h-0.5 mx-1 ${
                        isCompleted ? 'bg-accent-green/40' : 'bg-navy-100'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 bg-navy-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded-full transition-all duration-500"
              style={{
                width: `${((currentIndex) / (WIZARD_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
