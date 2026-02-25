import Database from '@tauri-apps/plugin-sql';
import type {
  OrganizationProfile,
  QuestionResponse,
  WizardStep,
  SpendItem,
  AdoptionSnapshot,
  EmailPrefs,
} from '../types/assessment';

const DB_PATH = 'sqlite:governance-draft.db';
let _db: Database | null = null;

function isTauriContext(): boolean {
  return '__TAURI_INTERNALS__' in window;
}

async function getDb(): Promise<Database> {
  if (!_db) _db = await Database.load(DB_PATH);
  return _db;
}

export async function initDatabase(): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS draft_assessment (
        id              INTEGER PRIMARY KEY CHECK (id = 1),
        profile         TEXT    NOT NULL DEFAULT '{}',
        responses       TEXT    NOT NULL DEFAULT '[]',
        step            TEXT    NOT NULL DEFAULT 'welcome',
        schemaVersion   INTEGER NOT NULL DEFAULT 1,
        savedAt         TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS spend_items (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        name            TEXT    NOT NULL,
        cost_type       TEXT    NOT NULL,
        amount          REAL    NOT NULL,
        prorate_months  INTEGER NOT NULL DEFAULT 1,
        monthly_equiv   REAL    NOT NULL,
        created_at      TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS adoption_snapshots (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        adoption_rate         REAL    NOT NULL,
        headcount             INTEGER NOT NULL,
        hours_saved_per_user  REAL    NOT NULL,
        blended_hourly_rate   REAL    NOT NULL,
        recorded_at           TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS email_prefs (
        id               INTEGER PRIMARY KEY CHECK (id = 1),
        email            TEXT    NOT NULL,
        reminder_days    INTEGER NOT NULL DEFAULT 30,
        opted_in         INTEGER NOT NULL DEFAULT 1,
        last_reminded_at TEXT,
        registered_at    TEXT    NOT NULL
      )
    `);
  } catch (err) {
    console.error('[db] initDatabase failed:', err);
  }
}

export async function saveDraft(
  profile: Partial<OrganizationProfile>,
  responses: QuestionResponse[],
  step: WizardStep
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR REPLACE INTO draft_assessment (id, profile, responses, step, schemaVersion, savedAt)
       VALUES (1, ?, ?, ?, 1, ?)`,
      [
        JSON.stringify(profile),
        JSON.stringify(responses),
        step,
        new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error('[db] saveDraft failed:', err);
  }
}

export interface DraftData {
  profile: Partial<OrganizationProfile>;
  responses: QuestionResponse[];
  step: WizardStep;
  schemaVersion: number;
}

export async function loadDraft(): Promise<DraftData | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{ profile: string; responses: string; step: string; schemaVersion: number }[]>(
      'SELECT profile, responses, step, schemaVersion FROM draft_assessment WHERE id = 1'
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    // Guard: if schemaVersion is missing or not 1, return null to force fresh start
    if (row.schemaVersion !== 1) {
      console.warn('[db] Draft schema version mismatch; discarding stale data');
      return null;
    }
    return {
      profile: JSON.parse(row.profile) as Partial<OrganizationProfile>,
      responses: JSON.parse(row.responses) as QuestionResponse[],
      step: row.step as WizardStep,
      schemaVersion: row.schemaVersion,
    };
  } catch (err) {
    console.error('[db] loadDraft failed:', err);
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute('DELETE FROM draft_assessment WHERE id = 1');
  } catch (err) {
    console.error('[db] clearDraft failed:', err);
  }
}

// ─── Spend Items ──────────────────────────────────────────────────────────────

export async function addSpendItem(
  item: Omit<SpendItem, 'id' | 'createdAt'>
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO spend_items (name, cost_type, amount, prorate_months, monthly_equiv, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item.name, item.costType, item.amount, item.prorateMonths, item.monthlyEquivalent, new Date().toISOString()]
    );
  } catch (err) {
    console.error('[db] addSpendItem failed:', err);
  }
}

export async function getSpendItems(): Promise<SpendItem[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    const rows = await db.select<{
      id: number; name: string; cost_type: string; amount: number;
      prorate_months: number; monthly_equiv: number; created_at: string;
    }[]>('SELECT * FROM spend_items ORDER BY created_at ASC');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      costType: r.cost_type as SpendItem['costType'],
      amount: r.amount,
      prorateMonths: r.prorate_months,
      monthlyEquivalent: r.monthly_equiv,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error('[db] getSpendItems failed:', err);
    return [];
  }
}

export async function deleteSpendItem(id: number): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute('DELETE FROM spend_items WHERE id = ?', [id]);
  } catch (err) {
    console.error('[db] deleteSpendItem failed:', err);
  }
}

// ─── Adoption Snapshots ───────────────────────────────────────────────────────

export async function saveAdoptionSnapshot(
  snapshot: Omit<AdoptionSnapshot, 'id' | 'recordedAt'>
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO adoption_snapshots (adoption_rate, headcount, hours_saved_per_user, blended_hourly_rate, recorded_at)
       VALUES (?, ?, ?, ?, ?)`,
      [snapshot.adoptionRate, snapshot.headcount, snapshot.hoursSavedPerUser, snapshot.blendedHourlyRate, new Date().toISOString()]
    );
  } catch (err) {
    console.error('[db] saveAdoptionSnapshot failed:', err);
  }
}

export async function getAdoptionSnapshots(): Promise<AdoptionSnapshot[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    const rows = await db.select<{
      id: number; adoption_rate: number; headcount: number;
      hours_saved_per_user: number; blended_hourly_rate: number; recorded_at: string;
    }[]>('SELECT * FROM adoption_snapshots ORDER BY recorded_at ASC');
    return rows.map((r) => ({
      id: r.id,
      adoptionRate: r.adoption_rate,
      headcount: r.headcount,
      hoursSavedPerUser: r.hours_saved_per_user,
      blendedHourlyRate: r.blended_hourly_rate,
      recordedAt: r.recorded_at,
    }));
  } catch (err) {
    console.error('[db] getAdoptionSnapshots failed:', err);
    return [];
  }
}

// ─── Email Preferences ────────────────────────────────────────────────────────

export async function saveEmailPrefs(prefs: EmailPrefs): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR REPLACE INTO email_prefs (id, email, reminder_days, opted_in, last_reminded_at, registered_at)
       VALUES (1, ?, ?, ?, ?, ?)`,
      [
        prefs.email,
        prefs.reminderDays,
        prefs.optedIn ? 1 : 0,
        prefs.lastRemindedAt ?? null,
        prefs.registeredAt ?? new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error('[db] saveEmailPrefs failed:', err);
  }
}

export async function getEmailPrefs(): Promise<EmailPrefs | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{
      email: string; reminder_days: number; opted_in: number;
      last_reminded_at: string | null; registered_at: string;
    }[]>('SELECT email, reminder_days, opted_in, last_reminded_at, registered_at FROM email_prefs WHERE id = 1');
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      email: r.email,
      reminderDays: r.reminder_days as EmailPrefs['reminderDays'],
      optedIn: r.opted_in === 1,
      lastRemindedAt: r.last_reminded_at ?? undefined,
      registeredAt: r.registered_at,
    };
  } catch (err) {
    console.error('[db] getEmailPrefs failed:', err);
    return null;
  }
}
