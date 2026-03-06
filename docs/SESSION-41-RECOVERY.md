# SESSION-41-RECOVERY.md
*Created end of session 40 — 2026-03-06*

---

## Git State at Session Start
- **Branch**: `main`
- **origin/main**: fully pushed and in sync — `local == remote == 2e50483`
- **SSH remote**: `git@github.com:baltaguilar-tech/ai-governance-tool.git`
- **SSH key**: `~/.ssh/github_alphapi` (ed25519, no passphrase). Push command: `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_alphapi" git push origin main`
- **Git identity**: `Balt Aguilar <balt.aguilar@outlook.com>` (global config set)
- **Tag on remote**: `v0.9.0-beta` exists (created prior session for beta release)
- **Local-only files** (not in repo, not committed): `docs/CURRENT-SESSION.md`, `docs/tool-diary.md` — this is intentional per .md Update Protocol

## Commits This Session (40) — All Pushed
| Hash | Description |
|------|-------------|
| `1a2cf18` | fix(pdf): adversarial review fixes — font reset, null guards, Section 3 overflow, color thresholds, ROI NaN + delete orphan executiveSummary.ts |
| `842a34d` | docs: session 40 log + initial session 41 recovery doc |
| `2e50483` | docs: update remaining-work-plan — BT-7/BT-8 status, PDF bug backlog (PDF-1 through PDF-4) |

---

## What Was Done This Session (40)

### Cleanup (committed in 1a2cf18)
- Fixed Pro PDF footer label: `addFooter('Executive Summary')` → `addFooter('Assessment Results')` (`pdfExport.ts` line ~907)
- Deleted orphan `src/utils/executiveSummary.ts` (no longer imported after session 39 exec summary rewrite)

### Scoring Engine Audit — CLEAN
Full dynamic audit of `scoring.ts`, `DimensionStep.tsx`, `assessmentStore.ts`, `questions/index.ts`:
- No hardcoded question counts anywhere — all derived from `getQuestionsForProfile()`
- `canProceed()` and `canContinue` both use `Math.ceil(questions.length / 2)` dynamically
- aiSpecificRisks at 13 questions correctly requires 7 answers (50% threshold)
- All 4 banks confirmed at 63 questions each (13 in aiSpecificRisks, 10 in all others)

### PDF Adversarial Review — 5 Bugs Fixed (committed in 1a2cf18)
| ID | Bug | Fix Applied |
|----|-----|-------------|
| P-002 | `pdfText(undefined)` crashes — no null guard | Added `if (!text) return ''` at top of `pdfText()` |
| P-003 | Section 3 (ROI) silently omitted when Section 2 overflows page | Replaced omit-on-overflow with always-render + `doc.addPage()` guard |
| P-004 | `addFooter()` renders in whatever font state preceded it — bold bleed risk | Added `doc.setFont('helvetica', 'normal')` at top of `addFooter()` |
| P-006 | Gap score colors used `<50/<70` thresholds; `getRiskLevel()` uses `<40/<70` | Aligned: `sc < 40 = red`, `sc < 70 = amber`, `>= 70 = green` |
| P-007 | `monthlyEquivalent` undefined → NaN% in ROI table in Pro PDF | Added `|| 0` guard in `spendItems.reduce()` |

Confirmed NOT bugs (agent false alarms):
- P-001 (drawRichText font state): line 272 always resets to normal — not a bug
- P-005 (long word overflow): word renders on its own line — acceptable behavior, not worth complexity

### Question Bank Adversarial Review — No Blocking Bugs
- EU AI Act questions (12 total — 3 per bank × 4 banks): accurate, well-calibrated, correctly tagged `jurisdictions: ['eu']`
- Maturity progression (Experimenter=awareness → Achiever=audit-ready) is coherent and correctly calibrated
- ID prefix inconsistency (`airisks-e-` vs `risk-b-` vs `airisk-i-` vs `airisk-a-`): cosmetic only — scoring uses `q.dimension`, not ID prefix
- 5-option pattern on Innovator/Achiever (100,75,50,25,0) vs 4-option on Experimenter/Builder (100,65,35,0): within-profile scoring is consistent — profiles are never cross-compared — not a runtime bug, but worth standardizing (PDF-4, needs user decision)
- `weight`/`riskLevel` option fields on Innovator/Achiever: metadata only, never used in `scoring.ts`

### BT-7 / BT-8 Status Confirmed
- **BT-8** (Executive Summary BYOK API key panel + consent flow): **DONE** — commit `1adc590` (session 38)
- **BT-7** (Unsigned .app tester build): **NOT DONE** — no commit, no build artifact exists. Session 41 Priority 1.

### README Status — Deferred to Session 41
- README was reviewed. It is functional but has stale content.
- **Decision**: Do NOT update README until BT-7 is done. Update README + install instructions together in session 41 as one cohesive update — updating install instructions that reference a `.dmg` that doesn't exist yet would be misleading.
- **"One button" install** = `AlphaPi.command` (the installer script, BT-2, already built). Confirmed by user. Not a new feature — just needs README to accurately describe the existing flow once the `.dmg` artifact exists.
- **Stale items to fix in session 41** (do alongside BT-7):
  - Line 22: "240 calibrated assessment questions" → **252**
  - Line 40 (table): "Full 240-question assessment" → **252**
  - Line 103: "240 questions across 4 maturity profiles" → **252**
  - Add Phase 4 status block (complete — question improvements, EU/US coverage)
  - Add session 40 PDF executive summary + adversarial fixes to Phase 1 block
  - Update For Beta Testers section once actual `.dmg` build exists

### Memory + Docs Updated
- `MEMORY.md` (195 lines — under 200 limit): question count 240→252, current status updated to session 40, Phase 5 Wizard section compressed, Things Not Yet Built rewritten with item codes
- `docs/remaining-work-plan.md`: BT-7 → session 41 pending, BT-8 → done, Priority 5B PDF bug backlog added (PDF-1–4)

---

## Session 41 Goals — Priority Order

### Priority 1: BT-7 — Unsigned .app Tester Build + README Update
Build the unsigned `.app` and update README/install instructions together as one deliverable.

**Build steps:**
1. Verify last known build was clean: `PATH=/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH npm run tauri build`
2. Output: `src-tauri/target/release/bundle/macos/AlphaPi_*.dmg`
3. Verify the `.dmg` mounts correctly and `Install AlphaPi.command` runs
4. Verify app launches and `BETA-TESTER-2026` key activates Pro features

**Gatekeeper bypass (testers must do one of these):**
- Right-click the `.app` → Open (first launch only)
- OR: `xattr -cr /Applications/AlphaPi.app && open /Applications/AlphaPi.app`
- macOS 14+ (Sonoma) may require: System Settings → Privacy & Security → Open Anyway

**README fixes to apply at same time:**
- Fix question count: 240 → 252 in 3 places (lines 22, 40, 103)
- Add Phase 4 complete status
- Update For Beta Testers section with current accurate `.dmg` install flow
- Confirm `AlphaPi.command` instructions match actual installer behavior

**TESTER-GUIDE.md check:**
- Verify Gatekeeper bypass instructions are current for macOS 14+/15+
- Verify `BETA-TESTER-2026` key instructions still accurate
- Verify feedback email is current (`balt.aguilar@outlook.com`)

### Priority 2: Medium-Priority PDF Bugs (from adversarial review, deferred session 40)
Tracked in `docs/remaining-work-plan.md` as PDF-1 through PDF-3. Fix all 3 in one pass.

| ID | Bug | Fix |
|----|-----|-----|
| PDF-1 | `section2Gaps` items not null-guarded (`.dimension`, `.score` access) | Add `if (!gap?.dimension || gap.score === undefined) continue` in gap loop |
| PDF-2 | Unclosed `**` bold marker leaves raw `**` in PDF output | In `parseBoldSegments()`, validate even number of `**` markers; strip unbalanced markers if odd |
| PDF-3 | Dimension score not clamped to 0–100 before bar/text rendering | Add `Math.max(0, Math.min(100, score))` at render sites |

### Priority 3: PDF-4 Decision — Question Bank Option Pattern
**Pending user decision**: Standardize all 4 banks to 4-option (100,65,35,0) OR 5-option (100,75,50,25,0)?

- **Current state**: Experimenter/Builder = 4-option; Innovator/Achiever = 5-option
- **4-option (simpler)**: Matches existing Experimenter/Builder. Change 126 questions in Innovator/Achiever.
- **5-option (more granular)**: Better score differentiation at higher maturity levels. Change 126 questions in Experimenter/Builder.
- **My recommendation**: 4-option. The extra granularity in 5-option isn't worth the inconsistency, and answer options should feel uniform across all profiles.
- **Impact if deferred further**: No runtime bugs. Low urgency. Safe to push to session 42.

### Priority 4: Session Wrap
- Push all commits
- Update `remaining-work-plan.md` to mark completed items
- Write `SESSION-42-RECOVERY.md`
- Update `MEMORY.md` if architecture or status changes

---

## Pending User Decisions
| Decision | Context | Impact |
|----------|---------|--------|
| **PDF-4**: 4-option vs 5-option question banks | Innovator/Achiever use 5-option (100,75,50,25,0); others use 4-option (100,65,35,0) | 126 questions change whichever direction is chosen |

---

## Known Issues / Watch-Outs Carried Forward
1. **BT-7 unsigned build**: No `.dmg` exists — testers cannot test until session 41 delivers this
2. **README stale**: Question count wrong (240 vs 252), Phase 4 missing — fix with BT-7 in session 41
3. **Exec Summary PDF layout**: Overflow guards are code-only — no visual testing done. Beta tester feedback may surface issues.
4. **5-option vs 4-option pattern**: Cosmetic inconsistency, deferred pending PDF-4 decision
5. **Keygen / Apple Dev / company formation**: Primary blockers for signed public release — user action required

---

## User Actions Required (Outside Code)
Do these in order — each unblocks the next:
1. **Trademark search for "AlphaPi"** — USPTO TESS (Class 42) + EUIPO + UK IPO. Do BEFORE spending on company/domain.
2. **Domain registration** — `alphapi.com` or similar. ~$12/yr. No company needed. Can do today.
3. **Company formation** — LLC (home state) or C-Corp via Stripe Atlas. Starts the full dependency chain.
4. **EIN** — Free, instant via IRS.gov (after company)
5. **D-U-N-S number** — Via Apple's enrollment portal (free; takes 5–30 business days). START IMMEDIATELY after company formation — this is the longest gate.
6. **Business bank account** — Mercury or Brex (after EIN)
7. **Website** — Must include Privacy Policy + ToS. Required for EV cert and payment processor.
8. **Apple Developer Program (Organization)** — $99/yr. Requires D-U-N-S + legal entity. Unblocks GL-3, GL-4, GL-6.
9. **EV Code Signing Cert (Windows)** — DigiCert or Sectigo ~$300–500/yr. Requires legal entity + domain. Unblocks DI-3, DI-4.
10. **Payment processor** — Paddle or LemonSqueezy. Requires website + legal entity + bank.
11. **Keygen.sh account** — Get KEYGEN_ACCOUNT_ID, KEYGEN_PRODUCT_ID, KEYGEN_PUBLIC_KEY. Unblocks GL-2.

---

## Startup Command for Session 41

```
Session 41 — AlphaPi. Read docs/SESSION-41-RECOVERY.md and brief me on current state before we do anything.

Context: Tauri v2 + React 19 + TypeScript desktop app for AI governance assessment and ROI measurement.

Session 40 recap: PDF adversarial review — 5 bugs fixed (pdfText null, addFooter font bleed, Section 3 overflow, color thresholds, ROI NaN). Question banks passed structural + content review — EU AI Act questions confirmed accurate, scoring engine fully dynamic. executiveSummary.ts orphan deleted. BT-7 confirmed NOT done, BT-8 confirmed done. README deferred until BT-7 exists.

Session 41 primary goal: BT-7 — build unsigned .app + update README/install instructions together.
Secondary: PDF-1/2/3 medium bugs. Tertiary: PDF-4 decision (4-option vs 5-option question banks).

Ask clarifying questions before building anything.
```
