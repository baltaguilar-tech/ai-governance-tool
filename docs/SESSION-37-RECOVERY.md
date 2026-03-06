# Session 37 Recovery File
# Created: session 36 end (2026-03-06)
# ============================================================
# HOW TO USE THIS FILE:
# Start a new Claude Code session, then say:
#   "Read docs/SESSION-37-RECOVERY.md and brief me, then we'll begin."
# ============================================================

## Project Identity
- **Product name**: AlphaPi
- **What it is**: Commercial desktop app (Tauri v2 + React + TypeScript) for AI governance assessment + ROI measurement
- **Project directory**: `~/Projects/ai-governance-tool/`
- **GitHub**: `https://github.com/baltaguilar-tech/ai-governance-tool` (user: baltaguilar-tech)
- **gh CLI location**: `~/bin/gh`

## Model Usage Rule (PERMANENT)
Use **Haiku** for: file reads, grep/glob searches, exploration, memory reads, log appends.
Use **Sonnet** only for: code generation, multi-file edits, architectural decisions.

---

## Git State (as of session 36 end)

| Location | Commit | What |
|---|---|---|
| origin/main (GitHub) | `78f0a84` | Icon fix in FirstRunGate |
| Local main | `f3f2bbf` | 2 commits ahead — README rewrite + docs |

**Local is 2 commits ahead of GitHub.** SSH key setup (Item 1 from session 36) was deferred — still needs to be done.

### Verify on session start:
```bash
cd ~/Projects/ai-governance-tool
git log --oneline -5
git status
```

---

## What Was Completed in Session 36

| Item | Status |
|---|---|
| Knowledge synthesis file created (`docs/exec-summary-knowledge-base.md`) | ✅ Done |
| Citation policy established (permanent) | ✅ Done |
| expectedAISpend → ROI Tracking feature designed | ✅ Designed, not built |
| SSH key setup | ❌ Deferred |
| Reset All Data button | ❌ Not started |
| Unsigned .app build for tester | ❌ Not started |
| Executive Summary API key settings panel | ❌ Not started |

---

## Knowledge Base (IMPORTANT — read before Executive Summary work)

**File**: `docs/exec-summary-knowledge-base.md`
**Source**: 18 LinkedIn posts + 13 infographics, synthesized 2026-03-06

**Citation policy (PERMANENT)**:
- The synthesis informs reasoning and writing — it is NOT a source to cite in output
- LinkedIn is ephemeral — URLs and posts disappear
- If citation is ever warranted, reference the synthesis date: 2026-03-06
- Never cite governing bodies unless the content comes directly from their official publications
- Stats from the synthesis may be used in Executive Summary narratives without attribution

---

## Session 37 — Priority Order

### Item 1 — SSH Key Setup (10 min) — DO THIS FIRST
Permanent fix for git push. Still pending from session 36.

```bash
ssh-keygen -t ed25519 -C "baltaguilar-tech" -f ~/.ssh/github_alphapi
cat ~/.ssh/github_alphapi.pub   # copy output
```
Then: GitHub → Settings → SSH keys → New SSH key → paste → Add
Then:
```bash
cd ~/Projects/ai-governance-tool
git remote set-url origin git@github.com:baltaguilar-tech/ai-governance-tool.git
git push
```

---

### Item 2 — expectedAISpend → ROI Tracking Feature

**What it is**: The `expectedAISpend` field (free-text string, entered in org profile) needs to flow into:
1. ROI Tracking DimensionStep — context banner showing declared spend
2. SpendTracker (TrackProgress.tsx) — pre-populated as an editable line item + comparison callout

**Full design spec:**

#### Part A — Parse expectedAISpend to a number

`expectedAISpend` is stored as a free-text string in `OrganizationProfile`. Examples: "$50,000", "50K", "$1.2M/year", "100000", "~$75k".

Write a parser utility (in a new file or inline in relevant component):
```ts
function parseSpendAmount(raw: string): number | null {
  // strip $, commas, spaces
  // handle K = *1000, M = *1000000
  // strip /year, /mo, /month, per year, etc.
  // return null if unparseable
}
```
Return `null` if unparseable — don't crash, just silently skip pre-population.

#### Part B — ROI Tracking DimensionStep context banner

In `DimensionStep.tsx`, when `dimensionKey === 'roiTracking'` AND `profile.expectedAISpend` is truthy:
- Show a small info banner below the dimension description, above the progress dots
- Content: "Your declared AI spend: **[raw value]**" (display raw string, not parsed — user entered it, they know what it means)
- Style: ice-blue background (`bg-accent-blue/10`), left border accent, small text
- No banner if `expectedAISpend` is empty/null

#### Part C — SpendTracker pre-population

In `TrackProgress.tsx` → `SpendTracker` component:

**Pre-population logic:**
- On mount, check if there are zero spend items AND `profile.expectedAISpend` is truthy AND it parses to a valid number
- If all three true: call `addSpendItem()` automatically with:
  - `name`: "Declared AI Budget (from profile)"
  - `costType`: `'annual_license'` (annual fits most "expected spend" declarations)
  - `amount`: parsed number
  - `prorateMonths`: 12
  - `monthlyEquivalent`: parsed / 12
- The pre-populated item is a normal SpendItem — fully editable and deletable by the user
- Only pre-populate ONCE (only if spendItems.length === 0) — never overwrite existing items

**Where to get `profile`:**
`TrackProgress` is called from `ResultsDashboard.tsx`. Check how profile is passed — may need to pull from `useAssessmentStore()` inside the component.

#### Part D — Comparison callout in SpendTracker

In the SpendTracker summary area (where `totalMonthly` is shown), add a comparison row:
- "Declared annual budget: **$X**" (from parsed `expectedAISpend`)
- "Currently tracking: **$Y/mo** ($Z/yr)" (from `totalMonthly`)
- Visual: simple two-row info block, not a chart
- Only show if `expectedAISpend` parses successfully to a number

**Key files to read before building:**
- `src/components/wizard/DimensionStep.tsx` (already read — 175 lines)
- `src/components/dashboard/TrackProgress.tsx` (large — 54KB, read only SpendTracker section ~lines 521-700)
- `src/store/assessmentStore.ts` (already read — profile shape confirmed)
- `src/types/assessment.ts` (already read — OrganizationProfile, SpendItem types confirmed)

**TypeScript check command:**
```
/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit
```

---

### Item 3 — Reset All Data Button (30 min)
Add to Settings → My Data panel.
- Confirmation dialog required
- Deletes all SQLite assessment data + clears `legalAccepted` flag
- After reset: redirect to Welcome step
- Key files: `src/components/settings/panels/DataPanel.tsx`, `src/services/db.ts`, `src/App.tsx`

---

### Item 4 — Unsigned .app Build for Tester
```bash
PATH="/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH" npm run tauri build
```
Output: `src-tauri/target/release/bundle/macos/AlphaPi_*.dmg`

---

### Item 5 — Executive Summary Feature Design
Settings panel: API Key input (masked), test connection button, clear button.
Consent flow: dialog on first use explaining internet requirement.
Do NOT build the Claude API call or generation logic yet.
**Knowledge base**: `docs/exec-summary-knowledge-base.md` — read before designing prompt.

---

## Remaining Go-Live Gates

| Gate | Status | Blocked on |
|---|---|---|
| GL-2: Keygen license validation | ⏳ Pending | Keygen.sh account setup |
| GL-3: macOS code signing | ⏳ Pending | Apple Developer account |
| GL-4: macOS notarization | ⏳ Pending | Apple Dev + D-U-N-S number |
| GL-5: Payment processor | ⏳ Pending | Company registration |
| GL-6: Auto-updater | ✅ Done | — |
| GL-7: Privacy Policy + ToS | ✅ Done | — |

---

## Key Technical Facts

- **Tailwind v4** — no tailwind.config.js; theme defined in `src/index.css`
- **TypeScript check**: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit`
- **Build command**: `PATH="/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH" npm run tauri build`
- **lucide-react** installed (v0.564.0)
- **Anthropic SDK**: NOT yet installed — add when building Exec Summary generation (`npm install @anthropic-ai/sdk`)
- **SQLite stale lock recovery**: kill all + delete `.db` + `.db-shm` + `.db-wal` from `~/Library/Application Support/com.baltaguilar-tech.ai-governance-tool/`

## Key File Locations
- Design system / colors: `src/index.css`
- Assessment store: `src/store/assessmentStore.ts`
- Scoring engine: `src/services/scoring.ts`
- PDF export: `src/services/pdfExport.ts`
- License service: `src/services/license.ts`
- Settings page: `src/components/settings/Settings.tsx`
- Data panel: `src/components/settings/panels/DataPanel.tsx`
- Database service: `src/services/db.ts`
- Legal modal: `src/components/legal/LegalModal.tsx`
- First-run gate: `src/components/legal/FirstRunGate.tsx`
- Auto-updater service: `src/services/updater.ts`
- Updates panel: `src/components/settings/panels/UpdatesPanel.tsx`
- Track Progress: `src/components/dashboard/TrackProgress.tsx`
- Results Dashboard: `src/components/dashboard/ResultsDashboard.tsx`
- Dimension step: `src/components/wizard/DimensionStep.tsx`
- **Exec summary knowledge base**: `docs/exec-summary-knowledge-base.md`
- Session log: `docs/session-log.md`
- Decisions log: `docs/decisions.md`

---

## After Each Item
1. Run TypeScript check — fix any errors before continuing
2. Commit with a clear message
3. Ask user before pushing
4. Append one line to `docs/session-log.md` (use Bash echo, not Edit/Read)

---

## Resume Phrase for Session 37

Paste this exactly to start the session:

> "Session 37 — AlphaPi. Read docs/SESSION-37-RECOVERY.md and brief me on current state before we do anything.
>
> Context for this session: In session 36 we did no code work. Instead we built the knowledge foundation for the Executive Summary feature. We synthesized 18 LinkedIn articles + 13 infographics on AI Governance and ROI into a structured knowledge base now saved at docs/exec-summary-knowledge-base.md. That file is the domain knowledge that will inform the Executive Summary prompt — it is NOT a citation source. LinkedIn is ephemeral; if a date reference is ever needed, use 2026-03-06 (synthesis date). Never cite LinkedIn sources in any output.
>
> We also designed the expectedAISpend → ROI Tracking feature (not yet built). Full spec is in SESSION-37-RECOVERY.md. Decisions made: (1) parse the free-text expectedAISpend string to a number using best-effort parsing; (2) pre-populate SpendTracker in TrackProgress as an editable/deletable line item on first load when no spend items exist; (3) show a context banner at the top of the ROI Tracking dimension step displaying the declared spend; (4) show a declared vs. tracked monthly comparison callout in the SpendTracker summary area.
>
> Session 37 goals: (1) SSH key setup to unblock git push permanently, (2) build the expectedAISpend feature per the spec above, (3) Reset All Data button in Settings, (4) unsigned .app build for developer tester, (5) Executive Summary API key settings panel + consent flow design (no generation logic yet).
>
> Model rule: Haiku for research/reads/exploration. Sonnet for code generation and multi-file edits."
