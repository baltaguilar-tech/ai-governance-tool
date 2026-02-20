import { useAssessmentStore } from '@/store/assessmentStore';
import { DimensionKey, MaturityLevel, OrganizationProfile } from '@/types/assessment';
import { DIMENSION_MAP } from '@/data/dimensions';
import { getQuestionsForProfile } from '@/data/questions/index';

interface DimensionStepProps {
  dimensionKey: DimensionKey;
}

export function DimensionStep({ dimensionKey }: DimensionStepProps) {
  const { responses, setResponse, nextStep, prevStep, profile } = useAssessmentStore();
  const dimension = DIMENSION_MAP[dimensionKey];
  const allQuestions = getQuestionsForProfile(
    (profile as OrganizationProfile).aiMaturityLevel ?? MaturityLevel.Experimenter,
    (profile as OrganizationProfile).operatingRegions ?? []
  );
  const questions = allQuestions.filter((q) => q.dimension === dimensionKey);

  const answeredCount = questions.filter((q) =>
    responses.some((r) => r.questionId === q.id)
  ).length;

  const canContinue = answeredCount >= Math.ceil(questions.length / 2);

  return (
    <div>
      {/* Dimension Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {dimension.shortLabel}
          </span>
          <span className="text-xs text-navy-400">
            Weight: {dimension.weight * 100}%
          </span>
        </div>
        <h2 className="text-2xl font-bold text-navy-900 mb-2">{dimension.label}</h2>
        <p className="text-navy-600 text-sm">{dimension.description}</p>
        <div className="mt-3 text-xs text-navy-500">
          {answeredCount}/{questions.length} questions answered
          {answeredCount < Math.ceil(questions.length / 2) && (
            <span className="text-amber-600 ml-2">
              (answer at least {Math.ceil(questions.length / 2)} to continue)
            </span>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, idx) => {
          const currentResponse = responses.find((r) => r.questionId === question.id);

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl border p-5 transition-colors ${
                currentResponse !== undefined
                  ? 'border-emerald-300 shadow-sm'
                  : 'border-navy-200'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xs font-semibold text-navy-400 bg-navy-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-navy-900">{question.text}</p>
                  {question.helpText && (
                    <p className="text-xs text-navy-500 mt-1.5 leading-relaxed">
                      {question.helpText}
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
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
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                          : 'border-navy-200 bg-navy-50 text-navy-700 hover:border-navy-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-blue-500' : 'border-navy-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
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

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-navy-200">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg border border-navy-300 text-navy-700 font-medium hover:bg-navy-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
