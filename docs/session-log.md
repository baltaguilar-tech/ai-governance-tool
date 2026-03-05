# Session Log

Claude appends here after every 3–5 meaningful changes. Format: date, summary of changes, open questions raised.

---

## 2026-02-19 (session 4) — Split questionBanks.ts into per-profile files — COMPLETE

**What changed:**
- `src/data/questionBanks.ts` (1,689 lines) — DELETED
- `src/data/questions/` directory created with 5 files:
  - `experimenter-questions.ts` (801 lines) — extracted verbatim from old questionBanks.ts
  - `builder-questions.ts` (805 lines) — extracted verbatim from old questionBanks.ts
  - `innovator-questions.ts` (950 lines) — generated fresh via foreground subagent (full riskLevel fields)
  - `achiever-questions.ts` (957 lines) — generated fresh via foreground subagent
  - `index.ts` (68 lines) — re-exports all 4 banks + `getQuestionsForProfile()` selector + `REGION_TO_JURISDICTION` map

**Why this approach:** Two consecutive "Prompt is too long" crashes when writing Innovator bank inline. Splitting into separate files keeps each file ≤1000 lines. Foreground subagents handle generation; `sed` extraction handles copying from source.

**Process rule (now in MEMORY.md):** Always use foreground Task subagents (no `run_in_background`) for large file writes. Background agents cannot prompt user for write approval and will fail silently.

**Current state of question banks:**
- All 4 profile banks: COMPLETE (240 questions total)
- `src/data/questions.ts` (original 60-question bank): still exists, still used by the current UI
- The new 240-question multi-bank system is NOT yet wired into the UI (separate task)

**Next: Wire multi-bank system to UI**
The app currently uses the old `src/data/questions.ts` (ASSESSMENT_QUESTIONS, 60 questions). To switch to the new system:
1. Update `src/store/assessmentStore.ts` — call `getQuestionsForProfile(maturityLevel, regions)` instead of static import
2. Update `src/components/wizard/DimensionStep.tsx` — no changes needed if store provides questions
3. Update `src/utils/scoring.ts` — verify it works with dynamic question list
4. Update `src/utils/recommendations.ts` — same
5. Decide what to do with `src/data/questions.ts` — keep as fallback or delete

**Start a fresh session to wire the UI.** This session is complete and context is full.

---

## 2026-02-18 (session 3) — Builder bank written; context crash; checkpoint saved

**What changed:**
- EXPERIMENTER_QUESTIONS: fully written (lines 41–835, 60 questions across 6 dimensions)
- BUILDER_QUESTIONS: fully written (lines 840–1638, 60 questions across 6 dimensions) — edit succeeded but session hit "Prompt is too long" immediately after
- session-log.md was NOT updated before crash — fixed now in this session

**Current status of `questionBanks.ts` (1,689 lines):**
- Experimenter: DONE
- Builder: DONE
- Innovator: PLACEHOLDER at line 1643
- Achiever: PLACEHOLDER at line 1653

**Failure mode:** Claude violated context safety protocol — started a high-risk large generation task without warning user first. Acknowledged and noted.

**Next action (Innovator bank):**
Start a fresh Claude Code session and say:
> "Resume question bank rewrite. Read only the first 40 lines of questionBanks.ts for the schema. Then write the Innovator bank — 60 questions (10 per dimension × 6 dimensions). Innovator profile = organizations with formal AI governance programs, dedicated teams, active compliance tracking. Advanced questions only. Replace the INNOVATOR_SHADOW_PLACEHOLDER comment."

**After Innovator is done, start another fresh session for Achiever:**
> "Resume question bank rewrite. Read only the first 40 lines of questionBanks.ts for the schema. Then write the Achiever bank — 60 questions (10 per dimension × 6 dimensions). Achiever = organizations with mature, board-level AI governance, full regulatory compliance programs, external audit-ready posture. Expert-level questions only. Replace the ACHIEVER_SHADOW_PLACEHOLDER comment."

---

## 2026-02-18 — Knowledge base expansion + Option B question system

**What changed:**
- Expanded `docs/ai-governance-knowledge-base.md` from 188 to 1,551 lines (Parts 1–38) by reading all images from `~/Desktop/AI Images/` (JPEGs directly, PNGs resized via `sips -Z 1500`) and a LinkedIn synthesis document pasted directly into chat
- Decided on Option B: 4 separate question banks (Experimenter/Builder/Innovator/Achiever), 60 questions per bank (240 total), jurisdiction-aware
- Confirmed 5 key design decisions with user (maturity-relative scores, progress dashboard, dynamic scoring, union of jurisdictions, Achiever Pro tier)
- Logged Option B decision to `docs/decisions.md`
- Added new open questions to `docs/open-questions.md` (Achiever Pro scope, dashboard mechanics, score disclaimer wording)
- Implementing: `src/data/questionBanks.ts` (240 questions), type update, `getQuestionsForProfile()` selector

**Open questions at session end:**
- Dashboard progress tracking: where does it live in the UI?
- Achiever Pro tier: what exactly is included?
- Score disclaimer: exact copy/placement TBD

---

## 2026-02-17 — Project scaffolding + session continuity setup

**What changed:**
- Created `CLAUDE.md` at project root with full persistent context (architecture, build status, instructions for Claude)
- Created `docs/decisions.md` with all major architectural decisions made to date
- Created `docs/session-log.md` (this file)
- Created `docs/open-questions.md` with known unresolved items
- Updated global `MEMORY.md` to remove Job Matcher context (no longer active project) and point to these files
- User confirmed: Job Matcher project is complete/paused; AI Governance tool is the active focus

**Current build status:**
- UI complete: 9-step wizard, all 60 questions, results dashboard, scoring engine, recommendations engine
- Tauri backend: plugins initialized, no custom Rust commands yet
- NOT built: SQLite persistence, licensing (Keygen.sh), PDF/DOCX export, settings page, updater

**Open questions at session end:**
- See `docs/open-questions.md` for full list
- Priority not yet confirmed: SQLite persistence vs. PDF export vs. licensing — ask user next session

---

## 2026-03-04 — Tooling discussion + adversarial review queued

**What changed:**
- No code changes this session
- Discussed Claude Code vs. VS Code Claude extension: same model, different context scope. VS Code = inline/local; Claude Code = agentic/whole-codebase.
- Discussed review bias: Claude Code cannot give a truly independent review of work it helped build. Agreed that a genuinely independent review is needed before any paid/public release.
- Added new open question to `docs/open-questions.md`: **Adversarial code review** — scoped, triggered before Phase 3 or public release, using GitHub PR (human or Copilot) and/or a fresh Claude Code session with no prior context.

**Decision:** This is a long-term project and code quality standards should be enforced from the start, not retrofitted later.

---

## Session 26 — 2026-03-04

**Focus**: Industry regulatory content — Retail & E-Commerce + Telecommunications (Phase D complete)

**Work done**:
- Generated `retail-ecommerce.json` — 40 entries (FTC §5, CCPA/CPRA, PCI DSS v4.0, COPPA, NIST CSF 2.0, BIPA/CUBI, SEC MD&A)
- Generated `telecommunications.json` — 40 entries (FCC Comms Act, CPNI Rules, FCC Supply Chain Order, ECPA, NORS, CISA, TCPA/FCC AI-voice ruling Feb 2024, BEAD/USF)
- Uploaded both to R2 (ai-governance-content bucket)
- Manifest bumped: v1.4.0 → v1.5.0 (retail) → v1.6.0 (telecom)
- contentService.ts: both entries activated in INDUSTRY_CDN_KEYS

**Commits pushed** (4 together): 0eb80f8 (manufacturing), 4f68efe (government), c34794b (retail), f9bdd86 (telecom) → origin/main @ f9bdd86

**Phase D status**: COMPLETE — all 8 industries live on R2:
energy-utilities, healthcare, financial-services, technology, manufacturing, government, retail-ecommerce, telecommunications

**Next**: Phase 5 wizard screens (ProfileStep.tsx + DimensionStep.tsx) — Phase 5 UI work pending

---

## Session 16 — 2026-02-25

**Focus**: PDF output audit and overhaul

**Work done**:
- Full audit of PDF export across Free and Pro tiers — identified 14 issues
- Fixed 2 critical bugs: wrong sort direction in executive summary dimensions + Free PDF layout overwrite
- Created 240 per-question immediate actions (4 maturity-calibrated action files, ~120 lines each)
- Structural PDF fixes: blind spots table, Start Here box, financial risk context, PRO column removal
- Content upgrades: Para 1 grammar fix, Para 3 specific closing, formatGapTitle() helper

**Commits**: fab4ee4

**State at end**: local only, not pushed — push first thing next session

**Next**: Push to GitHub, then Phase 3 (CI/CD, code signing, auto-updater)

---

## Session 27 — 2026-03-04

**Focus**: Tier 1 — Security & Data Integrity fixes (all 5 items complete)

**Work done**:
- P1-1 · default.json — Removed `$HOME/**` from `fs:allow-write` + `fs:allow-write-file`. Tightened all `$APPDATA/**` to `$APPDATA/ai-governance-tool/**` across read + write + write-file blocks.
- P1-3 · assessmentStore.ts — Fixed `operatingRegions` reference equality bug in `updateProfile()`. Now uses `JSON.stringify()` comparison; profile updates no longer silently wipe dimension responses.
- P1-5 · contentService.ts — Added 3-layer CDN content validation: (1) final URL must start with CDN_BASE, (2) response rejected if >500KB, (3) JSON validated for required fields (version, industry, regulations) before SQLite write. Added `isValidIndustryContent()` type guard.
- P1-2 · db.ts — Added runtime whitelist `[30, 60, 90]` guard in `markMilestoneFired()` before dynamic column name interpolation. (Note: project plan had wrong whitelist `[1, 3, 7, 30]` — corrected to match actual schema columns.)
- P1-4 · types/assessment.ts + db.ts + TrackProgress.tsx — Added `costAtSnapshot` field to `AdoptionSnapshot`. Schema migration in `initDatabase()`. `saveAdoptionSnapshot()` now stores `annualCost` at save time. `getAdoptionSnapshots()` returns the field. Historical snapshot display uses `snap.costAtSnapshot` (falls back to live `annualCost` for pre-migration rows where DEFAULT=0).

**TypeScript**: `tsc -b tsconfig.app.json --noEmit` — clean, no errors.

**Commits**: not yet pushed — awaiting user go-ahead.

**Next**: Tier 2 (P2-1 through P2-5) — Scoring & Assessment Accuracy fixes.

## Session 28 — 2026-03-04

**Focus**: Tier 2 — Scoring & Assessment Accuracy (all 5 items complete)

**Work done**:
- P2-5 · experimenter-questions.ts — Fixed airisks-e-3 option values from 100,35,65,0 → 100,65,35,0. Used Python byte-level surgery (Edit tool introduced curly quotes; git revert + Python value-only swap was the fix). Audited all 4 banks: builder ✓ clean, innovator ✓ values correct (ascending display order is UX inconsistency, not scoring bug), achiever ✓ clean.
- P2-3 · recommendations.ts — Renamed _licenseTier → licenseTier. Wrapped all 9 paid recommendations in if (licenseTier === 'professional'). Added answered !== false guard to all 11 score-conditional checks (free + paid) so unanswered dimensions (score=0) don't fire spurious recommendations.
- P2-4 · assessmentStore.ts — Replaced hardcoded prefix map + magic number 10 in canProceed() with getQuestionsForProfile() actual question count. Added DimensionKey to imports.
- P2-2 · dimensions.ts + pdfExport.ts — Added 46-line weight rationale comment block above DIMENSIONS array. Added methodology disclaimer line to Free PDF footer and multi-line disclaimer to Pro PDF recommendations page.
- P2-1 · types/assessment.ts + scoring.ts + ResultsDashboard.tsx + DimensionRadar.tsx + pdfExport.ts + recommendations.ts — Added answered:boolean to DimensionScore. calculateDimensionScore returns answered:false,score:0 for zero-answer dims. calculateOverallRisk re-normalizes weights across answered dims. identifyMaturityGaps skips unanswered. ResultsDashboard: gray bar + "Not assessed" badge + "Based on X of 6 dimensions" footnote. DimensionRadar: filter to answered only, subtitle updates. pdfExport: drawRiskBars shows gray N/A bar, both dim tables show "Not assessed"/—, Pro PDF per-dim pages render placeholder with skipped question list.

**TypeScript**: tsc -b tsconfig.app.json --noEmit — clean, no errors.

**Commits**: 9bf97ac pushed to origin/main. All clean.

**Next**: Tier 3 — from docs/project-plan.md

## Session 29 — 2026-03-05

**Focus**: Tier 3 — P3-1, P3-2, P3-3 (all 3 items complete)

**Work done**:
- P3-3 · ResultsDashboard.tsx — Export button loading state (was already in local diff from prior session). isExportingFree + isExportingPro state; buttons show "Generating..." and disable during PDF creation.
- P3-2 · assessmentStore.ts + ResultsDashboard.tsx + pdfExport.ts — Added completedAt:string|null to store; set to ISO timestamp in calculateResults(), cleared in resetAssessment(). Dashboard header uses stored timestamp. Both PDF cover pages now say "Assessment completed [date]" using stored timestamp (not new Date()).
- P3-1 · types/assessment.ts — Added unansweredQuestions:{id,text}[] to DimensionScore interface.
- P3-1 · scoring.ts — calculateDimensionScore() now tracks all questions with no response into unansweredQuestions (in both answered and unanswered dimension cases).
- P3-1 · pdfExport.ts Free PDF — Added Page 4 "Open Assessment Items" (Option C copy). Groups unanswered questions by dimension; each question gets a bordered box with "Mitigation Notes:" dotted line. Page only renders if at least one gap exists.
- P3-1 · pdfExport.ts Pro PDF — "Not assessed" dimension placeholder replaced with per-question bordered Mitigation Notes boxes (with page-break handling). Partially-answered dimensions now get an appended "Open Assessment Items" mini-section after their Q&A content.

**TypeScript**: tsc -b tsconfig.app.json --noEmit — clean, no errors.

**Commits**: d1fb45b pushed to origin/main. All clean.

**Next**: Tier 4 — P4-1 (EU AI Act questions), P4-2 ($67.4B stat fix), P4-3 (deep link crash). Then Pre-Go-Live gate items.

## Session 30 — P4-1 (EU AI Act questions) — 2026-03-05

**Goal**: Add 3 EU-jurisdiction-gated questions to aiSpecificRisks dimension across all 4 profile banks.

**Changes (commit 411f466)**:
- experimenter-questions.ts: airisks-e-11/12/13 (EU AI Act awareness, Annex III recognition, human override)
- builder-questions.ts: risk-b-11/12/13 (Annex III mapping, vendor conformity docs, written oversight procedures)
- innovator-questions.ts: airisk-i-11/12/13 (classification review, conformity assessment, enforced human oversight)
- achiever-questions.ts: airisk-a-11/12/13 (classification in governance gates, audit-ready conformity, tested/logged oversight)

**TypeScript**: tsc -b tsconfig.app.json --noEmit — clean, no errors.

**Note**: jurisdictions: ['eu'] field already wired in Question type + index.ts filtering.

**Next**: P4-2 already done (2d7b6a4). P4-3 (deep link crash). Then Pre-Go-Live gate items.

## Session 32 — Phase 5 Wizard UI (ProfileStep + DimensionStep) — 2026-03-05

**Goal**: Visual/UX redesign of ProfileStep.tsx and DimensionStep.tsx — zero logic/store changes.

**ProfileStep changes**:
- Two section headers: "About Your Organization" (fields 1–5) + "Your AI Program" (fields 6–10)
- Required badge chips on Org Name, Industry, Organization Size (replaced red asterisks)
- Optional note under Section 2 header

**DimensionStep changes**:
- Lucide icon (w-7 h-7 text-accent-blue) left of dimension h2 via DIMENSION_ICONS map
- 10 numbered dot progress track (green=answered, blue=first unanswered, white=unanswered); clicking scrolls to question-{i}
- Full pill button answer options with indicator dot inside (filled/bordered)
- Secondary progress text preserved below dots

**TypeScript**: tsc -b tsconfig.app.json --noEmit — clean, no errors.

**Decisions logged**: decisions.md updated with Phase 5 UI design decisions.

**Status**: Code complete, not yet committed. Awaiting user approval.
