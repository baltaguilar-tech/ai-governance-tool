export function AboutPanel() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">About</h2>
      </div>

      {/* App identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
          AI
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900 leading-tight">
            AI Governance &amp; ROI Assessment Tool
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Version 0.1.0</p>
        </div>
      </div>

      <p className="text-sm italic text-navy-500">
        "AI governance for orgs that don't have an AI governance team"
      </p>

      <hr className="border-gray-200" />

      {/* Legal */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Legal</h3>
        <p className="text-xs text-gray-500">
          &copy; 2026 baltaguilar-tech. All rights reserved.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="text-sm text-blue-400 cursor-not-allowed underline underline-offset-2 decoration-dotted"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="text-sm text-blue-400 cursor-not-allowed underline underline-offset-2 decoration-dotted"
          >
            Terms of Service
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Support */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Support</h3>
        <p className="text-sm text-gray-600">Questions or issues? We're here to help.</p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact Support
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Documentation
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Small print */}
      <p className="text-xs text-gray-400">
        This tool stores all assessment data locally on your device. No data is transmitted to
        external servers without your consent.
      </p>
    </div>
  );
}
