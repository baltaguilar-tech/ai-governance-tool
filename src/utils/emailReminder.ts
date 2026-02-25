/**
 * Registers a one-time email reminder with the Cloudflare Worker.
 *
 * The Worker URL is set via the VITE_REMINDER_WORKER_URL build-time env var.
 * If the var is not set (e.g. during development before the Worker is deployed),
 * the call is skipped silently — the local notification system still fires.
 *
 * To enable:
 *   1. Deploy the Worker (see worker/wrangler.toml for setup steps)
 *   2. Add to ~/Projects/ai-governance-tool/.env.local:
 *      VITE_REMINDER_WORKER_URL=https://ai-governance-reminder.<account>.workers.dev
 *   3. Rebuild: npm run tauri build
 */

const WORKER_URL = import.meta.env.VITE_REMINDER_WORKER_URL as string | undefined;

export async function registerEmailReminder(
  email: string,
  reminderDays: 30 | 60 | 90,
  deepLinkPath: string
): Promise<void> {
  if (!WORKER_URL) {
    // Worker not deployed yet — local notifications still fire on app launch.
    return;
  }

  try {
    const res = await fetch(`${WORKER_URL}/schedule-reminder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, reminderDays, deepLinkPath }),
    });

    if (!res.ok) {
      console.error('[emailReminder] Worker responded with', res.status);
    }
  } catch (err) {
    // Non-blocking — don't surface network errors to the user.
    console.error('[emailReminder] Failed to register reminder:', err);
  }
}
