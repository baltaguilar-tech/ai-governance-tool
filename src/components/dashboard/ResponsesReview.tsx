import { useAssessmentStore } from '@/store/assessmentStore';
import { DIMENSION_MAP } from '@/data/dimensions';
import { getQuestionsForProfile } from '@/data/questions/index';
import { MaturityLevel, type OrganizationProfile, type DimensionKey } from '@/types/assessment';

const DIMENSION_KEYS: DimensionKey[] = [
  'shadowAI',
  'vendorRisk',
  'dataGovernance',
  'securityCompliance',
  'aiSpecificRisks',
  'roiTracking',
];

export function ResponsesReview() {
  const { responses, profile, setResponse, calculateResults } = useAssessmentStore();

  const questions = getQuestionsForProfile(
    (profile as OrganizationProfile).aiMaturityLevel ?? MaturityLevel.Experimenter,
    (profile as OrganizationProfile).operatingRegions ?? []
  );

  const handleChange = (questionId: string, value: number) => {
    setResponse(questionId, value);
    calculateResults();
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-navy-600">
        Review your responses below. Changing an answer updates your results immediately.
      </p>

      {DIMENSION_KEYS.map((dimKey) => {
        const dimension = DIMENSION_MAP[dimKey];
        const dimQuestions = questions.filter((q) => q.dimension === dimKey);
        if (!dimension || dimQuestions.length === 0) return null;

        const answeredCount = dimQuestions.filter((q) =>
          responses.some((r) => r.questionId === q.id)
        ).length;

        return (
          <div key={dimKey} className="bg-white rounded-xl border border-navy-200 overflow-hidden">
            {/* Dimension header */}
            <div className="px-6 py-4 border-b border-navy-100 bg-navy-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-navy-900">{dimension.label}</h3>
                <p className="text-xs text-navy-500 mt-0.5">{dimension.description}</p>
              </div>
              <span className="text-xs text-navy-400 shrink-0 ml-4">
                {answeredCount}/{dimQuestions.length} answered
              </span>
            </div>

            {/* Questions */}
            <div className="divide-y divide-navy-100">
              {dimQuestions.map((question, idx) => {
                const currentResponse = responses.find((r) => r.questionId === question.id);

                return (
                  <div key={question.id} className="px-6 py-4">
                    <p className="text-sm font-medium text-navy-800 mb-3">
                      <span className="text-xs font-semibold text-navy-400 mr-2">{idx + 1}.</span>
                      {question.text}
                    </p>
                    <div className="space-y-2 ml-5">
                      {question.options?.map((option, optIdx) => {
                        const isSelected = currentResponse?.value === option.value;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleChange(question.id, option.value)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                              isSelected
                                ? 'bg-accent-blue/10 border-accent-blue text-accent-blue font-medium'
                                : 'bg-white border-navy-200 text-navy-700 hover:border-accent-blue/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  isSelected ? 'bg-accent-blue' : 'border-2 border-navy-300'
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
          </div>
        );
      })}
    </div>
  );
}
