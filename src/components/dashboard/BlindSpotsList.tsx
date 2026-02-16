import { BlindSpot, RiskLevel } from '@/types/assessment';
import { DIMENSION_MAP } from '@/data/dimensions';
import { useAssessmentStore } from '@/store/assessmentStore';

interface BlindSpotsListProps {
  blindSpots: BlindSpot[];
}

export function BlindSpotsList({ blindSpots }: BlindSpotsListProps) {
  const { licenseTier } = useAssessmentStore();
  const visibleSpots = licenseTier === 'free' ? blindSpots.slice(0, 3) : blindSpots;
  const hiddenCount = blindSpots.length - visibleSpots.length;

  if (blindSpots.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-navy-900 mb-1">
        Critical Blind Spots
      </h3>
      <p className="text-sm text-navy-500 mb-4">
        Highest-risk areas requiring immediate attention
      </p>

      <div className="space-y-3">
        {visibleSpots.map((spot, i) => (
          <div
            key={i}
            className={`rounded-lg border p-4 ${
              spot.severity === RiskLevel.Critical
                ? 'border-red-300 bg-red-50'
                : spot.severity === RiskLevel.High
                ? 'border-orange-300 bg-orange-50'
                : 'border-amber-300 bg-amber-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    spot.severity === RiskLevel.Critical
                      ? 'bg-red-200 text-red-800'
                      : spot.severity === RiskLevel.High
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  {spot.severity}
                </span>
                <span className="text-xs text-navy-500">
                  {DIMENSION_MAP[spot.dimension]?.shortLabel}
                </span>
              </div>
              <span className="text-sm font-bold text-navy-700">{spot.score}/100</span>
            </div>
            <p className="text-sm font-medium text-navy-900 mb-1">{spot.title}</p>
            <p className="text-xs text-navy-600 mb-2">{spot.description}</p>
            <div className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-2">
              Action: {spot.immediateAction}
            </div>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-4 p-4 bg-navy-50 border border-navy-200 rounded-lg text-center">
          <p className="text-sm text-navy-700 font-medium">
            +{hiddenCount} more blind spots identified
          </p>
          <p className="text-xs text-navy-500 mt-1">
            Upgrade to Pro to see all blind spots with detailed explanations and action items
          </p>
          <button className="mt-2 px-4 py-2 bg-navy-900 text-white text-sm rounded-lg font-medium hover:bg-navy-800 transition-colors">
            Unlock Full Analysis
          </button>
        </div>
      )}
    </div>
  );
}
