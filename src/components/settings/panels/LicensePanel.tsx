import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import type { LicenseTier } from '@/types/assessment';

function LicenseBadge({ tier }: { tier: LicenseTier }) {
  if (tier === 'professional') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Professional
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Free Plan
    </span>
  );
}

export function LicensePanel() {
  const licenseTier = useAssessmentStore((s) => s.licenseTier);
  const setLicenseTier = useAssessmentStore((s) => s.setLicenseTier);
  const pendingLicenseKey = useAssessmentStore((s) => s.pendingLicenseKey);
  const setPendingLicenseKey = useAssessmentStore((s) => s.setPendingLicenseKey);
  const [keyInput, setKeyInput] = useState('');

  // Pre-fill key input when arriving via aigov://activate?key=XXXX deep link
  useEffect(() => {
    if (pendingLicenseKey) {
      setKeyInput(pendingLicenseKey);
      setPendingLicenseKey(null); // consume — don't re-apply on re-renders
    }
  }, [pendingLicenseKey, setPendingLicenseKey]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">License Key</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your license and plan features.</p>
      </div>

      {/* Current status */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">License Status</span>
        <LicenseBadge tier={licenseTier} />
      </div>

      <hr className="border-gray-200" />

      {/* Activate section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Activate License</h3>
        <p className="text-sm text-gray-600">
          Enter your license key below or scan the QR code from your purchase confirmation email.
        </p>
        <input
          type="text"
          value={keyInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyInput(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono tracking-widest placeholder:tracking-widest placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            title="Licensing coming soon"
            className="flex-1 py-2 px-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed border border-gray-200"
          >
            Activate Key
          </button>
          <button
            type="button"
            disabled
            title="Scan the QR code from your purchase email using your phone's camera"
            className="flex-1 py-2 px-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed border border-gray-200"
          >
            Scan QR Code
          </button>
        </div>
        <p className="text-xs text-gray-400">
          QR activation: scan the code with your phone — your license will activate automatically on this device.
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* Upgrade section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Need a License?</h3>
        <p className="text-sm text-gray-600">
          Upgrade to Professional to unlock full dimension breakdowns, implementation roadmaps,
          vendor questionnaires, and PDF/DOCX export.
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {[
            'Full dimension score breakdown',
            'Customized implementation roadmap',
            'Complete 30-question vendor questionnaire',
            '5-dimension ROI dashboard',
            'Full PDF and DOCX export',
            'Assessment history and progress tracking',
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed border border-gray-200"
        >
          View Plans
        </button>
      </div>
      <hr className="border-gray-200" />

      {/* Testing Mode — remove before commercial launch */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Testing Mode</h3>
        <p className="text-xs text-gray-400">
          Simulate tier for UI/UX validation. Does not affect billing.
        </p>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
          <button
            type="button"
            onClick={() => setLicenseTier('free')}
            className={`flex-1 py-1.5 transition-colors ${
              licenseTier === 'free'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => setLicenseTier('professional')}
            className={`flex-1 py-1.5 transition-colors ${
              licenseTier === 'professional'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            Professional
          </button>
        </div>
      </div>
    </div>
  );
}
