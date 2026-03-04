# Remote Content Architecture — Implementation Plan

**Decision date**: 2026-02-27 (Session 20)
**Rationale**: All industry sectors planned (10–15). Regulatory content changes. Internet access acceptable. Avoid binary releases for content-only updates.

---

## What This Does

Industry-specific regulatory action items (and future content expansions) live as JSON files on Cloudflare R2. The app fetches them on launch, caches them in SQLite, and falls back to the cache when offline. Question banks stay baked into the bundle for now.

---

## Phase A — Infrastructure Setup

**Steps:**

1. **Create Cloudflare R2 bucket** (`ai-governance-content`)
   - Public read access for content files
   - Set CORS to allow fetch from Tauri app origin

2. **Define manifest file** (`industry-regulations/manifest.json`)
   ```json
   {
     "version": "1.0.0",
     "industries": {
       "energy-utilities": { "version": "1.0.0", "url": "/industry-regulations/energy-utilities.json" }
     }
   }
   ```

3. **Define per-industry JSON schema** (`industry-regulations/energy-utilities.json`)
   ```json
   {
     "version": "1.0.0",
     "industry": "energy-utilities",
     "regulations": {
       "shadow-e-1": {
         "citation": "NERC CIP-013-2, Section 4.2",
         "action": "Establish a vendor risk tier for AI tools procured without IT approval..."
       }
     }
   }
   ```

**Owner**: Manual setup (no code required in this phase).
**Blocker**: Cloudflare account needed (same account as Worker).

---

## Phase B — SQLite Schema Update

**New table** in `src/services/database.ts`:

```sql
CREATE TABLE IF NOT EXISTS content_cache (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  version TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
```

**Column addition** to `assessments` table (schema migration):

```sql
ALTER TABLE assessments ADD COLUMN content_version TEXT DEFAULT NULL;
```

**Steps:**
1. Add `content_cache` table creation to database init
2. Add `content_version` column to assessments schema
3. Bump schema version in `database.ts`

---

## Phase C — contentService.ts

**New file**: `src/services/contentService.ts`

**Responsibilities:**
1. `initContentService()` — called once at app launch (after DB init)
   - Fetch manifest from CDN
   - For each industry in manifest: compare remote version vs cached version
   - If remote is newer (or no cache): fetch industry JSON, store in `content_cache`
   - If fetch fails: log warning, continue (offline — use cache)

2. `getIndustryContext(industry: string, questionId: string): { citation: string; action: string } | null`
   - Read from `content_cache` SQLite row for the industry
   - Parse JSON, look up questionId in `regulations`
   - Return null if industry not cached or questionId not found

3. `getCurrentContentVersion(): string | null`
   - Return manifest version from cache (used when saving an assessment)

**Error handling philosophy**: Silent degradation. Content is enhancement, not core. If fetch fails or industry not found, generic action text is shown. No error UI.

---

## Phase D — First Content File (Energy & Utilities)

**Steps:**
1. Research regulatory action items for each question (user researches via Gamma, provides content)
2. Claude generates `energy-utilities.json` from user-provided regulatory content
3. Upload to R2 bucket
4. Update manifest with energy-utilities entry
5. Test fetch → cache → render cycle in dev

**Content structure by dimension:**
- Shadow AI: AI tool procurement controls (NERC CIP-013)
- Vendor Risk: Third-party vendor management (NERC CIP-013)
- Data Governance: Operational data handling
- Security/Compliance: Critical infrastructure cybersecurity (NERC CIP suite)
- AI-Specific Risks: AI model risk in grid operations
- ROI Tracking: Cost attribution for AI investments

---

## Phase E — Render Integration

**Resolve first**: Show industry content on ALL questions, or only on GAP questions (value !== 0)?

**Update locations (in priority order):**

1. **`src/utils/pdfExport.ts`** — per-question Action block
   - After rendering generic `getImmediateAction()` text
   - Call `getIndustryContext(industry, question.id)`
   - If result: append `\n[Industry: ${result.citation}]\n${result.action}`

2. **`src/utils/pdfExport.ts`** — Recommendations descriptions
   - Add industry citation to recommendation description text

3. **`src/components/ResultsDashboard.tsx`** — Blind Spots list
   - Below each blind spot's generic action text, append industry context if available

**Gating logic**: Only call `getIndustryContext()` when `profile.primaryLocation === 'United States'`. If non-US, skip entirely.

---

## Phase F — Assessment Version Locking

When saving an assessment:
- Call `getCurrentContentVersion()`
- Store result in `assessments.content_version`

When generating PDF from a saved assessment:
- Load the assessment's `content_version`
- Use that version's cached content (not the latest)
- Implementation: `getIndustryContext()` accepts optional `version` param

---

## Future Phases (No Work Required Now)

- **Add Healthcare sector**: Write `healthcare.json`, upload to R2, update manifest. No app update.
- **Add Finance, Legal, Manufacturing, etc.**: Same pattern.
- **Migrate question banks to remote JSON**: Phase 4/5. Use same `content_cache` pattern. Ship seed JSON as static asset for offline-first first launch.

---

## Open Questions Before Starting

1. **Cloudflare account access** — does user have R2 set up, or does this need to be created first?
2. **Gap-only vs all-questions display** — user decides before Phase E.
3. **CDN URL** — what is the base URL for the R2 bucket? (needed in `contentService.ts`)

---

## Files Modified / Created

| File | Change |
|------|--------|
| `src/services/contentService.ts` | New — CDN fetch, cache, lookup |
| `src/services/database.ts` | Add `content_cache` table + `content_version` column |
| `src/utils/pdfExport.ts` | Call `getIndustryContext()` in action + recs blocks |
| `src/components/ResultsDashboard.tsx` | Call `getIndustryContext()` in blind spots |
| `src/main.tsx` or `App.tsx` | Call `initContentService()` on launch |
| `content/industry-regulations/` | CDN-side JSON files (not in repo) |
