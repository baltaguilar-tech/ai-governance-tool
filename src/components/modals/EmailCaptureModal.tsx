import { useState } from 'react';
import { saveEmailPrefs } from '@/services/db';
import type { EmailPrefs } from '@/types/assessment';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function EmailCaptureModal({ onClose, onSaved }: Props) {
  const [email, setEmail] = useState('');
  const [reminderDays, setReminderDays] = useState<30 | 60 | 90>(30);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSaving(true);
    const prefs: EmailPrefs = { email: email.trim(), reminderDays, optedIn: true };
    await saveEmailPrefs(prefs);
    // TODO Step 7: call registerEmailReminder(email, reminderDays) — Cloudflare Worker
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-[#1E2761] px-6 py-5">
          <h2 className="text-white text-xl font-semibold">Stay on top of your AI governance</h2>
          <p className="text-[#CADCFC] text-sm mt-1">
            Governance erodes fast. A reminder keeps your score current.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your work email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent"
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send me a reminder every
            </label>
            <div className="flex gap-3">
              {([30, 60, 90] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setReminderDays(days)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    reminderDays === days
                      ? 'bg-[#1E2761] text-white border-[#1E2761]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E2761]'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Used only for governance reminders. No marketing, ever. Unsubscribe anytime.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#2a3580] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Set Reminder'}
          </button>
        </div>

      </div>
    </div>
  );
}
