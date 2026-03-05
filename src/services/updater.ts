import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'up-to-date' }
  | { state: 'available'; update: Update; version: string; notes: string }
  | { state: 'downloading'; progress: number } // 0–100
  | { state: 'ready' }
  | { state: 'error'; message: string };

/**
 * Check for an available update.
 * Returns the update object if one is available, or null if already up to date.
 * Throws on network or verification errors.
 */
export async function checkForUpdate(): Promise<Update | null> {
  const update = await check();
  return update ?? null;
}

/**
 * Download and install an update, reporting progress via onProgress callback (0–100).
 * After installation completes, call relaunchApp() to apply.
 */
export async function downloadAndInstall(
  update: Update,
  onProgress?: (percent: number) => void,
): Promise<void> {
  let downloaded = 0;
  let total = 0;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case 'Started':
        total = event.data.contentLength ?? 0;
        onProgress?.(0);
        break;
      case 'Progress':
        downloaded += event.data.chunkLength;
        if (total > 0) {
          onProgress?.(Math.round((downloaded / total) * 100));
        }
        break;
      case 'Finished':
        onProgress?.(100);
        break;
    }
  });
}

/**
 * Relaunch the app to apply the installed update.
 */
export async function relaunchApp(): Promise<void> {
  await relaunch();
}
