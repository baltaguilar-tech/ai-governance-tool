import Database from '@tauri-apps/plugin-sql';
import type {
  OrganizationProfile,
  QuestionResponse,
  WizardStep,
  SpendItem,
  AdoptionSnapshot,
  EmailPrefs,
  MitigationItem,
  MitigationStatus,
  CompletedAssessmentSnapshot,
  BlindSpot,
  NotificationSchedule,
  RoiTask,
  RoiModelData,
} from '../types/assessment';

const DB_PATH = 'sqlite:governance-draft.db';
const CURRENT_SCHEMA_VERSION = 1;
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
    // Migration: add schemaVersion if table was created by an older build.
    // SQLite has no ADD COLUMN IF NOT EXISTS — try and ignore the duplicate-column error.
    try {
      await db.execute(
        `ALTER TABLE draft_assessment ADD COLUMN schemaVersion INTEGER NOT NULL DEFAULT 1`
      );
    } catch {
      // Column already present — safe to continue
    }
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
        cost_at_snapshot      REAL    NOT NULL DEFAULT 0,
        recorded_at           TEXT    NOT NULL
      )
    `);
    // Migration: add cost_at_snapshot for installs predating this column
    try {
      await db.execute(
        `ALTER TABLE adoption_snapshots ADD COLUMN cost_at_snapshot REAL NOT NULL DEFAULT 0`
      );
    } catch {
      // Column already present — safe to continue
    }
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
    await db.execute(`
      CREATE TABLE IF NOT EXISTS completed_assessments (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        profile             TEXT    NOT NULL,
        overall_score       INTEGER NOT NULL,
        risk_level          TEXT    NOT NULL,
        dimension_scores    TEXT    NOT NULL,
        achiever_score      INTEGER NOT NULL,
        blind_spots         TEXT    NOT NULL,
        completed_at        TEXT    NOT NULL,
        assessment_version  INTEGER NOT NULL DEFAULT 1
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mitigation_items (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id  INTEGER NOT NULL,
        source_type    TEXT    NOT NULL,
        source_id      TEXT,
        dimension      TEXT    NOT NULL,
        title          TEXT    NOT NULL,
        description    TEXT,
        status         TEXT    NOT NULL DEFAULT 'not_started',
        notes          TEXT,
        completed_at   TEXT,
        created_at     TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notification_schedule (
        id           INTEGER PRIMARY KEY CHECK (id = 1),
        reference_at TEXT    NOT NULL,
        fired_30     INTEGER NOT NULL DEFAULT 0,
        fired_60     INTEGER NOT NULL DEFAULT 0,
        fired_90     INTEGER NOT NULL DEFAULT 0
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_cache (
        key        TEXT    PRIMARY KEY,
        data       TEXT    NOT NULL,
        version    TEXT    NOT NULL,
        fetched_at INTEGER NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ai_summaries (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id  INTEGER NOT NULL UNIQUE,
        prompt_text    TEXT    NOT NULL,
        summary_text   TEXT    NOT NULL,
        model          TEXT    NOT NULL,
        generated_at   TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS roi_tasks (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        name           TEXT    NOT NULL,
        hours_before   REAL    NOT NULL,
        hours_after    REAL    NOT NULL,
        workforce_pct  REAL    NOT NULL,
        created_at     TEXT    NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS roi_model (
        id                    INTEGER PRIMARY KEY CHECK (id = 1),
        headcount             INTEGER NOT NULL DEFAULT 0,
        adoption_rate         REAL    NOT NULL DEFAULT 0,
        blended_hourly_rate   REAL    NOT NULL DEFAULT 0,
        utilization_year      INTEGER NOT NULL DEFAULT 1,
        annual_revenue        REAL    NOT NULL DEFAULT 0,
        revenue_uplift_pct    REAL    NOT NULL DEFAULT 0,
        risk_category         TEXT    NOT NULL DEFAULT '',
        risk_exposure         REAL    NOT NULL DEFAULT 0,
        risk_prob_before      REAL    NOT NULL DEFAULT 0,
        risk_prob_after       REAL    NOT NULL DEFAULT 0,
        hidden_costs          TEXT    NOT NULL DEFAULT '{}',
        saved_at              TEXT    NOT NULL
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
       VALUES (1, ?, ?, ?, ${CURRENT_SCHEMA_VERSION}, ?)`,
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
    // Guard: reject drafts from future schema versions (written by a newer build)
    // and from version 0 / missing (pre-dating schema versioning).
    if (row.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      console.warn(`[db] Draft schema version ${row.schemaVersion} !== expected ${CURRENT_SCHEMA_VERSION}; discarding stale data`);
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
      `INSERT INTO adoption_snapshots (adoption_rate, headcount, hours_saved_per_user, blended_hourly_rate, cost_at_snapshot, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [snapshot.adoptionRate, snapshot.headcount, snapshot.hoursSavedPerUser, snapshot.blendedHourlyRate, snapshot.costAtSnapshot, new Date().toISOString()]
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
      hours_saved_per_user: number; blended_hourly_rate: number; cost_at_snapshot: number; recorded_at: string;
    }[]>('SELECT * FROM adoption_snapshots ORDER BY recorded_at ASC');
    return rows.map((r) => ({
      id: r.id,
      adoptionRate: r.adoption_rate,
      headcount: r.headcount,
      hoursSavedPerUser: r.hours_saved_per_user,
      blendedHourlyRate: r.blended_hourly_rate,
      costAtSnapshot: r.cost_at_snapshot,
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

// ─── Completed Assessments ────────────────────────────────────────────────────

export async function saveCompletedAssessment(
  snapshot: Omit<CompletedAssessmentSnapshot, 'id'>
): Promise<number> {
  if (!isTauriContext()) return -1;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO completed_assessments
        (profile, overall_score, risk_level, dimension_scores, achiever_score, blind_spots, completed_at, assessment_version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        JSON.stringify(snapshot.profile),
        snapshot.overallScore,
        snapshot.riskLevel,
        JSON.stringify(snapshot.dimensionScores),
        snapshot.achieverScore,
        JSON.stringify(snapshot.blindSpots),
        snapshot.completedAt,
        snapshot.assessmentVersion,
      ]
    );
    // Return the inserted row id for use in seeding mitigation items
    const rows = await db.select<{ id: number }[]>(
      'SELECT id FROM completed_assessments ORDER BY id DESC LIMIT 1'
    );
    return rows[0]?.id ?? -1;
  } catch (err) {
    console.error('[db] saveCompletedAssessment failed:', err);
    return -1;
  }
}

export async function getCompletedAssessments(): Promise<CompletedAssessmentSnapshot[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    const rows = await db.select<{
      id: number; profile: string; overall_score: number; risk_level: string;
      dimension_scores: string; achiever_score: number; blind_spots: string;
      completed_at: string; assessment_version: number;
    }[]>('SELECT * FROM completed_assessments ORDER BY completed_at ASC');
    return rows.map((r) => ({
      id: r.id,
      profile: JSON.parse(r.profile) as CompletedAssessmentSnapshot['profile'],
      overallScore: r.overall_score,
      riskLevel: r.risk_level as CompletedAssessmentSnapshot['riskLevel'],
      dimensionScores: JSON.parse(r.dimension_scores) as CompletedAssessmentSnapshot['dimensionScores'],
      achieverScore: r.achiever_score,
      blindSpots: JSON.parse(r.blind_spots) as BlindSpot[],
      completedAt: r.completed_at,
      assessmentVersion: r.assessment_version,
    }));
  } catch (err) {
    console.error('[db] getCompletedAssessments failed:', err);
    return [];
  }
}

export async function getLatestCompletedAssessment(): Promise<CompletedAssessmentSnapshot | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{
      id: number; profile: string; overall_score: number; risk_level: string;
      dimension_scores: string; achiever_score: number; blind_spots: string;
      completed_at: string; assessment_version: number;
    }[]>('SELECT * FROM completed_assessments ORDER BY completed_at DESC LIMIT 1');
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      profile: JSON.parse(r.profile) as CompletedAssessmentSnapshot['profile'],
      overallScore: r.overall_score,
      riskLevel: r.risk_level as CompletedAssessmentSnapshot['riskLevel'],
      dimensionScores: JSON.parse(r.dimension_scores) as CompletedAssessmentSnapshot['dimensionScores'],
      achieverScore: r.achiever_score,
      blindSpots: JSON.parse(r.blind_spots) as BlindSpot[],
      completedAt: r.completed_at,
      assessmentVersion: r.assessment_version,
    };
  } catch (err) {
    console.error('[db] getLatestCompletedAssessment failed:', err);
    return null;
  }
}

// ─── Mitigation Items ─────────────────────────────────────────────────────────

/** Seeds mitigation items from blind spots on first assessment save. Max 5 items. */
export async function seedMitigationItems(
  assessmentId: number,
  blindSpots: BlindSpot[]
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    // Only seed if no items exist for this assessment yet
    const existing = await db.select<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM mitigation_items WHERE assessment_id = ?',
      [assessmentId]
    );
    if (existing[0]?.count > 0) return;

    const now = new Date().toISOString();
    const topSpots = blindSpots.slice(0, 5);
    for (const spot of topSpots) {
      await db.execute(
        `INSERT INTO mitigation_items
          (assessment_id, source_type, source_id, dimension, title, description, status, created_at)
         VALUES (?, 'blind_spot', ?, ?, ?, ?, 'not_started', ?)`,
        [assessmentId, spot.title, spot.dimension, spot.title, spot.immediateAction, now]
      );
    }
  } catch (err) {
    console.error('[db] seedMitigationItems failed:', err);
  }
}

export async function getMitigationItems(assessmentId?: number): Promise<MitigationItem[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    const query = assessmentId !== undefined
      ? `SELECT * FROM mitigation_items WHERE assessment_id = ? ORDER BY created_at ASC`
      : `SELECT * FROM mitigation_items ORDER BY created_at ASC`;
    const params = assessmentId !== undefined ? [assessmentId] : [];
    const rows = await db.select<{
      id: number; assessment_id: number; source_type: string; source_id: string | null;
      dimension: string; title: string; description: string | null; status: string;
      notes: string | null; completed_at: string | null; created_at: string;
    }[]>(query, params);
    return rows.map((r) => ({
      id: r.id,
      assessmentId: r.assessment_id,
      sourceType: r.source_type as MitigationItem['sourceType'],
      sourceId: r.source_id ?? undefined,
      dimension: r.dimension as MitigationItem['dimension'],
      title: r.title,
      description: r.description ?? undefined,
      status: r.status as MitigationStatus,
      notes: r.notes ?? undefined,
      completedAt: r.completed_at ?? undefined,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error('[db] getMitigationItems failed:', err);
    return [];
  }
}

/** Updates status and notes. completedAt is set ONCE when status → 'complete' and never changed thereafter. */
export async function updateMitigationStatus(
  id: number,
  status: MitigationStatus,
  notes?: string
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.execute(
      `UPDATE mitigation_items
       SET status = ?,
           notes = COALESCE(?, notes),
           completed_at = CASE WHEN ? = 'complete' AND completed_at IS NULL THEN ? ELSE completed_at END
       WHERE id = ?`,
      [status, notes ?? null, status, now, id]
    );
  } catch (err) {
    console.error('[db] updateMitigationStatus failed:', err);
  }
}

export async function addCustomMitigationItem(
  item: Omit<MitigationItem, 'id' | 'createdAt' | 'sourceType' | 'completedAt'>
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO mitigation_items
        (assessment_id, source_type, source_id, dimension, title, description, status, notes, created_at)
       VALUES (?, 'custom', NULL, ?, ?, ?, 'not_started', NULL, ?)`,
      [item.assessmentId, item.dimension, item.title, item.description ?? null, new Date().toISOString()]
    );
  } catch (err) {
    console.error('[db] addCustomMitigationItem failed:', err);
  }
}

export async function deleteMitigationItem(id: number): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute('DELETE FROM mitigation_items WHERE id = ?', [id]);
  } catch (err) {
    console.error('[db] deleteMitigationItem failed:', err);
  }
}

// --- Notification Schedule ---

/** Set the reminder clock start once. Ignores call if a schedule already exists (INSERT OR IGNORE). */
export async function initNotificationSchedule(referenceAt: string): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR IGNORE INTO notification_schedule (id, reference_at) VALUES (1, $1)`,
      [referenceAt]
    );
  } catch (err) {
    console.error('[db] initNotificationSchedule failed:', err);
  }
}

export async function getNotificationSchedule(): Promise<NotificationSchedule | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<Array<{
      reference_at: string;
      fired_30: number;
      fired_60: number;
      fired_90: number;
    }>>(`SELECT reference_at, fired_30, fired_60, fired_90 FROM notification_schedule WHERE id = 1`);
    if (!rows.length) return null;
    const r = rows[0];
    return {
      referenceAt: r.reference_at,
      fired30: r.fired_30 === 1,
      fired60: r.fired_60 === 1,
      fired90: r.fired_90 === 1,
    };
  } catch (err) {
    console.error('[db] getNotificationSchedule failed:', err);
    return null;
  }
}

export async function markMilestoneFired(days: 30 | 60 | 90): Promise<void> {
  if (!isTauriContext()) return;
  const VALID_DAYS: ReadonlyArray<number> = [30, 60, 90];
  if (!VALID_DAYS.includes(days)) {
    console.error(`[db] markMilestoneFired: invalid days value "${days}"`);
    return;
  }
  try {
    const db = await getDb();
    const col = `fired_${days}`;
    await db.execute(`UPDATE notification_schedule SET ${col} = 1 WHERE id = 1`);
  } catch (err) {
    console.error('[db] markMilestoneFired failed:', err);
  }
}

// ─── Content Cache ─────────────────────────────────────────────────────────────

export async function getCachedContent(
  key: string
): Promise<{ data: string; version: string } | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{ data: string; version: string }[]>(
      'SELECT data, version FROM content_cache WHERE key = ?',
      [key]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function setCachedContent(
  key: string,
  data: string,
  version: string
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR REPLACE INTO content_cache (key, data, version, fetched_at) VALUES (?, ?, ?, ?)`,
      [key, data, version, Date.now()]
    );
  } catch (err) {
    console.error('[db] setCachedContent failed:', err);
  }
}

export async function getAllCachedByPrefix(
  prefix: string
): Promise<{ key: string; data: string; version: string }[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    return await db.select<{ key: string; data: string; version: string }[]>(
      'SELECT key, data, version FROM content_cache WHERE key LIKE ?',
      [`${prefix}%`]
    );
  } catch {
    return [];
  }
}

// ─── AI Summaries ─────────────────────────────────────────────────────────────

export interface AiSummaryRecord {
  promptText: string;
  summaryText: string;
  model: string;
  generatedAt: string;
}

export async function saveAiSummary(
  assessmentId: number,
  promptText: string,
  summaryText: string,
  model: string
): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR REPLACE INTO ai_summaries (assessment_id, prompt_text, summary_text, model, generated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [assessmentId, promptText, summaryText, model, new Date().toISOString()]
    );
  } catch (err) {
    console.error('[db] saveAiSummary failed:', err);
  }
}

export async function getAiSummary(assessmentId: number): Promise<AiSummaryRecord | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{
      prompt_text: string; summary_text: string; model: string; generated_at: string;
    }[]>(
      'SELECT prompt_text, summary_text, model, generated_at FROM ai_summaries WHERE assessment_id = ?',
      [assessmentId]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return { promptText: r.prompt_text, summaryText: r.summary_text, model: r.model, generatedAt: r.generated_at };
  } catch (err) {
    console.error('[db] getAiSummary failed:', err);
    return null;
  }
}

/**
 * Deletes all user-generated data from the local database.
 * Called by the "Reset All Data" action in Settings → My Data.
 * Does NOT clear the CDN content cache (content_cache) — that is not user data.
 */
export async function resetAllData(): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM mitigation_items');
  await db.execute('DELETE FROM ai_summaries');
  await db.execute('DELETE FROM completed_assessments');
  await db.execute('DELETE FROM adoption_snapshots');
  await db.execute('DELETE FROM spend_items');
  await db.execute('DELETE FROM email_prefs');
  await db.execute('DELETE FROM notification_schedule');
  await db.execute('DELETE FROM draft_assessment');
  await db.execute('DELETE FROM roi_tasks');
  await db.execute('DELETE FROM roi_model');
}

// ─── ROI Model Builder ────────────────────────────────────────────────────────

export async function getRoiTasks(): Promise<RoiTask[]> {
  if (!isTauriContext()) return [];
  try {
    const db = await getDb();
    const rows = await db.select<{
      id: number; name: string; hours_before: number; hours_after: number; workforce_pct: number;
    }[]>('SELECT id, name, hours_before, hours_after, workforce_pct FROM roi_tasks ORDER BY id ASC');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      hoursBefore: r.hours_before,
      hoursAfter: r.hours_after,
      workforcePct: r.workforce_pct,
    }));
  } catch (err) {
    console.error('[db] getRoiTasks failed:', err);
    return [];
  }
}

export async function saveRoiTask(task: Omit<RoiTask, 'id'>): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      'INSERT INTO roi_tasks (name, hours_before, hours_after, workforce_pct, created_at) VALUES (?, ?, ?, ?, ?)',
      [task.name, task.hoursBefore, task.hoursAfter, task.workforcePct, new Date().toISOString()]
    );
  } catch (err) {
    console.error('[db] saveRoiTask failed:', err);
  }
}

export async function deleteRoiTask(id: number): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute('DELETE FROM roi_tasks WHERE id = ?', [id]);
  } catch (err) {
    console.error('[db] deleteRoiTask failed:', err);
  }
}

export async function getRoiModel(): Promise<RoiModelData | null> {
  if (!isTauriContext()) return null;
  try {
    const db = await getDb();
    const rows = await db.select<{
      headcount: number; adoption_rate: number; blended_hourly_rate: number;
      utilization_year: number; annual_revenue: number; revenue_uplift_pct: number;
      risk_category: string; risk_exposure: number; risk_prob_before: number;
      risk_prob_after: number; hidden_costs: string;
    }[]>('SELECT * FROM roi_model WHERE id = 1');
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      headcount: r.headcount,
      adoptionRate: r.adoption_rate,
      blendedHourlyRate: r.blended_hourly_rate,
      utilizationYear: (r.utilization_year as 1 | 2 | 3) ?? 1,
      annualRevenue: r.annual_revenue,
      revenueUpliftPct: r.revenue_uplift_pct,
      riskCategories: (() => {
        try {
          const parsed = JSON.parse(r.risk_category || '[]');
          // Legacy: if stored as plain string (not array), wrap it
          return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        } catch { return r.risk_category ? [r.risk_category] : []; }
      })(),
      riskExposure: r.risk_exposure,
      riskProbBefore: r.risk_prob_before,
      riskProbAfter: r.risk_prob_after,
      hiddenCosts: JSON.parse(r.hidden_costs || '{}') as Record<string, number>,
    };
  } catch (err) {
    console.error('[db] getRoiModel failed:', err);
    return null;
  }
}

export async function saveRoiModel(data: RoiModelData): Promise<void> {
  if (!isTauriContext()) return;
  try {
    const db = await getDb();
    await db.execute(
      `INSERT OR REPLACE INTO roi_model
         (id, headcount, adoption_rate, blended_hourly_rate, utilization_year,
          annual_revenue, revenue_uplift_pct, risk_category, risk_exposure,
          risk_prob_before, risk_prob_after, hidden_costs, saved_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.headcount, data.adoptionRate, data.blendedHourlyRate, data.utilizationYear,
        data.annualRevenue, data.revenueUpliftPct, JSON.stringify(data.riskCategories), data.riskExposure,
        data.riskProbBefore, data.riskProbAfter, JSON.stringify(data.hiddenCosts),
        new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error('[db] saveRoiModel failed:', err);
  }
}
