import { useState, useEffect } from 'react';
import { getEmailPrefs, saveEmailPrefs } from '@/services/db';
import type { EmailPrefs } from '@/types/assessment';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function EmailPanel() {
  const [reminderEmail, setReminderEmail] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadPrefs() {
      try {
        const prefs = await getEmailPrefs();
        if (!cancelled) {
          setReminderEmail(prefs?.email ?? '');
        }
      } catch (err) {
        console.error('[EmailPanel] Failed to load email prefs:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPrefs();
    return () => { cancelled = true; };
  }, []);

  async function handleSave() {
    setSaveStatus('saving');
    try {
      const prefs: EmailPrefs = {
        email: reminderEmail.trim(),
        reminderDays: 30,
        optedIn: reminderEmail.trim().length > 0,
      };
      await saveEmailPrefs(prefs);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('[EmailPanel] Failed to save email prefs:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">Email Preferences</h2>
        <p className="text-sm text-gray-500 mt-0.5">Control how we contact you about your assessment.</p>
      </div>

      {/* Reminder email section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Reminder Email</h3>
        <p className="text-sm text-gray-600">
          We'll send assessment reminders at 30, 60, and 90 days to help you stay on top of your
          AI governance progress.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading preferences…
          </div>
        ) : (
          <>
            <input
              type="email"
              value={reminderEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setReminderEmail(e.target.value);
                setSaveStatus('idle');
              }}
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-4 py-2 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#2a3580] disabled:opacity-50 transition-colors"
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Save'}
              </button>

              {saveStatus === 'success' && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Saved!
                </span>
              )}

              {saveStatus === 'error' && (
                <span className="text-sm text-red-600">
                  Failed to save. Please try again.
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400">
              You can unsubscribe at any time by clearing this field and saving.
            </p>
          </>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* License email section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">License Email</h3>
        <p className="text-sm text-gray-600">
          The email address associated with your license.
        </p>
        <input
          type="email"
          value=""
          readOnly
          placeholder="--"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-default focus:outline-none"
        />
        <p className="text-xs text-gray-400">
          To change your license email, contact support.
        </p>
      </div>
    </div>
  );
}
