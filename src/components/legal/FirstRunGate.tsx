import { useState } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { LegalModal, type LegalDocType } from './LegalModal';

interface FirstRunGateProps {
  onAccept: () => void;
}

export function FirstRunGate({ onAccept }: FirstRunGateProps) {
  const [modalType, setModalType] = useState<LegalDocType | null>(null);
  const [accepting, setAccepting] = useState(false);

  async function handleAccept() {
    setAccepting(true);
    try {
      const store = await Store.load('settings.json');
      await store.set('legalAccepted', true);
      await store.save();
    } catch {
      // Non-fatal — proceed anyway so users are never stuck
    }
    onAccept();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1E2761] p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
          {/* Logo / identity */}
          <div className="flex items-center gap-3">
            <img src="/assets/alphapi-icon.png" alt="AlphaPi" className="w-10 h-10 object-contain flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1E2761] leading-tight">AlphaPi</p>
              <p className="text-xs text-gray-500">AI Governance &amp; ROI Assessment</p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#1E2761]">Welcome to AlphaPi</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Before you begin, please review our Privacy Policy and Terms of Service.
            </p>
          </div>

          {/* Key data facts */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 space-y-1.5">
            {[
              'All assessment data stays on your device',
              'No telemetry or usage tracking',
              'No cloud sync — fully offline',
            ].map((fact) => (
              <div key={fact} className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="text-xs text-blue-800">{fact}</span>
              </div>
            ))}
          </div>

          {/* Document links */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setModalType('privacy')}
              className="text-sm text-[#1E2761] underline underline-offset-2 hover:text-blue-700 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setModalType('terms')}
              className="text-sm text-[#1E2761] underline underline-offset-2 hover:text-blue-700 transition-colors"
            >
              Terms of Service
            </button>
          </div>

          {/* Accept button */}
          <button
            type="button"
            onClick={handleAccept}
            disabled={accepting}
            className="w-full py-3 px-4 rounded-xl bg-[#1E2761] text-white text-sm font-semibold hover:bg-[#1a2255] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {accepting ? 'Continuing\u2026' : 'Accept & Continue'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By continuing, you agree to the Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>

      {modalType && (
        <LegalModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </>
  );
}
