import { useEffect, useRef } from 'react';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

const PRIVACY_POLICY = `AlphaPi Privacy Policy
Effective: March 2026

1. DATA WE COLLECT
AlphaPi stores your assessment responses, organization profile, and app preferences in a local SQLite database on your device. This data never leaves your device unless you explicitly export a report.

2. DATA WE DO NOT COLLECT
We do not collect telemetry, usage analytics, crash reports, or behavioral data. There is no tracking, no "phone home" feature, and no analytics SDK embedded in this application.

3. EMAIL ADDRESS
If you provide an email address in Settings, it is stored locally on your device only. It is used solely to pre-populate PDF reports you generate. It is never transmitted to us or any third party.

4. LICENSE KEY VALIDATION
If you activate a Professional license, your license key is validated via Keygen.sh's API over an encrypted HTTPS connection. Only the license key itself is transmitted — no assessment data, profile data, or personal information is included in this request.

5. SOFTWARE UPDATES
The app periodically checks GitHub Releases for available updates. This is a standard authenticated HTTPS request to api.github.com. No personal data or assessment data is included in these requests.

6. REGULATORY CONTENT
The app may download regulatory guidance content (questions, scoring weights) from our CDN. This is a standard HTTPS GET request. No personal data is included.

7. THIRD-PARTY SERVICES
The only third-party network contact made by this app is:
  • Keygen.sh — license key validation (Professional tier only)
  • GitHub API — update checks
  • Our CDN — regulatory content updates

8. DATA DELETION
You can delete all local assessment data from Settings > My Data at any time. Uninstalling the application removes all application data stored on your device.

9. CHILDREN
This application is not directed to individuals under 18 years of age.

10. CHANGES
We may update this Privacy Policy. The effective date above will be updated when changes are made. Continued use of the application after changes constitutes acceptance of the updated policy.

11. CONTACT
For privacy questions: support@alphapi.com`;

const TERMS_OF_SERVICE = `AlphaPi Terms of Service
Effective: March 2026

1. LICENSE
AlphaPi is licensed, not sold. Your license — Free or Professional — grants you a non-exclusive, non-transferable, revocable right to install and use the software on one device for your own internal business purposes.

2. PERMITTED USE
You may use AlphaPi to assess your organization's AI governance posture, generate reports, and track improvement over time. You may share exported PDF or DOCX reports with colleagues and advisors.

3. PROHIBITED USE
You may not:
  • Sublicense, sell, rent, or redistribute the software
  • Reverse-engineer, decompile, or disassemble the software
  • Use the software to build a competing product
  • Remove or obscure any copyright or attribution notices

4. IMPORTANT DISCLAIMER — NOT LEGAL ADVICE
AlphaPi provides informational guidance based on publicly available regulatory frameworks and industry best practices. THIS IS NOT LEGAL ADVICE. Assessment scores, recommendations, and regulatory summaries do not constitute legal opinions, compliance certifications, or guarantees of regulatory adherence. Consult qualified legal counsel before making compliance decisions.

5. NO WARRANTY
The software is provided "as is" without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that assessment scores, recommendations, or regulatory content are complete, accurate, or current.

6. LIMITATION OF LIABILITY
To the maximum extent permitted by applicable law, baltaguilar-tech and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use AlphaPi, even if advised of the possibility of such damages.

7. INDEMNIFICATION
You agree to indemnify and hold harmless baltaguilar-tech from any claims, damages, or expenses arising from your use of the software or violation of these Terms.

8. TERMINATION
Your license terminates automatically if you violate these Terms. Upon termination, you must stop using the software and delete all copies.

9. GOVERNING LAW
These Terms are governed by the laws of the jurisdiction in which baltaguilar-tech is incorporated. [To be updated upon company formation.]

10. CHANGES
We may update these Terms at any time. Continued use of the software after changes constitutes acceptance of the revised Terms.

11. ENTIRE AGREEMENT
These Terms, together with the Privacy Policy, constitute the entire agreement between you and baltaguilar-tech regarding AlphaPi.

12. CONTACT
For questions about these Terms: support@alphapi.com`;

const TITLES: Record<LegalDocType, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

const CONTENT: Record<LegalDocType, string> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_SERVICE,
};

export function LegalModal({ type, onClose }: LegalModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on backdrop click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-navy-900">{TITLES[type]}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">
            {CONTENT[type]}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#1a2255] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
