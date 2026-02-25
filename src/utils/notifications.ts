import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { getNotificationSchedule, markMilestoneFired } from '@/services/db';

function isTauriContext(): boolean {
  return '__TAURI_INTERNALS__' in window;
}

const COPY: Record<30 | 60 | 90, { title: string; body: string }> = {
  30: {
    title: 'AI Governance Check-In',
    body: '30 days since your AI governance assessment — time to check your mitigation progress and update your tracker.',
  },
  60: {
    title: 'AI Governance Check-In',
    body: '60 days since your AI governance assessment — review completed actions and close any remaining gaps.',
  },
  90: {
    title: 'AI Governance Check-In',
    body: '90 days since your AI governance assessment — consider running a new assessment to measure your improvement.',
  },
};

/**
 * Request OS notification permission. Call after assessment completion so the
 * user understands the context. Returns true if permission is granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isTauriContext()) return false;
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      const result = await requestPermission();
      granted = result === 'granted';
    }
    return granted;
  } catch {
    return false;
  }
}

/**
 * Called on every app launch. Checks if any 30/60/90-day milestones are past
 * due and fires a local notification for each one, then marks it as fired so
 * it never fires again.
 */
export async function checkDueReminders(): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const granted = await isPermissionGranted();
    if (!granted) return;

    const schedule = await getNotificationSchedule();
    if (!schedule) return;

    const referenceDate = new Date(schedule.referenceAt);
    const now = new Date();
    const daysSince = Math.floor(
      (now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const milestones: { days: 30 | 60 | 90; fired: boolean }[] = [
      { days: 30, fired: schedule.fired30 },
      { days: 60, fired: schedule.fired60 },
      { days: 90, fired: schedule.fired90 },
    ];

    for (const { days, fired } of milestones) {
      if (daysSince >= days && !fired) {
        const copy = COPY[days];
        sendNotification({ title: copy.title, body: copy.body });
        await markMilestoneFired(days);
      }
    }
  } catch (err) {
    console.error('[notifications] checkDueReminders failed:', err);
  }
}
