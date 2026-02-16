import { useAssessmentStore } from '@/store/assessmentStore';
import { WIZARD_STEPS } from '@/data/dimensions';

export function ProgressStepper() {
  const { currentStep } = useAssessmentStore();
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  // Don't show on welcome or results
  if (currentStep === 'welcome' || currentStep === 'results') return null;

  return (
    <div className="bg-white border-b border-navy-200 px-6 py-3">
      <div className="max-w-6xl mx-auto">
        {/* Mobile: compact */}
        <div className="md:hidden text-sm text-navy-600 font-medium">
          Step {currentIndex} of {WIZARD_STEPS.length - 1}:{' '}
          <span className="text-navy-900">
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
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-navy-200 text-navy-500'
                    }`}
                  >
                    {isCompleted ? '\u2713' : i + 1}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isCurrent ? 'text-navy-900 font-semibold' : 'text-navy-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < WIZARD_STEPS.length - 3 && (
                  <div
                    className={`w-6 h-0.5 mx-1 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-navy-200'
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
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex) / (WIZARD_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
