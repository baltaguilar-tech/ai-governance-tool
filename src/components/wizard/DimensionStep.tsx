import { EyeOff, Link2, Database, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { DimensionKey, MaturityLevel, OrganizationProfile } from '@/types/assessment';
import { DIMENSION_MAP } from '@/data/dimensions';
import { getQuestionsForProfile } from '@/data/questions/index';

const DIMENSION_ICONS: Record<DimensionKey, React.ElementType> = {
  shadowAI:           EyeOff,
  vendorRisk:         Link2,
  dataGovernance:     Database,
  securityCompliance: ShieldCheck,
  aiSpecificRisks:    Zap,
  roiTracking:        TrendingUp,
};

interface DimensionStepProps {
  dimensionKey: DimensionKey;
}

export function DimensionStep({ dimensionKey }: DimensionStepProps) {
  const { responses, setResponse, nextStep, prevStep, profile } = useAssessmentStore();
  const dimension = DIMENSION_MAP[dimensionKey];
  const Icon = DIMENSION_ICONS[dimensionKey];
  const allQuestions = getQuestionsForProfile(
    (profile as OrganizationProfile).aiMaturityLevel ?? MaturityLevel.Experimenter,
    (profile as OrganizationProfile).operatingRegions ?? []
  );
  const questions = allQuestions.filter((q) => q.dimension === dimensionKey);

  const answeredCount = questions.filter((q) =>
    responses.some((r) => r.questionId === q.id)
  ).length;

  const canContinue = answeredCount >= Math.ceil(questions.length / 2);

  const firstUnansweredIndex = questions.findIndex(
    (q) => !responses.some((r) => r.questionId === q.id)
  );

  return (
    <div>
      {/* Dimension Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
            {dimension.shortLabel}
          </span>
          <span className="text-xs text-light-muted">
            Weight: {dimension.weight * 100}%
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-7 h-7 text-accent-blue" />
          <h2 className="text-2xl font-bold text-light-text">{dimension.label}</h2>
        </div>
        <p className="text-light-muted text-sm">{dimension.description}</p>

        {/* Progress dots */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((q, i) => {
              const isAnswered = responses.some((r) => r.questionId === q.id);
              const isCurrent = !isAnswered && i === firstUnansweredIndex;
              return (
                <button
                  key={q.id}
                  onClick={() =>
                    document.getElementById('question-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isAnswered
                      ? 'bg-accent-green text-white'
                      : isCurrent
                      ? 'bg-accent-blue text-white'
                      : 'bg-white border border-navy-200 text-light-muted'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-light-muted mt-2">
            {answeredCount} of {questions.length} answered · answer at least {Math.ceil(questions.length / 2)} to continue
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, idx) => {
          const currentResponse = responses.find((r) => r.questionId === question.id);
          const isAnswered = currentResponse !== undefined;

          return (
            <div
              key={question.id}
              id={'question-' + idx}
              className={`bg-white rounded-xl border p-5 transition-all ${
                isAnswered
                  ? 'border-accent-green/40 shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
                  : 'border-navy-200 shadow-sm'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xs font-semibold text-light-muted bg-navy-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-light-text">{question.text}</p>
                  {question.helpText && (
                    <p className="text-xs text-light-muted mt-1.5 leading-relaxed">
                      {question.helpText}
                    </p>
                  )}
                </div>
              </div>

              {/* Options — full pill buttons */}
              <div className="ml-9 space-y-2">
                {question.options?.map((option, optionIndex) => {
                  const selectedIndex = currentResponse !== undefined
                    ? (question.options?.findIndex((o) => o.value === currentResponse.value) ?? -1)
                    : -1;
                  const isSelected = optionIndex === selectedIndex;
                  return (
                    <button
                      key={`${question.id}-${optionIndex}`}
                      onClick={() => setResponse(question.id, option.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'bg-accent-blue/10 border-accent-blue text-accent-blue font-medium'
                          : 'bg-white border-navy-200 text-light-text hover:border-accent-blue/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-accent-blue'
                              : 'border-2 border-navy-300'
                          }`}
                        />
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation — sticky so Back/Continue are always visible */}
      <div className="sticky bottom-0 bg-light-bg border-t border-navy-100 -mx-6 px-6 flex justify-between pt-4 pb-4 mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg border border-navy-200 text-light-muted font-medium hover:bg-navy-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className="px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2B5CFF 0%, #1A44CC 100%)' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
