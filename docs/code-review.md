# AI Governance Tool — Adversarial Code Review

**Date**: 2026-03-04
**Reviewed by**: 4 specialized AI review agents — React/Components, State/Data/Scoring, Services/Security/Infrastructure, Domain/PM/Product
**Scope**: Full codebase, pre-commercial launch
**Status**: Private — internal use only

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 11 |
| HIGH | 42 |
| MEDIUM | 37 |
| LOW | 23 |
| **TOTAL** | **113** |

**Context**: Many of these findings are already known internally (e.g., license stubbing, CLAUDE.md open questions). Those are noted. The goal of this document is a complete, unfiltered view for project planning.

---

## Section 1 — LAUNCH BLOCKERS

These must be resolved before any commercial transaction can occur.

---

### LB-1 [CRITICAL] — Testing Mode tier toggle exposed to all users
**File**: `src/components/settings/panels/LicensePanel.tsx:128-158`

The "Testing Mode" Free/Professional toggle in Settings → License Key is visible to every user with no `import.meta.env.DEV` guard. Any user can click "Professional" and unlock all paid features for free. This single click bypasses the entire freemium model. Compare to `ResultsDashboard.tsx` which correctly gates its dev toggle behind `import.meta.env.DEV`.

**Fix required before any user touches the app.**

---

### LB-2 [CRITICAL] — License service is 100% stub — no real enforcement in production
**Files**: `src/services/license.ts`, `src/store/assessmentStore.ts:69`

`getLicenseState()` returns `UNCONFIGURED_STATE` unconditionally. `activateLicense()` does nothing. The store initializes `licenseTier` to `'professional'` in DEV and `'free'` in production — but `setLicenseTier` is a public, unguarded Zustand action. Any user who opens DevTools (accessible in debug Tauri builds via auto-opened devtools) can call `useAssessmentStore.getState().setLicenseTier('professional')` to unlock Pro instantly. No Keygen.sh integration exists. No payment processor is wired. The entire licensing stack is aspirational.

**Cannot take payment or enforce access control in current state.**

---

### LB-3 [CRITICAL] — Code signing not set up — Gatekeeper/SmartScreen will block installation
**Source**: `docs/open-questions.md`, project documentation

No Apple Developer account, no macOS code signing, no Windows EV certificate. Mid-market organizations — the target buyer — almost universally have IT security policies preventing installation of unsigned binaries. A $3,000 governance tool that triggers "Apple cannot verify this app" on installation will not be purchased.

**Prerequisite for any paid distribution.**

---

### LB-4 [CRITICAL] — No payment processor selected or integrated
**Source**: `docs/open-questions.md`

Stripe, LemonSqueezy, and Paddle are listed as candidates with no decision. Keygen.sh cannot issue license keys without a purchase trigger. The chain — payment → license key → Keygen activation → Pro tier — has no implemented links. Pricing structure (one-time vs. annual, tiers) also remains undefined.

---

## Section 2 — CRITICAL FINDINGS

Security, data integrity, and product correctness issues that produce wrong or dangerous outcomes.

---

### CR-1 [CRITICAL] — `$HOME/**` write permission grants app write access to entire user home directory
**File**: `src-tauri/capabilities/default.json:36-53`

```json
{ "path": "$HOME/**" }
```

This single permission allows the app — and any content injected through the CDN pipeline (see CR-2) — to write to `~/.zshrc`, `~/.ssh/authorized_keys`, `~/.gitconfig`, and every file on the system. Tauri's deny-by-default model exists precisely to prevent this. The app only needs write access to `$APPDATA`, `$DOWNLOAD`, `$DESKTOP`, and `$DOCUMENT`. Remove `$HOME/**` immediately. PDF saves to arbitrary locations are already handled by `dialog:allow-save` through the native file picker — no pre-grant needed.

---

### CR-2 [CRITICAL] — CDN content pipeline has no integrity protection
**File**: `src/services/contentService.ts:82-103`

Industry regulatory JSON is fetched from Cloudflare R2, cast to `IndustryContent` with `as` (no validation), stored in SQLite, loaded into memory on every launch, and rendered into compliance PDFs. There is no:
- Cryptographic signature verification
- Schema/structure validation
- Response body size limit (1GB response would be accepted)
- Domain pinning (manifest's `entry.url` is not sanitized against absolute URL override)

A compromised R2 bucket, DNS hijack, or BGP hijack allows an attacker to inject arbitrary text into regulatory compliance reports distributed to organizations making governance decisions. This also poisons the SQLite cache for offline sessions.

Additionally, `$HOME/**` write permission (CR-1) combined with this pipeline creates a theoretical two-step arbitrary file write path.

---

### CR-3 [CRITICAL] — Fabricated dimension scores presented as real assessment data
**File**: `src/utils/scoring.ts:80-87`

```typescript
if (answeredCount === 0) {
  return { key: dimension, score: 50, riskLevel: getRiskLevel(50), questionScores: [] };
}
```

If any dimension has zero responses, the engine fabricates a score of 50 (Medium Risk) with no evidence. This phantom score flows into the weighted overall score, the PDF export, the gauge, and the radar chart — with no indicator that it is synthetic. For a commercial product producing governance risk assessments that customers may present to boards or regulators, presenting fabricated scores as assessed results is a material accuracy failure.

---

### CR-4 [CRITICAL] — Historical ROI snapshots recalculated against live spend data
**File**: `src/components/dashboard/TrackProgress.tsx:1018`

`snapNetROI = snapAnnualValue - annualCost` where `annualCost` is computed from the current live spend tracker state, not the state at snapshot time. Every historical snapshot's Net ROI changes retroactively whenever a spend item is added or removed. A snapshot showing $500K ROI in January will show a different figure in March. The Track Progress feature — a key Pro tier differentiator — displays corrupted historical data. There is no stable ROI trend.

---

### CR-5 [CRITICAL] — Assessment accepts 50% answer rate and presents results as authoritative
**File**: `src/components/wizard/DimensionStep.tsx:23`

```typescript
const canContinue = answeredCount >= Math.ceil(questions.length / 2); // = 5 of 10
```

A user answering 5 questions per dimension (30 of 60 total) reaches the Results Dashboard showing a governance score, risk gauge, radar chart, dimension breakdown, blind spots, and a regulatory exposure estimate — all calculated from half the data, with no disclosure of the answer rate. The score disclaimer says results reflect "your organization's current AI governance maturity." This is false for a half-completed assessment. Minimum threshold should be 80% (8 of 10) for credible results.

---

### CR-6 [CRITICAL] — Scoring methodology indefensible against governance framework scrutiny
**Source**: `src/data/dimensions.ts`, `src/utils/scoring.ts`

Three compounding methodology flaws:

1. **Dimension weights**: Shadow AI (25%) + Vendor Risk (25%) = 50% of total score. AI-Specific Risks is only 10%. ISO 42001 Clause 6, EU AI Act, and NIST AI RMF all center *inherent AI system risk* as the primary concern — not tool sprawl. A company shipping a biased hiring algorithm with no oversight but excellent Shadow AI visibility scores well under this weighting. Regulators and compliance consultants will spot this immediately.

2. **ROI Tracking as a governance dimension**: No established framework (EU AI Act, ISO 42001, NIST AI RMF, GDPR) treats ROI measurement as a governance obligation. Including it alongside Security and Data Governance as a co-equal dimension is a category error that undermines the credibility of the entire score.

3. **Maturity self-selection bonus**: `getMaturityBonus()` adds 15 points for self-reported Achievers, 10 for Innovators, 5 for Builders. An org that lies about maturity gets free points. The target maturity recommendation is then partially determined by the same self-reported level (circular logic).

---

### CR-7 [CRITICAL] — EU AI Act core requirement absent: no AI system risk classification
**Source**: Question banks, dimension descriptions

The EU AI Act's first and most fundamental obligation is classifying AI systems by risk tier (unacceptable, high-risk, limited-risk, minimal-risk — Annex III). Marketing copy explicitly cites the August 2026 enforcement deadline and €35M penalty exposure. Yet none of the 60 questions ask whether users have classified their AI systems under EU risk tiers. European buyers — highest urgency, highest penalty exposure — will use this product and remain unaware of their primary compliance obligation.

---

### CR-8 [CRITICAL] — `operatingRegions` reference equality silently wipes all assessment responses
**File**: `src/store/assessmentStore.ts:118-130`

```typescript
const questionsWillChange =
  'operatingRegions' in updates && updates.operatingRegions !== state.profile.operatingRegions;
```

This is reference comparison, not value comparison. Any UI component that passes `operatingRegions` as a new array literal (standard React controlled input pattern) will trigger a full response wipe even when no region actually changed. A user who has completed 4 of 6 dimension steps and then adjusts their organization name — if the profile update includes a new `operatingRegions` array reference — loses all 40 answers silently. `saveDraft` runs after the wipe, persisting the empty state. No undo, no confirmation, no recovery.

---

### CR-9 [CRITICAL] — Completion date always shows current date, not assessment date
**File**: `src/components/dashboard/ResultsDashboard.tsx:122`

```typescript
new Date().toLocaleDateString() // always "today"
```

The "Completed on" date header always shows the current date, not when the assessment was actually completed. A user who finishes Monday and reviews Wednesday sees "Completed on Wednesday." This is a data integrity bug visible on the first screen users see after completing an assessment.

---

### CR-10 [CRITICAL] — Unverifiable statistics displayed as authoritative facts
**Files**: `src/components/wizard/WelcomePage.tsx:36-48`, `src/data/dimensions.ts:19`

- `$67.4B lost to AI hallucinations (2024)` — not traceable to any peer-reviewed study, Gartner, McKinsey, or Forrester report
- `92% of organizations trust vendors but cannot verify` — unattributed in code and UI
- `12% achieve AI Achiever status` — self-referential (product has no benchmark data yet)

A commercial product selling governance credibility to compliance-aware buyers cannot open with unverifiable statistics. When challenged by a CFO or General Counsel evaluating a $3K purchase, or when statistics appear in board presentations generated from PDFs, this becomes a credibility and potential liability issue.

---

### CR-11 [CRITICAL] — Human Oversight gap internally flagged but unresolved
**Source**: MEMORY.md "Phase 4 flag", question banks

EU AI Act Article 14 and ISO 42001 Clause 8.4 require documented human oversight mechanisms — not just "someone reviews AI output" but documented override capability, escalation chains, and decision logging. The question bank has `airisks-e-2` ("do you have guidance about reviewing AI content") which is awareness-level. The gap is explicitly noted in internal memory as a known issue that has not been addressed.

---

## Section 3 — HIGH FINDINGS

Grouped by category. Each entry includes file, line, and description.

### 3A — Security

**[H-SEC-1] SQL injection via string interpolation**
`src/services/db.ts:580-581` — Column name interpolated: `SET fired_${days} = 1`. Type system provides compile-time safety only; no runtime allowlist check before SQL construction.

**[H-SEC-2] `http:default` grants unrestricted outbound HTTP bypassing CSP**
`src-tauri/capabilities/default.json:55` — Plugin HTTP calls bypass webview CSP `connect-src`. Any code path can make requests to arbitrary hosts through the Tauri HTTP plugin.

**[H-SEC-3] `fs:allow-read` on `$RESOURCE/**`**
`src-tauri/capabilities/default.json:27-34` — App can read any bundled resource file including future embedded credentials or certificates. Not needed for current feature set.

**[H-SEC-4] CSP `connect-src` missing actual CDN domain**
`src-tauri/tauri.conf.json:26` — The live CDN URL (`*.r2.dev`) is not in `connect-src`. The configured `*.workers.dev` is wrong. CSP does not govern actual network surface.

**[H-SEC-5] `decodeURIComponent` on deep link key without try/catch**
`src/App.tsx:84` — Malformed percent-encoding (e.g., `aigov://activate?key=%GG`) throws `URIError` uncaught inside the deep link callback. The `.catch(() => {})` on the `onOpenUrl` promise does not catch errors thrown inside the callback.

**[H-SEC-6] Source maps may expose full TypeScript source in production bundle**
`vite.config.ts` — No `build: { sourcemap: false }` setting. Extracting the `.app` bundle exposes all business logic, scoring algorithms, and freemium gate code.

**[H-SEC-7] Org name used unsanitized in generated PDF filename**
`src/utils/pdfExport.ts:376` — Only whitespace replaced with hyphens. Characters like `/`, `..`, `\` are not stripped. On macOS/Linux, a `/` in org name would be interpreted as a path component by the OS save dialog.

**[H-SEC-8] DevTools auto-opened in debug builds with no CI guard against accidental debug distribution**
`src-tauri/src/lib.rs:16-21` — `#[cfg(debug_assertions)]` opens DevTools automatically. No CI check prevents a `--debug` Tauri build reaching users. DevTools = instant Pro tier unlock via Zustand console access.

**[H-SEC-9] `process:allow-restart` granted with no current use case**
`src-tauri/capabilities/default.json:19` — Unnecessary permission. Should be removed until actually needed.

---

### 3B — Data Integrity & State

**[H-STATE-1] `canProceed()` uses magic number and fragile string prefix matching**
`src/store/assessmentStore.ts:191-210` — Hardcoded `dimensionQuestionCount = 10` breaks if jurisdiction filtering returns fewer questions. `startsWith('shadow')` prefix matching with no trailing hyphen can match unintended IDs. Missing `default` case silently allows all question IDs to pass the gate.

**[H-STATE-2] Draft hydration has no schema version check**
`src/store/assessmentStore.ts:181-189` — Draft data is restored verbatim with no version check, no question ID validation, and no step validity check. Stale drafts from old versions silently produce wrong scores.

**[H-STATE-3] `calculateResults()` called before `set({ currentStep: 'results' })` — double re-render**
`src/store/assessmentStore.ts:147-161` — Two sequential `set()` calls cause a render flash where new scores appear on the still-active dimension step.

**[H-STATE-4] `getQuestionsForProfile` called on every render without memoization**
`src/components/wizard/DimensionStep.tsx:13-16` — Filters 240 questions on every component re-render. Should be wrapped in `useMemo`.

**[H-STATE-5] `selectedIndex` computed inside `options.map()` loop — redundant `findIndex` calls**
`src/components/wizard/DimensionStep.tsx:81-84` — 160 `findIndex` calls per render for a 10-question dimension. Compute once per question.

**[H-STATE-6] Three parallel `useEffect` DB fetches in TrackProgress with no unmount cancellation**
`src/components/dashboard/TrackProgress.tsx:1135-1174` — All three fire independent async IIFEs with no cancellation on unmount. Produces "update on unmounted component" warnings and potential memory leaks.

**[H-STATE-7] Optimistic deletes without rollback in TrackProgress**
`src/components/dashboard/TrackProgress.tsx:234-241, 584-591, 200-221` — Three separate optimistic state updates (delete mitigation item, delete spend item, status change) with no rollback on database failure. Items "resurrect" on next app launch.

**[H-STATE-8] Silently fallback to Experimenter questions for unknown maturity level**
`src/data/questions/index.ts:51` — `bankMap[maturityLevel] ?? EXPERIMENTER_QUESTIONS` silently gives an Achiever-level org beginner questions if the enum is ever extended and the map not updated.

**[H-STATE-9] `initDatabase` failure silently produces a working-looking app with no persistence**
`src/App.tsx:55` — `catch {}` discards all init errors. A database failure shows the user a normal app that loses all data without warning.

**[H-STATE-10] `saveDraft` failures silently swallowed everywhere**
`src/store/assessmentStore.ts:79, 93, 109, 129, 144` — All `.catch(() => {})`. The "resume where you left off" selling point silently fails when SQLite is locked, full, or corrupted.

---

### 3C — React / TypeScript Patterns

**[H-REACT-1] `ErrorBoundary` uses `window.location.reload()` instead of Tauri `relaunch()`**
`src/components/ErrorBoundary.tsx:35` — Browser-world reload does not re-run Tauri's Rust-side plugin initialization. The correct recovery action is `@tauri-apps/plugin-process` `relaunch()`.

**[H-REACT-2] Raw error message rendered to users in production**
`src/components/ErrorBoundary.tsx:62-65` — `{this.state.error.message}` exposes internal technical strings. Production should show a generic friendly message.

**[H-REACT-3] Click-to-close overlay on entire main area causes accidental settings dismissal**
`src/components/layout/AppLayout.tsx:71` — Clicking anywhere in the main content area while settings is open dismisses settings. A user answering a question question dismisses settings. Use a dedicated overlay instead.

**[H-REACT-4] `aliveRef.current = true` reset in Strict Mode is unreliable**
`src/App.tsx:34` — There is a window between Strict Mode's unmount cleanup (sets `false`) and remount (sets `true`) where the guard is defeated. The pattern is not reliably safe for Strict Mode.

**[H-REACT-5] Version `v0.1.0` hardcoded in three separate files**
`src/components/layout/AppLayout.tsx:51`, `Settings.tsx`, `AboutPanel.tsx:18` — No single source of truth. Use `import.meta.env.VITE_APP_VERSION` or Tauri's `getVersion()`.

**[H-REACT-6] `EmailCaptureModal.tsx:handleSave` has no try/catch**
`src/components/modals/EmailCaptureModal.tsx:21-33` — Database errors leave the modal stuck in "Saving…" state with no dismissal path. User is trapped.

**[H-REACT-7] License key input is orphaned — Activate button permanently disabled**
`src/components/settings/panels/LicensePanel.tsx:59-83` — Key input updates state but the Activate button has no `onClick` and is `disabled`. Deep link pre-fill also has no submission path. The activation UX flow is dead.

**[H-REACT-8] `EmailPanel.tsx:handleSave` saves with no email format validation**
`src/components/settings/panels/EmailPanel.tsx:30-45` — Unlike the modal, the settings panel applies no regex validation. Any string saves as a valid email address.

**[H-REACT-9] `EmailPanel.tsx:39` hardcodes `reminderDays: 30` on every save**
`src/components/settings/panels/EmailPanel.tsx:39` — Overwrites user's previously chosen 60 or 90 day setting silently.

**[H-REACT-10] License email input hardcoded to empty string**
`src/components/settings/panels/EmailPanel.tsx:126-135` — `value=""` always. Misleads users who expect their license email to appear here.

---

### 3D — Scoring & Recommendations Logic

**[H-SCORE-1] Scoring comment misleads: says "0 (worst raw)" but 0 is the BEST raw value**
`src/utils/scoring.ts:89-91` — The arithmetic is correct but the comment is backwards. Any developer reading this will implement future changes with wrong mental model. Fix the comment.

**[H-SCORE-2] `calculateOverallRisk()` silently handles partial `dimensionScores` with wrong weighting**
`src/utils/scoring.ts:101-113` — Missing dimensions leave weights not summing to 1.0. Score is systematically understated with no error. `DIMENSION_WEIGHTS` constant is also duplicated from `dimensions.ts` — two sources of truth that can drift.

**[H-SCORE-3] `identifyBlindSpots()` ignores unanswered questions**
`src/utils/scoring.ts:175-214` — Only questions with responses are checked. A skipped dimension gets a fabricated 50/100 score (CR-3) but zero blind spots identified — the engine is inconsistent with itself.

**[H-SCORE-4] Three paid recommendations are unconditional pushes**
`src/utils/recommendations.ts:116-175` — Vendor Questionnaire, Implementation Roadmap, and Monitoring Strategy recommendations are pushed for every assessment regardless of scores. An org at 98/100 gets "you need an implementation roadmap." This is not personalized; it's a static upsell that undermines the "customized recommendations" positioning.

**[H-SCORE-5] `_licenseTier` parameter is unused in `generateRecommendations`**
`src/utils/recommendations.ts:11-16` — The function accepts but ignores `licenseTier`. All recommendations (free and paid) are always generated. Freemium filtering is UI-only — no defense in depth.

**[H-SCORE-6] `getIndustryVendorDescription()` uses generic default for 9 of 14 industries**
`src/utils/recommendations.ts:206-222` — Retail, Manufacturing, Technology, Telecom, Media, Real Estate, Nonprofit, Energy, Other all get identical generic text. The "industry-customized vendor questionnaire" claim is false for the majority of users.

---

### 3E — Domain / Product

**[H-DOMAIN-1] GDPR/CCPA compliance obligations superficially covered**
Question bank — Data governance questions ask "are employees aware?" not "do you have a lawful basis for AI processing?" or "can you fulfill DSAR requests?" Awareness theater, not compliance assessment.

**[H-DOMAIN-2] ISO 42001 cited in recommendations but no clause-level mapping exists**
Recommendations suggest an "ISO 42001 Gap Assessment & Certification Roadmap" as a paid output. No question maps to a specific ISO 42001 clause (4.1, 6.1, 8.3, 9.1). Compliance officers will ask which questions cover which clauses. There is no answer.

**[H-DOMAIN-3] No supply chain / foundation model risk coverage**
Organizations using OpenAI/Anthropic/Google APIs embedded in their own products face model provenance, bias, and versioning risk. None of the six dimensions adequately covers this. Vendor Risk questions focus on SaaS contracts, not foundation model dependencies.

**[H-DOMAIN-4] Free-to-Pro upgrade path is undefined and unbuilt**
No in-app upgrade button, no purchase page link, no trial extension, no license key submission flow (see LB-2). A user who decides to buy cannot buy.

**[H-DOMAIN-5] Freemium conversion hook misplaced**
Free tier shows full assessment + score + top 3 blind spots. The moment of maximum engagement (seeing the score) fires before any gate. Generic recommendations tell users nothing actionable they couldn't find in a free blog post. The gate should be earlier or the free value proposition restructured.

---

## Section 4 — MEDIUM FINDINGS

Key issues organized by file area. Full list abbreviated to the most actionable items.

### Infrastructure / Config

- **[M-INFRA-1]** `db.ts:176-181` — `JSON.parse` + `as Type` on SQLite data with no structural validation. Corrupt or schema-migrated data produces silently invalid objects consumed throughout the app.
- **[M-INFRA-2]** `db.ts:127-129` — `initDatabase` failure swallowed; app runs with broken persistence and no user warning.
- **[M-INFRA-3]** `db.ts:44-50` — Migration via `try/catch` on `ALTER TABLE` catches all errors, not just "column exists." Disk-full or lock errors silently ignored.
- **[M-INFRA-4]** `db.ts:358-361` — Uses `ORDER BY id DESC LIMIT 1` instead of `RETURNING id` or `last_insert_rowid()` to get inserted row ID. Architecturally incorrect.
- **[M-INFRA-5]** `contentService.ts:86-88` — Offline cache loaded with no version check. Poisoned cache from a prior session persists indefinitely.
- **[M-INFRA-6]** `vite.config.ts:19` — Dev server binds to external network when `TAURI_DEV_HOST` is set, exposing source and hot-reload to network peers.
- **[M-INFRA-7]** `tauri.conf.json:26` — `style-src 'unsafe-inline'` weakens CSP. `connect-src` uses overly broad `https://*.workers.dev`.
- **[M-INFRA-8]** `tauri.conf.json:5` — Bundle identifier `com.baltaguilar-tech.ai-governance-tool` contains hyphens; may cause issues with code signing and notarization toolchains.
- **[M-INFRA-9]** `package.json` — No `npm audit` run documented. Bleeding-edge dependencies (`react ^19.2`, `vite ^7.3`, `typescript ~5.9`) not audited for CVEs. jsPDF `^4.1.0` semver range can auto-resolve to breaking versions for a compliance-report-generating product.

### React Components

- **[M-UI-1]** `ResultsDashboard.tsx:45-66` — `eslint-disable` suppresses missing deps on auto-save effect; may create duplicate saved assessments.
- **[M-UI-2]** `ResultsDashboard.tsx:157-203` — Revenue/regulatory exposure calculation in inline IIFE, not memoized, re-runs on every render.
- **[M-UI-3]** `ResultsDashboard.tsx:280-287`, `BlindSpotsList.tsx:37`, `RecommendationsList.tsx:73,113` — Index `i` used as `key` in multiple component maps. React reconciliation bugs when list content changes.
- **[M-UI-4]** `ProfileStep.tsx:25-29` — `locationSelect` local state does not sync with store reset; desync after `resetAssessment()`.
- **[M-UI-5]** `ProfileStep.tsx:284` — Sticky nav `-mx-6 px-6` negative margin hack brittle to parent padding changes.
- **[M-UI-6]** `Settings.tsx:94-96` — Settings returns `null` when closed, unmounting all panel state. Active section resets to `'license'` on every open.
- **[M-UI-7]** `NotificationsPanel.tsx:58-69` — Optimistic toggle with no rollback. `Store.load` called on every mount instead of singleton.
- **[M-UI-8]** `TrackProgress.tsx:339` — `key={item.id ?? 0}` means undefined-ID items share key 0. `deleteSpendItem(item.id ?? 0)` passes 0 to DB on undefined ID.
- **[M-UI-9]** `DimensionRadar.tsx` — Chart labeled "Risk by Dimension" with footer "Larger area = larger risk exposure" — this is inverted. Larger area = stronger governance. Actively misleads users.
- **[M-UI-10]** `BlindSpotsList.tsx:89`, `RecommendationsList.tsx:131` — "Unlock Full Analysis" and "Upgrade to Pro" buttons have no `onClick` handler. Broken conversion funnel.

### Scoring / Data

- **[M-SCORE-1]** `assessment.ts:83` — `annualRevenue` and `expectedAISpend` are untyped strings. Monetary values without type contract.
- **[M-SCORE-2]** `assessment.ts:252-262` — `assessmentVersion` typed as `number` in `CompletedAssessmentSnapshot` but `string` in `AssessmentResult`. Silent type mismatch.
- **[M-SCORE-3]** `dimensions.ts` — `WIZARD_STEPS` key strings not enforced against `WizardStep` type union. Can drift silently.
- **[M-SCORE-4]** `experimenter-questions.ts:571-576` — `airisks-e-3` options in non-standard value order (100, 35, 65, 0). Users choosing by position get wrong answers recorded.
- **[M-SCORE-5]** `scoring.ts:197-198` — `MAX_PER_DIM = 2` and `score > 40` blind spot thresholds are unexplained magic numbers with no specification rationale.
- **[M-SCORE-6]** `recommendations.ts:25-47` — Stacked `< 40` and `< 60` conditions for same dimension produce overlapping recommendations for the same problem.
- **[M-SCORE-7]** `recommendations.ts:224-264` — `Region.MiddleEast` and `Region.LatinAmerica` receive zero regulatory recommendations despite applicable data protection laws.

### Accessibility (consolidated)

- **[M-A11Y-1]** `DimensionStep.tsx:87-108` — Question option buttons have no `role="radio"`, no `aria-checked`, no `role="radiogroup"`. Core assessment interaction is invisible to screen readers.
- **[M-A11Y-2]** `ProfileStep.tsx:80-93, 155-179` — Size selector and region toggles missing `role="radio"/"radiogroup"` and `aria-pressed`.
- **[M-A11Y-3]** `EmailCaptureModal.tsx` — No `role="dialog"`, no `aria-modal`, no `aria-labelledby`, no focus trap, no Escape key handler.
- **[M-A11Y-4]** `Settings.tsx` — No keyboard focus trap when sidebar is open. No `aria-label` on sidebar nav.
- **[M-A11Y-5]** `LoadingScreen.tsx:153-169` — Status text contrast ratio ~3.0:1 (WCAG AA requires 4.5:1). Progress percentage at ~2.2:1.

---

## Section 5 — LOW FINDINGS (Selected)

- **[L-1]** `main.tsx:7` — Non-null assertion `getElementById('root')!` with no guard. HTML template change = uncaught crash before ErrorBoundary mounts.
- **[L-2]** `db.ts:16` — SQLite singleton never explicitly closed; no WAL checkpoint on exit. WAL file grows unboundedly over time.
- **[L-3]** `AppLayout.tsx:88` — Copyright year `2026` hardcoded. Use `new Date().getFullYear()`.
- **[L-4]** `ProgressStepper.tsx:24` — Mobile "Step N of M" uses `WIZARD_STEPS.length - 1` but should be `length - 2` to exclude both `welcome` and `results`.
- **[L-5]** `ProgressStepper.tsx:80` — Connector line rendering condition `i < WIZARD_STEPS.length - 3` is magic arithmetic with no documented rationale.
- **[L-6]** `experimenter-questions.ts` — `weight`, `riskLevel` on options, and non-`radio` question types all exist in the schema but are never used. Dead type surface.
- **[L-7]** `data-e-10` (GDPR/CCPA question) — Shown to orgs with only Asia-Pacific regions. Penalizes orgs for non-applicable regulations.
- **[L-8]** `assessment.ts` — `Region.UK` does not exist; UK orgs must select `Region.Europe`, bundling UK with EU post-Brexit. UK-specific obligations cannot be separately gated.
- **[L-9]** `pdfExport.ts:547+` — `(doc as any).lastAutoTable.finalY` — undocumented internal jspdf-autotable property. Will break on any minor library upgrade. No try/catch in `generateProPDF`.
- **[L-10]** `lib.rs:14` — Auto-updater plugin in `package.json` but not registered in `lib.rs`. Update mechanism silently does nothing.
- **[L-11]** `CLAUDE.md:28` — States `questions.ts` (60 questions) as the active question source. File no longer exists. Build status section last updated 2026-02-17. Stale context creates compounding confusion across sessions.
- **[L-12]** EU AI Act penalty claim oversimplified — "€35M or 7% worldwide turnover" applies to most serious violations only; lower-tier violations have lower caps. Imprecise for a compliance product.
- **[L-13]** Maturity tier names (Experimenter/Builder/Innovator/Achiever) feel consumer/gamified. Target buyers (CISOs, COOs, compliance leads) may find this infantilizing. Contrast with ISO 42001 clause structure or Gartner maturity model terminology.
- **[L-14]** No peer benchmarking data. Score of 42/100 has no context without "organizations like yours average X." The score's urgency and shareability are significantly reduced without this.
- **[L-15]** `AboutPanel.tsx:36-50` — Privacy Policy and Terms of Service buttons disabled with "coming soon." These are legally required for a commercial product collecting email addresses. Cannot ship to customers in this state.

---

## Section 6 — Recommended Action Plan

Organized into three tiers for project planning.

### Tier 1 — Pre-Launch Gate (nothing ships until these are done)

| ID | Issue | Effort |
|----|-------|--------|
| LB-1 | Remove Testing Mode toggle from LicensePanel (guard with `import.meta.env.DEV`) | 30 min |
| LB-2 | Wire Keygen.sh license validation + payment processor | 2-4 weeks |
| LB-3 | Apple Developer account + macOS code signing setup | 1-2 weeks |
| CR-1 | Remove `$HOME/**` from capabilities/default.json | 15 min |
| CR-2 | Add schema validation + response size limit to contentService CDN fetches | 1 day |
| CR-3 | Add `if (answeredCount === 0) return null` to scoring; exclude from weighted avg | 2 hours |
| CR-9 | Fix completion date to use actual assessment save timestamp | 1 hour |
| L-15 | Add Privacy Policy and Terms of Service documents | External (legal) |

### Tier 2 — Product Integrity (before charging money)

| ID | Issue | Effort |
|----|-------|--------|
| CR-4 | Fix TrackProgress ROI snapshot to capture `annualCost` at snapshot time | 2 hours |
| CR-5 | Raise DimensionStep canContinue threshold to 8/10 | 30 min |
| CR-6 | Revise dimension weights with governance framework expert; remove ROI as dimension | 1 week (domain work) |
| CR-7 | Add EU AI Act risk classification questions to all 4 question banks | 1 week (content) |
| CR-8 | Fix `operatingRegions` comparison to use deep equality | 1 hour |
| CR-10 | Replace unverified stats with properly sourced McKinsey/Gartner/Forrester citations | 1 day (research) |
| H-REACT-6 | Add try/catch to EmailCaptureModal.handleSave | 30 min |
| H-SCORE-4 | Make vendor questionnaire, roadmap, monitoring recommendations conditional | 1 hour |
| H-UI, M-UI-10 | Wire "Upgrade to Pro" and "Unlock" buttons to a defined upgrade flow | Blocked on LB-2/LB-4 |

### Tier 3 — Quality & Polish (before v1.0 GA)

| ID | Issue | Effort |
|----|-------|--------|
| H-SCORE-1 | Fix misleading scoring comment | 5 min |
| M-SCORE-4 | Fix `airisks-e-3` option ordering | 15 min |
| M-UI-3 | Replace index keys with stable IDs across all list renders | 2 hours |
| M-A11Y-1 to 5 | Add ARIA roles, labels, focus management throughout | 2-3 days |
| M-UI-9 | Fix DimensionRadar label: "Governance Strength by Dimension" (larger = stronger) | 30 min |
| H-REACT-5 | Single-source version from env var or Tauri `getVersion()` | 1 hour |
| L-10 | Register updater plugin in lib.rs or remove dependency | 30 min |
| L-11 | Update CLAUDE.md build status section to current state | 30 min |
| L-13 | Evaluate maturity tier naming against target buyer persona | Strategic |
| L-14 | Plan anonymous benchmarking data strategy for v2 | Strategic |

---

## Known Issues (Already Logged Internally)

The following were found by review agents but are already tracked in project notes. Noted for completeness; no new action required beyond existing plan.

- License hardcoded to Pro in DEV / Keygen wiring — noted in `assessmentStore.ts:67-69` TODO
- `canProceed()` startsWith prefix fragility — noted in MEMORY.md
- Score disclaimer as "indicative-only" — exists in UI but insufficient for methodology gaps
- Per-question immediate actions showing as dimension fallback — tracked in CURRENT-SESSION.md
- Human oversight gap — flagged in MEMORY.md as "Phase 4 flag"
- DOCX library not selected — open question
- Achiever Pro tier scope undefined — open question

---

*Document generated: 2026-03-04. Next review recommended before v1.0 commercial launch.*
