import { useState, useEffect, useRef } from 'react';
import { Store } from '@tauri-apps/plugin-store';

interface ScheduleRow {
  label: string;
  description: string;
}

const SCHEDULE_ROWS: ScheduleRow[] = [
  {
    label: '30 days',
    description: 'Initial check-in — review quick wins from your playbook',
  },
  {
    label: '60 days',
    description: 'Mid-point review — assess mitigation progress',
  },
  {
    label: '90 days',
    description: 'Quarterly review — consider re-assessment to measure improvement',
  },
];

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-gray-400">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function NotificationsPanel() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSetting() {
      try {
        const store = await Store.load('settings.json');
        storeRef.current = store;
        const value = await store.get<boolean>('notificationsEnabled');
        if (!cancelled) {
          setEnabled(value ?? true);
        }
      } catch (err) {
        console.error('[NotificationsPanel] Failed to load settings:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadSetting();
    return () => { cancelled = true; };
  }, []);

  async function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    try {
      if (storeRef.current) {
        await storeRef.current.set('notificationsEnabled', next);
        await storeRef.current.save();
      }
    } catch (err) {
      console.error('[NotificationsPanel] Failed to save notification setting:', err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage on-device assessment reminders.</p>
      </div>

      {/* Main toggle */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading settings…
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-800">Assessment reminders</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive reminders at 30, 60, and 90 days after your assessment
                </p>
              </div>
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  enabled ? 'bg-[#1E2761]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Status info box */}
            {enabled ? (
              <div className="flex gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-blue-500 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <p className="text-xs text-blue-700">
                  You'll be reminded to review your governance score and track your progress at
                  30, 60, and 90 days.
                </p>
              </div>
            ) : (
              <div className="flex gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-gray-400 mt-0.5">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
                <p className="text-xs text-gray-500">
                  Reminders are off. You can re-enable them at any time.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Schedule info */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Notification Schedule</h3>
        <ul className="space-y-3">
          {SCHEDULE_ROWS.map((row) => (
            <li key={row.label} className="flex items-start gap-3">
              <div className="flex items-center gap-1.5 w-20 flex-shrink-0 mt-0.5">
                <ClockIcon />
                <span className="text-xs font-medium text-gray-600 tabular-nums">{row.label}</span>
              </div>
              <p className="text-xs text-gray-500">{row.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200" />

      <p className="text-xs text-gray-400">
        Notifications are delivered on this device only. No data is shared.
      </p>
    </div>
  );
}
