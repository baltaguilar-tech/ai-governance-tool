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
