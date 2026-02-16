import { Recommendation } from '@/types/assessment';
import { useAssessmentStore } from '@/store/assessmentStore';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

const TIMELINE_ORDER = ['this-week', 'this-month', 'this-quarter', 'this-year'] as const;
const TIMELINE_LABELS: Record<string, string> = {
  'this-week': 'This Week (Critical)',
  'this-month': 'This Month',
  'this-quarter': 'This Quarter',
  'this-year': 'This Year',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-navy-100 text-navy-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  vendor: 'Vendor Assessment',
  audit: 'Audit & Discovery',
  monitoring: 'Monitoring',
  roi: 'ROI Framework',
  roadmap: 'Implementation',
  compliance: 'Compliance',
};

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const { licenseTier } = useAssessmentStore();

  const freeRecs = recommendations.filter((r) => !r.isPaid);
  const paidRecs = recommendations.filter((r) => r.isPaid);

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-navy-900 mb-1">
        Personalized Recommendations
      </h3>
      <p className="text-sm text-navy-500 mb-6">
        Prioritized action items based on your assessment results
      </p>

      {/* Group by timeline */}
      {TIMELINE_ORDER.map((timeline) => {
        const timelineRecs = freeRecs.filter((r) => r.timeline === timeline);
        if (timelineRecs.length === 0) return null;

        return (
          <div key={timeline} className="mb-6">
            <h4 className="text-sm font-semibold text-navy-700 mb-3 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  timeline === 'this-week'
                    ? 'bg-red-500'
                    : timeline === 'this-month'
                    ? 'bg-orange-500'
                    : timeline === 'this-quarter'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
              />
              {TIMELINE_LABELS[timeline]}
            </h4>
            <div className="space-y-2">
              {timelineRecs.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-navy-50 border border-navy-100"
                >
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${PRIORITY_COLORS[rec.priority]}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-navy-900">{rec.title}</span>
                      <span className="text-[10px] text-navy-400 bg-navy-100 px-1.5 py-0.5 rounded">
                        {CATEGORY_LABELS[rec.category]}
                      </span>
                    </div>
                    <p className="text-xs text-navy-600">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Paid recommendations teaser */}
      {paidRecs.length > 0 && licenseTier === 'free' && (
        <div className="mt-6 p-5 bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl text-white">
          <h4 className="font-semibold mb-2">
            Unlock {paidRecs.length} Additional Recommendations
          </h4>
          <ul className="space-y-1.5 mb-4">
            {paidRecs.slice(0, 4).map((rec, i) => (
              <li key={i} className="text-sm text-navy-200 flex items-center gap-2">
                <span className="text-blue-400">{'\u2192'}</span>
                {rec.title}
              </li>
            ))}
            {paidRecs.length > 4 && (
              <li className="text-sm text-navy-300">
                ...and {paidRecs.length - 4} more
              </li>
            )}
          </ul>
          <p className="text-xs text-navy-300 mb-3">
            Pro includes: customized vendor questionnaire, industry-specific playbooks,
            regulatory compliance roadmaps, multi-dimensional ROI framework, and detailed
            implementation plans.
          </p>
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
