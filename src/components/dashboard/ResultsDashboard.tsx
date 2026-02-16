import { useAssessmentStore } from '@/store/assessmentStore';
import { RiskGauge } from './RiskGauge';
import { DimensionRadar } from './DimensionRadar';
import { BlindSpotsList } from './BlindSpotsList';
import { RecommendationsList } from './RecommendationsList';
import { AchieverProgress } from './AchieverProgress';
import { generateFreePDF } from '@/utils/pdfExport';

export function ResultsDashboard() {
  const { riskScore, dimensionScores, blindSpots, recommendations, profile, resetAssessment } =
    useAssessmentStore();

  if (!riskScore) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">
          Assessment Results: {profile.organizationName}
        </h2>
        <p className="text-navy-600">
          Completed on {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </div>

      {/* Top-level scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RiskGauge score={riskScore.overallRisk} level={riskScore.riskLevel} />
        <DimensionRadar dimensionScores={dimensionScores} />
        <AchieverProgress
          score={riskScore.achieverScore}
          currentMaturity={riskScore.currentMaturity}
          targetMaturity={riskScore.targetMaturity}
        />
      </div>

      {/* Dimension breakdown */}
      <div className="bg-white rounded-xl border border-navy-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Dimension Scores</h3>
        <div className="space-y-3">
          {dimensionScores.map((ds) => (
            <div key={ds.key} className="flex items-center gap-4">
              <div className="w-32 text-sm text-navy-700 font-medium shrink-0">
                {ds.key === 'shadowAI' && 'Shadow AI'}
                {ds.key === 'vendorRisk' && 'Vendor Risk'}
                {ds.key === 'dataGovernance' && 'Data Governance'}
                {ds.key === 'securityCompliance' && 'Security'}
                {ds.key === 'aiSpecificRisks' && 'AI Risks'}
                {ds.key === 'roiTracking' && 'ROI Tracking'}
              </div>
              <div className="flex-1 h-4 bg-navy-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    ds.score <= 30
                      ? 'bg-emerald-500'
                      : ds.score <= 60
                      ? 'bg-amber-500'
                      : ds.score <= 80
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${ds.score}%` }}
                />
              </div>
              <div className="w-20 text-right">
                <span
                  className={`text-sm font-semibold ${
                    ds.score <= 30
                      ? 'text-emerald-600'
                      : ds.score <= 60
                      ? 'text-amber-600'
                      : ds.score <= 80
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}
                >
                  {ds.score}/100
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  ds.score <= 30
                    ? 'bg-emerald-100 text-emerald-700'
                    : ds.score <= 60
                    ? 'bg-amber-100 text-amber-700'
                    : ds.score <= 80
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {ds.riskLevel}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-navy-500 mt-4">
          Lower scores = better governance. Scores above 60 require immediate attention.
        </p>
      </div>

      {/* Blind Spots */}
      <BlindSpotsList blindSpots={blindSpots} />

      {/* Recommendations */}
      <RecommendationsList recommendations={recommendations} />

      {/* Maturity Gaps */}
      {riskScore.maturityGap.length > 0 && (
        <div className="bg-white rounded-xl border border-navy-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Maturity Gaps to Close</h3>
          <ul className="space-y-2">
            {riskScore.maturityGap.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                <span className="text-amber-500 mt-0.5 shrink-0">{'\u26A0'}</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-navy-200">
        <button
          onClick={resetAssessment}
          className="px-6 py-2.5 rounded-lg border border-navy-300 text-navy-700 font-medium hover:bg-navy-100 transition-colors"
        >
          Start New Assessment
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (riskScore) {
                generateFreePDF(
                  dimensionScores,
                  riskScore.overallRisk,
                  riskScore.riskLevel,
                  riskScore.achieverScore,
                  profile.organizationName || 'Organization',
                  blindSpots
                );
              }
            }}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Export PDF Summary (Free)
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors">
            Unlock Full Report (Pro)
          </button>
        </div>
      </div>
    </div>
  );
}
