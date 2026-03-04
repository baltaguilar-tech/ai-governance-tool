# AI Governance Tool — Project Plan

**Source**: Adversarial code review (2026-03-04) — `docs/code-review.md`
**Scope**: CRITICAL + HIGH findings only
**Excluded (intentional pre-wiring)**: LB-1 Testing Mode toggle, LB-2 Keygen wiring, LB-3 Code signing, LB-4 Payment processor — all deferred to go-live phase

---

## Tier 1 — Security & Data Integrity
> Fix before adding more beta testers. These are silent data-loss or security-exposure risks.

### P1-1 · Scope file system permissions
| | |
|---|---|
| **File** | `src-tauri/capabilities/default.json` |
| **What** | `$HOME/**` write permission grants the app write access to the user's entire home directory |
| **How** | Replace `$HOME/**` with Tauri's scoped `$APPDATA/ai-governance-tool/**`. Audit all other permission grants in the file for over-breadth |
| **Why** | A compromised CDN response or future XSS could write arbitrary files anywhere on the user's machine. This is the broadest blast-radius security issue in the codebase |
| **LOE** | XS — 15–30 min |

---

### P1-2 · Fix SQL injection in `markMilestoneFired`
| | |
|---|---|
| **File** | `src/services/db.ts` |
| **What** | `SET fired_${days} = 1` uses string interpolation for a dynamic column name |
| **How** | Validate `days` against a strict whitelist (`[1, 3, 7, 30]`) before using it in the query string. Alternatively, restructure to avoid dynamic column names entirely |
| **Why** | Structural SQL injection vulnerability. Currently triggered only by app logic, but it's an unacceptable pattern that breaks under any attacker-influenced code path |
| **LOE** | S — 1 hour |

---

### P1-3 · Fix `operatingRegions` silently wiping all responses
| | |
|---|---|
| **File** | `src/store/assessmentStore.ts` — `updateProfile()` |
| **What** | Reference equality check on `operatingRegions` array causes `questionsWillChange = true` on nearly every profile update, silently clearing all saved dimension responses |
| **How** | Replace reference equality with value comparison: `JSON.stringify(updates.operatingRegions) !== JSON.stringify(state.profile.operatingRegions)` |
| **Why** | Any user who updates their profile after completing dimension questions loses all their work with no warning and no recovery. Silent data loss on a data-collection product is a credibility killer |
| **LOE** | XS — 20 min |

---

### P1-4 · Fix TrackProgress ROI snapshot corruption
| | |
|---|---|
| **File** | `src/components/dashboard/TrackProgress.tsx` + `src/services/db.ts` |
| **What** | `snapNetROI` is calculated using live `annualCost` (current spend), not the cost recorded at snapshot time. Changing spend retroactively corrupts all historical ROI charts |
| **How** | Store `costAtSnapshot` in the snapshot DB record when a snapshot is saved. Use that stored value — not live data — when calculating and displaying historical ROI |
| **Why** | The entire value proposition of Track Progress is historical accuracy. If costs change, every prior data point shows wrong ROI. The chart becomes meaningless — and misleading to users making financial decisions |
| **LOE** | M — 2–3 hours (schema migration + snapshot write + calculation fix + chart update) |

---

### P1-5 · Validate CDN content before storing
| | |
|---|---|
| **File** | `src/services/contentService.ts` |
| **What** | Remote JSON from Cloudflare R2 is stored with no schema validation, no size limit, and no URL sanitization. `entry.url` from the manifest is used directly without verifying it points to the expected R2 domain |
| **How** | (1) Validate `entry.url` starts with the known R2 base URL before fetching. (2) Reject responses over a size limit (e.g. 500 KB). (3) Validate required JSON fields and value types before writing to SQLite cache |
| **Why** | A compromised CDN or MITM attack can inject arbitrary content into the app's regulatory guidance cache. Users would see attacker-controlled "compliance guidance" with no indication anything is wrong |
| **LOE** | S — 1–2 hours |

---

## Tier 2 — Scoring & Assessment Accuracy
> Core product reliability. Fix before increasing user volume or enabling paid exports.

### P2-1 · Eliminate fabricated score for unanswered dimensions
| | |
|---|---|
| **File** | `src/utils/scoring.ts` + `src/components/dashboard/ResultsDashboard.tsx` + PDF generator |
| **What** | A dimension with zero answers returns a score of 50, presented to the user as a real data point with no indicator it's fabricated |
| **How** | Return `null` for unanswered dimensions. Show "Not assessed" in the UI (results dashboard + radar chart). Exclude from overall score calculation entirely. Update PDF to reflect "Not assessed" label rather than a fabricated number |
| **Why** | Showing 50 as a real score for a dimension the user never answered corrupts the assessment's credibility. Enterprise buyers reviewing outputs will notice immediately |
| **LOE** | M — 2–3 hours (scoring.ts + dashboard UI + PDF output) |

---

### P2-2 · Document or adjust dimension scoring weights
| | |
|---|---|
| **File** | `src/data/dimensions.ts` |
| **What** | Shadow AI (25%) + Vendor Risk (25%) = 50% of total score. AI-Specific Risks = 10%. No rationale is documented anywhere in the codebase |
| **How** | (1) Add a prominent comment block in `dimensions.ts` explaining the weighting rationale. (2) Evaluate whether current weights align with EU AI Act risk priorities (which emphasize high-risk system oversight more than vendor risk). (3) Add a disclaimer to the PDF that weights reflect general governance priorities and can be discussed with advisors |
| **Why** | Domain experts and enterprise buyers will challenge indefensible scoring immediately. A governance tool that can't explain its own methodology damages trust at the exact moment users are evaluating a purchase |
| **LOE** | M — 2 hours (decision + documentation + PDF disclaimer) |

---

### P2-3 · Wire `licenseTier` into `generateRecommendations`
| | |
|---|---|
| **File** | `src/utils/recommendations.ts` |
| **What** | `_licenseTier` parameter is accepted but never used. All paid recommendations (Vendor Questionnaire, Implementation Roadmap, Monitoring Strategy) are unconditionally generated for every user |
| **How** | Add tier-check conditionals: paid recommendations are only appended when `licenseTier === 'professional'`. Structure is already in place — the parameter just needs to be used |
| **Why** | Free users receive Professional-tier recommendations content. When LB-2 (Keygen) is activated, this will expose a broken experience — free users will see recommendations they can't act on and paid users won't see differentiation. Fix the wiring now so activation just works |
| **LOE** | S — 1 hour |

---

### P2-4 · Fix `canProceed()` fragile prefix matching
| | |
|---|---|
| **File** | `src/store/assessmentStore.ts` — `canProceed()` |
| **What** | Response counting uses `questionId.startsWith(prefix)` with a hardcoded map of step → prefix string, plus a magic number `10` for question count. Any question bank change silently breaks proceed logic |
| **How** | Count actual questions for the current dimension by calling `getQuestionsForProfile()` and matching against real question IDs from the question bank |
| **Why** | Maintainability and correctness. A future question bank edit could cause the Continue button to behave incorrectly with no error and no easy debugging path |
| **LOE** | S — 1–2 hours |

---

### P2-5 · Fix `airisks-e-3` option value ordering
| | |
|---|---|
| **File** | `src/data/questions/experimenter-questions.ts` |
| **What** | Question `airisks-e-3` has option values in order: 100, 35, 65, 0. All other questions use descending order: 100, 65, 35, 0 |
| **How** | Reorder to 100, 65, 35, 0. Verify no other questions in the other three profile banks have the same ordering issue |
| **Why** | This question scores differently from every other question in the assessment. A user selecting "Sometimes" gets a lower score than "Rarely" — the inverse of intent |
| **LOE** | XS — 15–30 min (including audit of all 4 question banks) |

---

## Tier 3 — PDF Output
> Highest user-facing value. These changes directly improve what users take away from the assessment.

### P3-1 · Add unanswered questions to PDF as "Gaps to Address"
| | |
|---|---|
| **Files** | `src/utils/scoring.ts` + PDF generator (`src/utils/pdf/`) |
| **What** | The 50% completion threshold is intentional — users may not know all answers. But skipped questions currently disappear. They should appear in the PDF as items for the user to investigate and document mitigation steps |
| **How** | (1) In `calculateResults()`, track answered vs. unanswered questions per dimension. (2) In the PDF, add a "Questions to Investigate" section per dimension containing: question text + blank "Mitigation Notes" field. (3) Frame as "Consider investigating:" not as failures |
| **Why** | Transforms a product limitation into a consulting deliverable. Users can print the PDF, bring it to their AI governance committee, and fill in the gaps collaboratively. Directly increases the PDF's perceived value |
| **LOE** | L — 4–6 hours (scoring changes + PDF section design + layout) |

---

### P3-2 · Fix assessment completion date
| | |
|---|---|
| **File** | `src/components/dashboard/ResultsDashboard.tsx` + `src/store/assessmentStore.ts` |
| **What** | Completion date always shows `new Date().toLocaleDateString()` — the current date, not when the assessment was completed |
| **How** | Store a `completedAt` timestamp in the store when `calculateResults()` is called. Pass it through to the dashboard display and the PDF generator |
| **Why** | Users comparing assessments over time need accurate dates. Every past assessment currently shows today's date, making the history feature misleading |
| **LOE** | S — 1 hour |

---

### P3-3 · Add loading state to PDF export button
| | |
|---|---|
| **File** | `src/components/dashboard/ResultsDashboard.tsx` |
| **What** | PDF export button has no loading or disabled state during generation |
| **How** | Add `isExporting` state. Disable the button and show "Generating..." during PDF creation |
| **Why** | PDF generation takes 2–5 seconds. Without feedback, users click multiple times and generate duplicate files. Standard UX expectation |
| **LOE** | XS — 30 min |

---

## Tier 4 — Domain & Content Quality
> Credibility with expert users and enterprise buyers.

### P4-1 · Add EU AI Act risk classification questions
| | |
|---|---|
| **Files** | `src/data/questions/` (all 4 profile banks) + `src/utils/scoring.ts` + PDF generator |
| **What** | No questions address EU AI Act Annex III high-risk system classification, conformity assessment requirements, or the human oversight obligation |
| **How** | Add 2–3 questions to the AI-Specific Risks dimension across all four profile banks covering: (a) high-risk system classification awareness, (b) conformity assessment requirement, (c) documented human review/override/escalation procedures. Gate display on EU operating region |
| **Why** | EU AI Act enforcement begins August 2, 2026 — 5 months away. Penalties up to €35M or 7% of worldwide turnover. Any EU-operating user assessed without this dimension has an incomplete and potentially misleading governance picture. Also resolves the human oversight gap flagged in memory since Session 20 |
| **LOE** | L — 4–6 hours (question writing × 4 banks + scoring weight adjustment + jurisdiction gating + PDF context) |

---

### P4-2 · Resolve unverifiable $67.4B statistic
| | |
|---|---|
| **Files** | WelcomePage.tsx + any PDF/marketing copy using this figure |
| **What** | "$67.4B losses from AI hallucinations in 2024" appears in product copy. Source is unverifiable |
| **How** | Option A: Find and cite the actual source. Option B: Replace with a verifiable industry statistic. Option C: Soften to "estimated" with a generic citation (e.g., "industry analysts project...") |
| **Why** | An AI governance tool citing an unverifiable hallucination statistic is ironic and reputationally damaging. Enterprise buyers and press will ask for the source |
| **LOE** | XS — 30 min (research + text update) |

---

### P4-3 · Fix deep link `decodeURIComponent` crash
| | |
|---|---|
| **File** | Deep link handler (Tauri event listener) |
| **What** | `decodeURIComponent()` called without try/catch. A malformed `aigov://` deep link throws an uncaught exception |
| **How** | Wrap in try/catch. On error, log and silently ignore the deep link |
| **Why** | A malformed deep link — from a user typo or a bad actor — crashes the handler. Defensive coding requirement |
| **LOE** | XS — 15 min |

---

## Session LOE Summary

| Tier | Items | Estimated Total |
|------|-------|-----------------|
| T1 · Security & Data | 5 items | 5–7 hours |
| T2 · Scoring Accuracy | 5 items | 7–9 hours |
| T3 · PDF Output | 3 items | 6–8 hours |
| T4 · Domain Quality | 3 items | 5–7 hours |
| **Total** | **16 items** | **~23–31 hours** |

**Recommended session flow**: Start with XS/S items in T1 (P1-1, P1-3, P1-5 → P1-2 → P1-4). Each session should target 1–2 items max to stay within context limits.

---

## Deferred — Pre-Go-Live Gate

| Item | Reason Deferred |
|------|----------------|
| LB-1: Remove Testing Mode toggle | Intentional pre-wiring; remove before commercial launch |
| LB-2: Wire Keygen license service | Intentional pre-wiring; activate before commercial launch |
| LB-3: Code signing (macOS + Windows) | Pre-launch distribution requirement |
| LB-4: Payment processor integration | Pre-launch revenue requirement |
| Accessibility (ARIA roles, screen reader) | Defer to go-live polish; required before enterprise/public sector sales |
| Draft hydration schema version check | Low beta risk; add before launch |
| CSP `connect-src` R2 domain | Medium risk; pre-launch hardening |
| Source map exposure in production builds | Pre-launch security hardening |

---

*Last updated: 2026-03-04 | Review source: `docs/code-review.md`*
