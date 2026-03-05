import { useState } from 'react';
import type { Update } from '@tauri-apps/plugin-updater';
import {
  checkForUpdate,
  downloadAndInstall,
  relaunchApp,
  type UpdateStatus,
} from '@/services/updater';

const APP_VERSION = '0.1.0';

function StatusBadge({ status }: { status: UpdateStatus }) {
  if (status.state === 'up-to-date') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Up to date
      </span>
    );
  }
  if (status.state === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Update available
      </span>
    );
  }
  if (status.state === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Restart required
      </span>
    );
  }
  return null;
}

export function UpdatesPanel() {
  const [status, setStatus] = useState<UpdateStatus>({ state: 'idle' });
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);

  async function handleCheck() {
    setStatus({ state: 'checking' });
    try {
      const update = await checkForUpdate();
      if (update) {
        setPendingUpdate(update);
        setStatus({
          state: 'available',
          update,
          version: update.version,
          notes: update.body ?? '',
        });
      } else {
        setStatus({ state: 'up-to-date' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus({ state: 'error', message });
    }
  }

  async function handleInstall() {
    if (!pendingUpdate) return;
    setStatus({ state: 'downloading', progress: 0 });
    try {
      await downloadAndInstall(pendingUpdate, (progress) => {
        setStatus({ state: 'downloading', progress });
      });
      setStatus({ state: 'ready' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus({ state: 'error', message });
    }
  }

  const isChecking = status.state === 'checking';
  const isDownloading = status.state === 'downloading';
  const isBusy = isChecking || isDownloading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">Software Updates</h2>
        <p className="text-sm text-gray-500 mt-0.5">Keep AlphaPi up to date.</p>
      </div>

      {/* Current version row */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-700">Current version</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">v{APP_VERSION}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Check / state-specific UI */}
      <div className="space-y-3">
        {/* Check for updates button */}
        {(status.state === 'idle' ||
          status.state === 'up-to-date' ||
          status.state === 'checking') && (
          <button
            type="button"
            onClick={handleCheck}
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                <svg className="animate-spin w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking for updates\u2026
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                Check for Updates
              </>
            )}
          </button>
        )}

        {/* Up to date notice */}
        {status.state === 'up-to-date' && (
          <div className="flex gap-2 px-3 py-2.5 bg-green-50 border border-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-green-500 mt-0.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <p className="text-xs text-green-700">AlphaPi is up to date.</p>
          </div>
        )}

        {/* Update available */}
        {status.state === 'available' && (
          <div className="space-y-3">
            <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-900">Version {status.version}</p>
              </div>
              {status.notes && (
                <p className="text-xs text-blue-700 whitespace-pre-wrap leading-relaxed">
                  {status.notes}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleInstall}
              className="w-full py-2 px-3 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#1a2255] transition-colors"
            >
              Download &amp; Install
            </button>
          </div>
        )}

        {/* Downloading progress */}
        {status.state === 'downloading' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Downloading update\u2026</span>
              <span className="font-mono">{status.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-[#1E2761] rounded-full transition-all duration-200"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Ready to relaunch */}
        {status.state === 'ready' && (
          <div className="space-y-3">
            <div className="flex gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-amber-600 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <p className="text-xs text-amber-800">
                Update installed. Restart AlphaPi to apply the new version.
              </p>
            </div>
            <button
              type="button"
              onClick={relaunchApp}
              className="w-full py-2 px-3 rounded-lg bg-[#1E2761] text-white text-sm font-medium hover:bg-[#1a2255] transition-colors"
            >
              Restart Now
            </button>
          </div>
        )}

        {/* Error state */}
        {status.state === 'error' && (
          <div className="space-y-3">
            <div className="flex gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-red-500 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
              <p className="text-xs text-red-700 break-all">{status.message}</p>
            </div>
            <button
              type="button"
              onClick={handleCheck}
              className="w-full py-2 px-3 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      <p className="text-xs text-gray-400">
        Updates are downloaded directly from GitHub Releases and verified with a cryptographic
        signature before installation.
      </p>
    </div>
  );
}
