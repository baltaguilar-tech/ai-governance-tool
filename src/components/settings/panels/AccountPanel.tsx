import { useState, useEffect, useRef } from 'react';
import { Store } from '@tauri-apps/plugin-store';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function AccountPanel() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const store = await Store.load('settings.json');
        storeRef.current = store;
        const value = await store.get<string>('anthropicApiKey');
        if (!cancelled) {
          setApiKey(value ?? '');
        }
      } catch (err) {
        console.error('[AccountPanel] Failed to load settings:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadSettings();
    return () => { cancelled = true; };
  }, []);

  function isValidKeyFormat(key: string): boolean {
    return key.startsWith('sk-ant-api03-') && key.length >= 95 && key.length <= 130;
  }

  function getKeyDisplayHint(): string {
    if (!apiKey) return '';
    // Show first 10 chars + masked middle + last 4
    if (apiKey.length > 20) {
      return `${apiKey.slice(0, 10)}${'•'.repeat(apiKey.length - 14)}${apiKey.slice(-4)}`;
    }
    return '•'.repeat(apiKey.length);
  }

  async function handleSave() {
    const trimmed = apiKey.trim();
    if (trimmed && !isValidKeyFormat(trimmed)) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
      return;
    }
    setSaveStatus('saving');
    try {
      if (storeRef.current) {
        await storeRef.current.set('anthropicApiKey', trimmed);
        await storeRef.current.save();
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('[AccountPanel] Failed to save API key:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }

  async function handleClear() {
    setApiKey('');
    setSaveStatus('idle');
    try {
      if (storeRef.current) {
        await storeRef.current.set('anthropicApiKey', '');
        await storeRef.current.save();
      }
    } catch (err) {
      console.error('[AccountPanel] Failed to clear API key:', err);
    }
  }

  const hasFormatError =
    saveStatus === 'error' && apiKey.trim().length > 0 && !isValidKeyFormat(apiKey.trim());

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">Account</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure AI-powered features for your assessment.
        </p>
      </div>

      {/* API Key section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-navy-900">Anthropic API Key</h3>
          {apiKey && !loading && (
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
              Configured
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Required to generate AI-powered Executive Summaries. Your key is stored locally
          on this device and is never transmitted to AlphaPi servers.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
            <svg
              className="animate-spin w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        ) : (
          <>
            {/* Input row */}
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setApiKey(e.target.value.trim());
                  setSaveStatus('idle');
                }}
                placeholder="sk-ant-api03-..."
                className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasFormatError
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Display hint when key is saved and field is masked */}
            {apiKey && !showKey && (
              <p className="text-xs text-gray-400 font-mono">{getKeyDisplayHint()}</p>
            )}

            {/* Format error */}
            {hasFormatError && (
              <p className="text-xs text-red-600">
                Invalid key format. Anthropic API keys begin with{' '}
                <code className="font-mono bg-red-50 px-1 rounded">sk-ant-api03-</code>{' '}
                and are ~108 characters. Spaces are auto-removed.
              </p>
            )}

            {/* Save error (non-format) */}
            {saveStatus === 'error' && !hasFormatError && (
              <p className="text-xs text-red-600">Failed to save. Please try again.</p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-4 py-2 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#2a3580] disabled:opacity-50 transition-colors"
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Save Key'}
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}

              {saveStatus === 'success' && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Saved!
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Consent + info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-blue-800">About this key</p>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Stored locally on this device — never uploaded to AlphaPi servers</li>
          <li>Used only to generate your Executive Summary via Anthropic's API</li>
          <li>Anthropic does not use API request data for model training</li>
          <li>
            Obtain your key at{' '}
            <span className="font-mono text-blue-800">console.anthropic.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
