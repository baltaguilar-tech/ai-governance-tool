import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { RiskGauge } from './RiskGauge';
import { DimensionRadar } from './DimensionRadar';
import { BlindSpotsList } from './BlindSpotsList';
import { RecommendationsList } from './RecommendationsList';
import { AchieverProgress } from './AchieverProgress';
import { generateFreePDF, generateProPDF } from '@/utils/pdfExport';
import { getQuestionsForProfile } from '@/data/questions/index';
import { MaturityLevel, type OrganizationProfile } from '@/types/assessment';
import { getEmailPrefs, saveCompletedAssessment, seedMitigationItems } from '@/services/db';
import { EmailCaptureModal } from '@/components/modals/EmailCaptureModal';
import { TrackProgress } from '@/components/dashboard/TrackProgress';

// Persists across React remounts within the same app session.
// Resets on app restart, which is intentional — show again next session if no email saved.
let _emailModalDismissed = false;

export function ResultsDashboard() {
  const { riskScore, dimensionScores, blindSpots, recommendations, responses, profile, resetAssessment, licenseTier } =
    useAssessmentStore();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'progress'>('results');
  const [currentAssessmentId, setCurrentAssessmentId] = useState<number>(-1);

  useEffect(() => {
    if (_emailModalDismissed) return;
    getEmailPrefs().then((prefs) => {
      if (!prefs) setShowEmailModal(true);
    });
  }, []);

  // Auto-save completed assessment snapshot + seed mitigation items on first Results render.
  // Uses currentAssessmentId > 0 as guard — React state resets when user starts a new assessment.
  useEffect(() => {
    if (currentAssessmentId > 0 || !riskScore) return;
    saveCompletedAssessment({
      profile: profile as OrganizationProfile,
      overallScore: riskScore.overallRisk,
      riskLevel: riskScore.riskLevel,
      dimensionScores,
      achieverScore: riskScore.achieverScore,
      blindSpots,
      completedAt: new Date().toISOString(),
      assessmentVersion: 1,
    }).then((id) => {
      if (id > 0) {
        setCurrentAssessmentId(id);
        seedMitigationItems(id, blindSpots);
      }
    });
  }, [riskScore]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Tab navigation */}
      <div className="flex border-b border-navy-200 mb-8">
        <button
          onClick={() => setActiveTab('results')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'results'
              ? 'border-[#1E2761] text-[#1E2761]'
              : 'border-transparent text-navy-500 hover:text-navy-700'
          }`}
        >
          Assessment Results
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'progress'
              ? 'border-[#1E2761] text-[#1E2761]'
              : 'border-transparent text-navy-500 hover:text-navy-700'
          }`}
        >
          Track Progress
        </button>
      </div>

      {activeTab === 'progress' && (
        <TrackProgress
          assessmentId={currentAssessmentId}
          currentScore={riskScore.overallRisk}
          dimensionScores={dimensionScores}
        />
      )}

      {activeTab === 'results' && (
      <>
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
          {import.meta.env.DEV && (
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
          )}
        </div>
      </div>

      {/* Top-level scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RiskGauge score={riskScore.overallRisk} level={riskScore.riskLevel} />
        <DimensionRadar dimensionScores={dimensionScores} />
        <div>
          <AchieverProgress
            score={riskScore.achieverScore}
            currentMaturity={riskScore.currentMaturity}
            targetMaturity={riskScore.targetMaturity}
          />
          <p className="text-xs text-navy-400 mt-2">
            Includes self-reported maturity adjustment
          </p>
        </div>
      </div>

      {/* Estimated Regulatory Exposure */}
      {(() => {
        const revenueBand = profile.annualRevenue;
        const revenueMidpoints: Record<string, number> = {
          'Under $10M': 5_000_000,
          '$10M–$50M': 30_000_000,
          '$10M-$50M': 30_000_000,
          '$50M–$250M': 150_000_000,
          '$50M-$250M': 150_000_000,
          '$250M–$1B': 625_000_000,
          '$250M-$1B': 625_000_000,
          'Over $1B': 1_000_000_000,
        };
        const revenueMidpoint = revenueBand ? revenueMidpoints[revenueBand] : null;

        if (!revenueMidpoint) return null;

        const riskMultipliers: Record<string, number> = {
          CRITICAL: 0.07,
          HIGH: 0.04,
          MEDIUM: 0.02,
          LOW: 0.005,
        };
        const multiplier = riskMultipliers[riskScore.riskLevel] || 0.02;
        const exposure = revenueMidpoint * multiplier;

        const formatExposure = (value: number): string => {
          if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)}m`;
          } else if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(1)}k`;
          }
          return `$${Math.round(value)}`;
        };

        return (
          <div className="bg-white rounded-xl border border-navy-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Estimated Regulatory Exposure</h3>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-red-600">{formatExposure(exposure)}</span>
              <span className="text-sm text-navy-600">potential annual exposure</span>
            </div>
            <p className="text-xs text-navy-500">
              Based on your revenue band ({revenueBand}) and {riskScore.riskLevel.toLowerCase()} risk level. For reference only.
            </p>
          </div>
        );
      })()}

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
          {/* Free PDF summary — always available */}
          <button
            onClick={() => {
              if (!riskScore) return;
              const orgName = profile.organizationName || 'Organization';
              generateFreePDF(
                dimensionScores,
                riskScore.overallRisk,
                riskScore.riskLevel,
                riskScore.achieverScore,
                orgName,
                blindSpots,
                profile as import('@/types/assessment').OrganizationProfile
              ).catch((err) => {
                console.error('PDF export failed:', err);
              });
            }}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Export PDF Summary
          </button>

          {/* Pro full report — active for pro, locked for free */}
          {licenseTier === 'professional' ? (
            <button
              onClick={() => {
                if (!riskScore) return;
                const orgName = profile.organizationName || 'Organization';
                generateProPDF(
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
                ).catch((err) => {
                  console.error('PDF export failed:', err);
                });
              }}
              className="px-6 py-2.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors"
            >
              Export Full PDF Report
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="px-6 py-2.5 rounded-lg bg-navy-200 text-navy-400 font-medium cursor-not-allowed flex items-center gap-2"
              >
                <span>&#128274;</span>
                Export Full PDF Report
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-navy-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Full PDF report with all blind spots, recommendations, and implementation roadmap is available on Pro.
                <div className="absolute top-full right-4 border-4 border-transparent border-t-navy-900" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score disclaimer */}
      <p className="text-xs text-navy-400 mt-6 text-center leading-relaxed">
        Scores are based on self-reported responses and reflect your organization&apos;s current AI governance
        maturity as you understand it. This assessment is indicative only — it is not a legal compliance
        audit and does not constitute professional or legal advice. Regulatory exposure estimates are
        illustrative and should not be relied upon for legal or financial decisions.
      </p>

      {/* Email reminder modal — shown once per session until email is saved */}
      {showEmailModal && (
        <EmailCaptureModal
          onClose={() => { _emailModalDismissed = true; setShowEmailModal(false); }}
          onSaved={() => setShowEmailModal(false)}
        />
      )}
      </>
      )}
    </div>
  );
}
