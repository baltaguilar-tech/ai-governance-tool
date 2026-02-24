import { useAssessmentStore } from '@/store/assessmentStore';
import { RiskGauge } from './RiskGauge';
import { DimensionRadar } from './DimensionRadar';
import { BlindSpotsList } from './BlindSpotsList';
import { RecommendationsList } from './RecommendationsList';
import { AchieverProgress } from './AchieverProgress';
import { generateFreePDF, generateProPDF } from '@/utils/pdfExport';
import { getQuestionsForProfile } from '@/data/questions/index';
import { MaturityLevel } from '@/types/assessment';

export function ResultsDashboard() {
  const { riskScore, dimensionScores, blindSpots, recommendations, responses, profile, resetAssessment, licenseTier } =
    useAssessmentStore();

  if (!riskScore) return null;

  const handleToggleTier = () => {
    const store = useAssessmentStore.getState();
    const newTier = store.licenseTier === 'free' ? 'professional' : 'free';
    useAssessmentStore.setState({ licenseTier: newTier });
    // Recalculate so recommendations reflect the new tier
    store.calculateResults();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              Assessment Results: {profile.organizationName}
            </h2>
            <p className="text-navy-600">
              Completed on {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
          <button
            onClick={handleToggleTier}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              licenseTier === 'professional'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-navy-100 text-navy-600 border border-navy-300'
            }`}
          >
            {licenseTier === 'professional' ? 'PRO Active' : 'FREE Tier'} (click to toggle)
          </button>
        </div>
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
                    ds.score >= 70
                      ? 'bg-emerald-500'
                      : ds.score >= 40
                      ? 'bg-amber-500'
                      : ds.score >= 20
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${ds.score}%` }}
                />
              </div>
              <div className="w-20 text-right">
                <span
                  className={`text-sm font-semibold ${
                    ds.score >= 70
                      ? 'text-emerald-600'
                      : ds.score >= 40
                      ? 'text-amber-600'
                      : ds.score >= 20
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}
                >
                  {ds.score}/100
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  ds.score >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : ds.score >= 40
                    ? 'bg-amber-100 text-amber-700'
                    : ds.score >= 20
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
          Higher scores = stronger governance. Scores below 40 require immediate attention.
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
              if (!riskScore) return;
              const orgName = profile.organizationName || 'Organization';
              const exportFn =
                licenseTier === 'professional'
                  ? generateProPDF(
                      dimensionScores,
                      riskScore.overallRisk,
                      riskScore.riskLevel,
                      riskScore.achieverScore,
                      orgName,
                      blindSpots,
                      recommendations,
                      responses,
                      getQuestionsForProfile(profile.aiMaturityLevel ?? MaturityLevel.Experimenter, profile.operatingRegions ?? []),
                      profile as import('@/types/assessment').OrganizationProfile
                    )
                  : generateFreePDF(
                      dimensionScores,
                      riskScore.overallRisk,
                      riskScore.riskLevel,
                      riskScore.achieverScore,
                      orgName,
                      blindSpots,
                      profile as import('@/types/assessment').OrganizationProfile
                    );
              exportFn.catch((err) => {
                console.error('PDF export failed:', err);
              });
            }}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {licenseTier === 'professional' ? 'Export Full PDF Report' : 'Export PDF Summary'}
          </button>
          {licenseTier === 'free' && (
            <button className="px-6 py-2.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
