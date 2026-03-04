import { useAssessmentStore } from '@/store/assessmentStore';

export function WelcomePage() {
  const { nextStep } = useAssessmentStore();

  return (
    <div
      className="px-6 py-12"
      style={{
        // Radial spotlight bloom from top + subtle grid overlay
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(43,92,255,0.18) 0%, transparent 70%)',
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, 40px 40px, 40px 40px',
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Hero icon — placeholder until logo is ready */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <span className="text-3xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            AI Governance & ROI Assessment
          </h1>
          <p className="text-lg text-white/70">
            Discover your organization's AI governance maturity, identify critical blind spots,
            and get a personalized roadmap to become an AI Achiever.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-surface rounded-xl p-4 border border-white/8">
            <div className="text-2xl font-bold text-accent-red">$67.4B</div>
            <div className="text-xs text-white/60 mt-1">Lost to AI hallucinations (2024)</div>
          </div>
          <div className="bg-dark-surface rounded-xl p-4 border border-white/8">
            <div className="text-2xl font-bold text-accent-orange">3-5</div>
            <div className="text-xs text-white/60 mt-1">AI tools per employee, most unapproved</div>
          </div>
          <div className="bg-dark-surface rounded-xl p-4 border border-white/8">
            <div className="text-2xl font-bold text-accent-green">12%</div>
            <div className="text-xs text-white/60 mt-1">Achieve "AI Achiever" status</div>
          </div>
        </div>

        {/* What you'll get */}
        <div className="bg-dark-surface rounded-xl p-6 border border-white/8 mb-8 text-left">
          <h2 className="text-lg font-semibold text-white mb-4">What You'll Get</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Risk scores across 6 governance dimensions',
              'Personalized blind spot analysis',
              'Vendor assessment questionnaire',
              'Implementation roadmap',
              'ROI measurement framework',
              'Regulatory compliance checklist',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-accent-green mt-0.5 shrink-0">{'\u2713'}</span>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time estimate */}
        <p className="text-sm text-white/50 mb-6">
          Estimated time: 10-15 minutes &middot; Up to 60 questions across 6 dimensions &middot;
          Your data stays on this device
        </p>

        {/* CTA */}
        <button
          onClick={nextStep}
          className="text-white font-semibold px-8 py-3 rounded-lg text-lg transition-all shadow-md hover:shadow-xl hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #2B5CFF 0%, #1A44CC 100%)',
          }}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}
