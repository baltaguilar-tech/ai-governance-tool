import Database from '@tauri-apps/plugin-sql';
import type { OrganizationProfile, QuestionResponse, WizardStep } from '../types/assessment';

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
        id       INTEGER PRIMARY KEY CHECK (id = 1),
        profile  TEXT    NOT NULL DEFAULT '{}',
        responses TEXT   NOT NULL DEFAULT '[]',
        step     TEXT    NOT NULL DEFAULT 'welcome',
        savedAt  TEXT    NOT NULL
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
      `INSERT OR REPLACE INTO draft_assessment (id, profile, responses, step, savedAt)
       VALUES (1, ?, ?, ?, ?)`,
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
}

export async function loadDraft(): Promise<DraftData | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{ profile: string; responses: string; step: string }[]>(
      'SELECT profile, responses, step FROM draft_assessment WHERE id = 1'
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    return {
      profile: JSON.parse(row.profile) as Partial<OrganizationProfile>,
      responses: JSON.parse(row.responses) as QuestionResponse[],
      step: row.step as WizardStep,
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
