import { useAssessmentStore } from '@/store/assessmentStore';

export function WelcomePage() {
  const { nextStep } = useAssessmentStore();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Hero */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">AI</span>
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-3">
          AI Governance & ROI Assessment
        </h1>
        <p className="text-lg text-navy-600">
          Discover your organization's AI governance maturity, identify critical blind spots,
          and get a personalized roadmap to become an AI Achiever.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-200">
          <div className="text-2xl font-bold text-red-600">$67.4B</div>
          <div className="text-xs text-navy-500 mt-1">Lost to AI hallucinations (2024)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-200">
          <div className="text-2xl font-bold text-amber-600">3-5</div>
          <div className="text-xs text-navy-500 mt-1">AI tools per employee, most unapproved</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-navy-200">
          <div className="text-2xl font-bold text-emerald-600">12%</div>
          <div className="text-xs text-navy-500 mt-1">Achieve "AI Achiever" status</div>
        </div>
      </div>

      {/* What you'll get */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-navy-200 mb-8 text-left">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">What You'll Get</h2>
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
              <span className="text-emerald-500 mt-0.5 shrink-0">{'\u2713'}</span>
              <span className="text-sm text-navy-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time estimate */}
      <p className="text-sm text-navy-500 mb-6">
        Estimated time: 20-30 minutes &middot; 60 questions across 6 dimensions &middot;
        Your data stays on this device
      </p>

      {/* CTA */}
      <button
        onClick={nextStep}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
      >
        Start Assessment
      </button>
    </div>
  );
}
