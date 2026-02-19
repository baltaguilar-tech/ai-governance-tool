
# Audit Report — 2026-02-19

## PART 1: CODE AUDIT

### Critical Issues (bugs/errors that will cause runtime failures)

1. **assessmentStore.ts:146** — HARDCODED QUESTION COUNT FOR PROGRESSION GATE
   - `const dimensionQuestionCount = 10;` is hardcoded. The actual question banks contain 60 questions per profile (10 per dimension × 6 dimensions).
   - The check `dimensionResponses.length >= Math.ceil(dimensionQuestionCount / 2)` requires only 5 answers per dimension. This is correct for 10 questions per dimension. BUT: the prefix matching for `canProceed()` is fragile (see Architecture Concerns).
   - If the number of questions per dimension ever changes, this hardcoded value will silently fail.
   - **Risk**: Users can proceed without answering enough questions. Scoring receives incomplete data.

2. **recommendations.ts** — LICENSE TIER CHECK UNUSED
   - `_licenseTier` parameter is accepted but never used (prefixed with _ to suppress TypeScript warnings).
   - Paid recommendations are always included in output regardless of license tier.
   - Store hardcodes `licenseTier: 'professional'` (assessmentStore.ts:55).
   - **Impact**: Free-tier users would see all paid recommendations. Freemium model is not enforced.
   - **Risk**: High — this is a core business model requirement.

---

### Warnings (logic issues, stale code, potential bugs)

1. **scoring.ts:78** — INVERTED SCORING LOGIC IS UNDOCUMENTED
   - `averageRaw = totalScore / answeredCount` then `governanceScore = 100 - averageRaw`
   - Question option values: 0 = best governance, 100 = worst governance. Score is then inverted for display.
   - This is correct but counterintuitive. No top-level comment explains the inversion pattern.
   - **Risk**: High chance of future bugs if this code is modified without understanding the inversion.
   - **Fix**: Add a clear comment block explaining the scoring direction convention.

2. **scoring.ts:200-251** — INCOMPLETE IMMEDIATE ACTION MAP
   - `getImmediateAction()` maps ~30 specific question IDs to tailored action text.
   - The new multi-bank system has 240 questions (IDs like shadow-e-1, shadow-b-1, etc.).
   - **The action map only covers old-style IDs** (e.g., 'shadow-1', 'vendor-2') — none of the new bank IDs will match.
   - All 240 questions fall through to the generic default action.
   - **Risk**: All immediate actions in the report are generic. Kills a key value proposition.

3. **assessmentStore.ts** — PROFILE CHANGE BETWEEN STEPS NOT HANDLED
   - Questions are loaded in DimensionStep based on current profile (line 13-17).
   - Results are calculated in `calculateResults()` which also loads questions from profile (line 107-110).
   - If a user navigates back and changes `aiMaturityLevel` or `operatingRegions` mid-assessment, questions change but existing responses do not reset.
   - **Risk**: Responses to Experimenter questions get scored against Innovator questions.
   - **Fix**: Clear responses when profile changes.

4. **pdfExport.ts:309, 426** — UNSAFE `(doc as any).lastAutoTable`
   - Uses `(doc as any).lastAutoTable.finalY` to get table end position.
   - Bypasses TypeScript type system. If autoTable changes this API, it will fail silently at runtime.
   - **Risk**: Low in practice (stable API), but fragile.

5. **scoring.ts:32** — getRiskColor SWITCH WITHOUT DEFAULT
   - Switch statement handles all RiskLevel enum values, so TypeScript is happy.
   - But if a new RiskLevel is added to the enum and not to the switch, it returns undefined at runtime.
   - **Fix**: Add explicit `default: return '#gray'` as a safety net.

---

### Architecture Concerns

1. **canProceed() PREFIX MATCHING IS FRAGILE** (assessmentStore.ts:142-151)
   - Logic uses string prefix matching to count answered questions per dimension:
     ```typescript
     const prefix = currentStep === 'aiSpecificRisks' ? 'airisk' : ...
     ```
   - New question IDs use 'airisks-' (with an 's'). `startsWith('airisk')` still matches 'airisks-e-1' because 'airisk' is a prefix of 'airisks'. This works today but is fragile.
   - **Better approach**: Filter responses by question.dimension directly (requires passing questions array into canProceed, which requires profile to be complete by dimension step — it is).

2. **DUPLICATE DIMENSION LIST** (scoring.ts:263-270 vs dimensions.ts)
   - `calculateAllScores()` hardcodes: `['shadowAI', 'vendorRisk', 'dataGovernance', 'securityCompliance', 'aiSpecificRisks', 'roiTracking']`
   - Same list exists in `src/data/dimensions.ts` as `DIMENSIONS`.
   - Adding or renaming a dimension requires changes in 2+ places.
   - **Risk**: Desync if one is updated but not the other.

3. **QUESTION WEIGHT FIELD EXISTS BUT IS UNUSED**
   - Innovator and Achiever questions include `weight` on each question object (e.g., `weight: 0.8`).
   - The scoring algorithm ignores this field entirely — all questions within a dimension are averaged equally.
   - Experimenter and Builder questions also have `weight` at the question level, but it's not used.
   - Dimension-level weights (Shadow AI 25%, Vendor Risk 25%, etc.) ARE used.
   - **Either implement per-question weighting or remove the field from all question objects.**

4. **riskLevel OPTION FIELD EXISTS BUT IS UNUSED**
   - Innovator and Achiever options include `riskLevel: 'low' | 'medium' | 'high' | 'critical'`.
   - This field is never read by scoring.ts, recommendations.ts, or any component.
   - **Either use it or remove it.**

5. **DEFERRED QUESTION LOADING CAUSES DOUBLE FETCH**
   - `getQuestionsForProfile()` is called in DimensionStep.tsx (render time) AND in assessmentStore.calculateResults() (scoring time).
   - Each call re-filters all 240 questions. Minor performance issue, but inconsistent with single-source-of-truth principle.
   - **Better approach**: Load questions once when the profile step is completed and store in Zustand state.

6. **RECOMMENDATION ENGINE MISSING REGIONS** (recommendations.ts)
   - `getRegulatorRecommendations()` handles Europe, NorthAmerica, AsiaPacific.
   - MiddleEast and LatinAmerica have no region-specific recommendations.
   - These two regions are valid Region enum values and selectable by the user.
   - **Risk**: Users in those regions get no compliance-specific recommendations.

---

### Bloat / Dead Code

1. **pdfExport.ts — generateFreePDF IS A SKELETON**
   - `generateFreePDF()` exists and is exported but the Free PDF is listed as "Not Yet Built" in CLAUDE.md.
   - If the function body is incomplete, it's dead code. Verify whether this function produces valid output.

2. **src/utils/ — CHECK FOR UNUSED EXPORTS**
   - `getImmediateAction()` is exported from scoring.ts but only used in pdfExport.ts and blindspot generation.
   - With the new question ID format, this function returns the default for all 240 questions — it's effectively dead for its intended purpose.

3. **html2canvas IN package.json**
   - `html2canvas` is listed as a dependency.
   - It is not used in pdfExport.ts or anywhere in the codebase.
   - **Remove from package.json.**

---

### Tauri / Security

1. **fs:allow-write OVERLY BROAD** (capabilities/default.json)
   - Write access granted to `$HOME/**`, `$DOWNLOAD/**`, `$DESKTOP/**`, `$DOCUMENT/**`, `$APPDATA/**`.
   - For PDF export, `$DOWNLOAD/**` is sufficient. `$HOME/**` is excessively broad.
   - **Recommendation**: Restrict to `$DOWNLOAD/**` and `$DOCUMENT/**` only.

2. **http:default PERMISSION SCOPE**
   - `http:default` allows any HTTP/HTTPS destination.
   - CSP restricts to `connect-src 'self' https://api.github.com`, which is tighter.
   - Tauri permissions and CSP are mismatched — CSP is the effective barrier.
   - **Recommendation**: Document why `http:default` is needed or scope it to the update endpoint only.

3. **process:allow-restart PERMISSION**
   - Allows process restart via Tauri IPC.
   - If not actively used in the codebase, remove this permission to reduce attack surface.

---

## PART 2: QUESTION AUDIT

### Summary Statistics
- Total questions audited: 240 (60 per maturity level × 4 levels)
- Questions flagged for critical rewrite: 14
- Questions flagged for improvement: 38
- Breakdown by bank:
  - Experimenter: 8 flags (7 warnings + 1 critical)
  - Builder: 11 flags (9 warnings + 2 critical)
  - Innovator: 18 flags (14 warnings + 4 critical)
  - Achiever: 15 flags (8 warnings + 7 critical)

---

### Critical Flags (questions that need rewriting)

**Experimenter**

1. **security-e-7** — Option value logic is inverted
   - "None that we know of" scores 50, worse than expected. "We've had incidents and haven't tracked them" scores 100 (worst), which is correct, but the "none" option is scored as medium risk when it should be low risk.
   - **Fix**: Reorder and recalibrate option values. "No incidents with active monitoring" = 0. "No incidents but no monitoring" = 25. "Incidents handled" = 50. "Incidents, no response" = 75. "Unknown" = 100.

**Builder**

1. **shadow-b-6** — Question title and options conflate budget approval with tool governance approval
   - Title asks about "spending controls," but not all shadow AI involves spending (free tools).
   - **Fix**: Separate into two questions or reframe to focus on the approval process (not cost).

2. **vendor-b-10** — EU-only question appears in Builder bank for all regions
   - Marked `jurisdictions: ['eu']` but this filtering only happens via `getQuestionsForProfile()`. Verify the index.ts selector correctly excludes this for non-EU orgs.
   - **Note**: If the selector works correctly, this is not critical. Verify the REGION_TO_JURISDICTION mapping handles this.

**Innovator**

1. **shadow-i-7** — Best option requires "actively promoted quarterly" which overstates the expected behavior
   - Continuous promotion of reporting channels implies transparency culture, not just governance infrastructure.
   - **Fix**: Reframe best option as "Multiple channels available; non-punitive policy documented and acknowledged."

2. **data-i-2** — GDPR-specific question marked for EU/UK only but CCPA orgs have equivalent obligations
   - The question asks about consent records specifically in GDPR terms.
   - **Fix**: Add a parallel question for US orgs covering CCPA/CPRA data subject request tracking.

3. **vendor-i-6** — Conflates incident notification capability (process) with compliance obligation (timeline)
   - **Fix**: Split into two questions: (1) Do contracts include notification clauses? (2) Have you defined notification SLAs?

4. **security-i-8** — References "EU AI Act conformity assessments" and "ISO 42001 surveillance audits" without jurisdiction gating
   - Not marked as EU-only. Non-EU Innovator orgs see irrelevant best-case options.
   - **Fix**: Mark as `jurisdictions: ['eu']` or generalize language to "all regulatory deadlines relevant to our jurisdictions."

**Achiever**

1. **shadow-a-5** — Conflates "attestation" and "audit" — these are different concepts
   - **Fix**: Clarify which is intended. Add internal audit as a reasonable middle-ground option.

2. **vendor-a-5** — References EU AI Act Article 14 for US-marked respondents
   - Marked `jurisdictions: ['eu', 'uk', 'us']` but the question is EU-regulatory-specific.
   - **Fix**: Mark as EU/UK only, or create US-specific equivalent around state notification requirements.

3. **vendor-a-8** — Assumes contractual AI liability frameworks exist (they don't yet)
   - Best option assumes "AI-specific liability, indemnification, and financial remedy clauses" are standard.
   - **Fix**: Add an option: "Monitoring regulatory developments to define liability terms as frameworks mature."

4. **security-i-5** — Maps to "EU AI Act articles and ISO 42001 clauses" as best option
   - Already marked `jurisdictions: ['eu']`. This is correct but should note that non-EU Achiever orgs should map to NIST AI RMF or equivalent.
   - **Note**: This is a helpText improvement, not a rewrite.

5. **vendor-a-1** — References EBA outsourcing guidelines and DORA Article 28 (banking-specific EU regs)
   - Marked `jurisdictions: ['eu', 'uk']` correctly, but framing is too banking-focused for non-financial Achiever orgs.
   - **Fix**: Generalize framing or add separate banking/non-banking variants.

6. **vendor-a-6** — DORA/EU-specific correctly gated (eu, uk) — verify selector excludes for US
   - Same structural issue as vendor-b-10 above.

7. **airisk-a-1** — Assumes org has already classified AI systems into risk tiers before answering
   - Best option is "risk-tiered cadence" but risk tier classification is itself an Achiever-level capability.
   - **Fix**: Add an intermediate option: "Bias auditing conducted; risk tiers not yet formalized."

---

### Warnings (questions that could be improved)

**Experimenter (7)**

1. **shadow-e-1** — "Rough sense" vs. "partial picture" distinction unclear to respondents
2. **shadow-e-9** — "Actively reviewing" as best option is too demanding for Experimenter stage
3. **shadow-e-10** — Jump from 30 (some teams) to 0 (all employees) is too large; missing intermediate step
4. **vendor-e-3** — Options don't reflect nuanced vendor data usage (tiered/product-specific usage)
5. **data-e-4** — Cites "77% of employees paste company data" statistic — source not attributed
6. **security-e-4** — Conflates requirement definition with enforcement; Experimenter should reward defining the rule
7. **roi-e-6** — "Actively tracking error rates" as best option is Builder/Innovator level, not Experimenter

**Builder (9)**

1. **shadow-b-2** — "Inconsistently followed" is vague; provide a percentage range or example
2. **shadow-b-5** — "Centralized monitoring via identity provider" assumes SSO infrastructure many mid-market orgs lack
3. **vendor-b-7** — Best option conflates completing an assessment with having mitigations; separate these
4. **data-b-6** — GDPR data subject requests and CCPA opt-out are structurally different; don't conflate
5. **data-b-8** — Missing intermediate option between "verbally discouraged" and "formally restricted"
6. **security-b-5** — "Missed" vs. "not included" used interchangeably; clarify
7. **airisk-b-4** — "Hallucinations" is a subset of "errors" — reword to "errors including hallucinations"
8. **roi-b-2** — "Periodic surveys" is borderline for "systematic tracking"; clarify what counts as systematic
9. **roi-b-5** — Missing option: "Data available but calculation not done" between tracking and no tracking

**Innovator (14)**

1. **shadow-i-1** — "Real-time alerts" as best option is more Achiever-level than Innovator
2. **shadow-i-3** — "Network-level blocks" assumes infrastructure not available to all mid-market Innovator orgs
3. **data-i-1** — "AI-specific classification categories" as best option are not yet standard practice
4. **data-i-6** — "Automated data lineage tracking" is Achiever-level, not Innovator
5. **security-i-4** — "Continuous evidence collection with automated artifacts" is Achiever-level
6. **security-i-6** — "Tamper-evident storage" as requirement is premature for Innovator
7. **security-i-7** — "Just-in-time access with session recording" is Achiever-level (PAM systems)
8. **airisk-i-1** — Assumes risk tier classification exists before orgs can answer honestly
9. **airisk-i-2** — "Automated drift detection with threshold alerts" requires MLOps infrastructure
10. **airisk-i-3** — "SHAP, LIME, attention mechanisms" is ML engineer language, not governance language
11. **vendor-i-2** — "Liability for AI-caused harm" as standard contract clause is aspirational
12. **vendor-i-9** — "Automated monitoring with escalation thresholds" is Achiever-level
13. **roi-i-7** — Regular structured AI ROI reporting assumes enough AI investments to justify separate reporting
14. **roi-i-10** — Build vs. buy cost-benefit analysis is more relevant at Achiever level

**Achiever (8)**

1. **shadow-a-1** — CMDB/ITSM integration assumes specific enterprise tooling not universal to Achiever orgs
2. **shadow-a-2** — Assumes quarterly board meetings include AI governance metrics specifically
3. **vendor-a-1** — EBA/DORA references are banking-specific; non-financial Achiever orgs find these irrelevant (marked eu/uk correctly)
4. **vendor-a-6** — DORA-specific (marked eu/uk correctly; verify selector)
5. **data-a-2** — Same jurisdictional gap as data-i-2 (EU/UK only, no CCPA equivalent)
6. **security-a-8** — "Dedicated AI compliance calendar" assumes centralized compliance function
7. **airisk-a-1** — Same issue as Innovator airisk-i-1: assumes risk tiers exist before asking about cadence
8. **security-a-3** — "Semi-annual gap assessments" may be excessive; annual is standard for most Achiever orgs

---

### Audience Fit Issues

**Experimenter**
- Generally well-written for non-technical respondents (IT leads, operations managers, founders).
- Minor issue: "data classification," "DPA," and "compliance framework" appear without definition in vendor/data/security sections. Add brief parenthetical definitions in helpText.
- The jump in complexity from Shadow AI to Data Governance questions is noticeable but acceptable.

**Builder**
- Appropriate for IT leads and operations managers.
- Several questions assume respondents understand "role-based access control," "data minimization," and "subprocessor." Add brief definitions in helpText for these terms.
- Phrases like "documented approval process" and "formal review" may be interpreted differently by different respondents. Define what "formal" means (e.g., "written and accessible to employees").

**Innovator**
- This bank assumes respondents are governance professionals or CISOs. Mid-market Innovator orgs may not have these roles.
- Technical jargon: "threat modeling," "bias auditing," "feature store," "model drift," "adversarial inputs," "explainability techniques (SHAP, LIME)." These are ML engineer concepts, not governance concepts.
- **Concern**: Some questions may be unanswerable by governance teams without input from technical/engineering teams. Consider flagging certain questions as "Discuss with your technical team" in helpText.

**Achiever**
- This bank assumes a board-level AI governance owner or Chief AI Officer.
- Regulatory references (EU AI Act, DORA, EBA, NIST AI RMF) assume legal/regulatory literacy. Add helpText context for these references.
- Concepts like "fourth-party risk," "concentration risk," and "vendor concentration quantification" are financial risk management terminology. Non-financial sector Achiever orgs may not have these frameworks.
- **Consideration**: The Achiever assessment may be better administered as a facilitated review with multiple stakeholders (legal, IT, operations, board) rather than a solo self-assessment.

---

### Maturity Calibration Issues

1. **Experimenter questions are sometimes too demanding**
   - Example: shadow-e-3 best option is "written approved list, accessible to all employees." For Experimenter stage, even an informal list is a significant step. The scale penalizes genuinely early-stage orgs.
   - **Pattern**: Several Experimenter best options describe Builder-level maturity. This makes Experimenter orgs appear to have low scores even when they've made real progress.

2. **Innovator and Achiever have overlapping scope in some dimensions**
   - airisk dimension: Innovator questions about "systematic bias auditing" and Achiever questions about the same topic have subtle differences (cadence vs. independence). High-scoring Innovator orgs may not see significant score improvement at Achiever level.
   - **Risk**: Creates a plateau effect where Innovator orgs can't distinguish themselves from early Achiever orgs.

3. **Builder questions assume too much formality for mid-market context**
   - Several Builder best options describe Fortune 500-level processes (e.g., "centralized monitoring via identity provider," "formal AI procurement gateway").
   - Mid-market orgs at Builder level are typically just establishing these processes, not operating them at scale.

4. **Jurisdictional Coverage Imbalance**
   - EU: Extensive coverage (EU AI Act, GDPR, DORA, ISO 42001) — especially in Innovator/Achiever banks.
   - US: Light coverage (NIST AI RMF mentioned occasionally, CCPA/CPRA only in some questions).
   - MiddleEast, LatinAmerica: No region-specific questions in any bank.
   - AsiaPacific: Very limited (PDPA mentioned once).
   - **Impact**: The tool is EU-centric. Non-EU orgs may feel the assessment doesn't address their specific compliance landscape.

---

### Answer Option Issues

1. **OPTION SCALING INCONSISTENCY**
   - Most questions use [100, 75/65, 50/35, 25, 0] but spacing varies.
   - Achiever questions often reverse order: [0, 25, 50, 75, 100] (best to worst).
   - **Fix**: Standardize to consistent spacing and consistent order (worst to best OR best to worst, pick one).

2. **ACHIEVER OPTIONS PRESENTED IN REVERSE ORDER vs. OTHER BANKS**
   - Experimenter/Builder/Innovator: worst option first (100), best option last (0).
   - Achiever: best option first (0), worst option last (100).
   - A user who completes an Achiever assessment after other banks will find the order reversed.
   - **Fix**: Standardize to one convention across all banks.

3. **QUESTION WEIGHT FIELD UNUSED**
   - question.weight exists in all banks but scoring.ts ignores it.
   - **Decision needed**: Implement per-question weighting (adds complexity) or remove the field.

4. **riskLevel OPTION FIELD UNUSED**
   - option.riskLevel exists in Innovator/Achiever banks but is never read.
   - **Decision needed**: Use it for immediate action mapping or remove it.

5. **"NO IDEA" PHRASING IS DISMISSIVE**
   - Several Experimenter worst options use "No idea — we haven't looked into it."
   - This phrasing may feel judgmental to respondents who are honestly at early stages.
   - **Fix**: Replace with "Not assessed" or "We haven't looked into this yet."

6. **OPTION REDUNDANCY IN SOME QUESTIONS**
   - Example: Builder data-b-1 has two options that both describe "having guidance but it's incomplete or informal." One is classified at value 60, another at 30, but the distinction is subtle.
   - **Fix**: Consolidate or clarify the behavioral distinction.

---

### Cross-bank Consistency Issues

1. **QUESTION ID FORMAT INCONSISTENCY**
   - Builder uses `sec-b-1` (abbreviated) while all other banks use `security-e-1`, `security-i-1`, `security-a-1` (full word).
   - The `canProceed()` function prefix check uses `'security'` — this means `sec-b-1` will NOT match and Builder security responses won't be counted toward the security dimension gate.
   - **This is a bug.** Fix: Rename all `sec-b-*` IDs to `security-b-*`.

2. **DIMENSION COVERAGE IS BALANCED**
   - All 4 banks: 10 questions × 6 dimensions = 60 ✓
   - No over- or under-representation. Good.

3. **TONE GRADIENT IS APPROPRIATE**
   - Experimenter: Approachable and empowering.
   - Builder: Neutral, process-focused.
   - Innovator: Technical, governance-heavy.
   - Achiever: Regulatory, board-level.
   - This gradient is intentional and well-executed.

4. **HELPTEXT QUALITY IS STRONG**
   - Helptext provides consistent context across all banks.
   - Experimenter helptext is concise (1-2 sentences). Achiever helptext is detailed (3-4 sentences).
   - This is appropriate and well-calibrated.

---

### What Works Well

1. **Clear maturity progression** — awareness → process → systematization → enterprise integration is logical and coherent.
2. **Helptext provides context** — every question explains "why this matters." Users can answer honestly with context.
3. **Balanced dimensionality** — all 6 dimensions represented equally across all 4 banks.
4. **EU regulatory coverage** — EU AI Act, GDPR, DORA, ISO 42001 references are accurate and timely.
5. **Accessible language for Experimenter/Builder** — real-world examples (ChatGPT, Slack, Zoom), no unexplained jargon.
6. **Jurisdictional filtering architecture** — REGION_TO_JURISDICTION map in index.ts is well-designed.
7. **Achiever riskLevel annotations** — even though unused, indicate thoughtful option design.
8. **Question framing is empowering** — "how does your org..." rather than "does your org fail to..."

---

## PRIORITIZED ACTION LIST

### Do First (blocking issues)
1. Fix `sec-b-*` question IDs → `security-b-*` (bug: canProceed doesn't count Builder security responses)
2. Implement license tier gating in recommendations.ts (freemium model not enforced)
3. Clear responses when profile changes mid-assessment (stale data risk)

### Do Before Launch (quality issues)
4. Fix getImmediateAction() to support new question ID format (240 questions → all get generic action today)
5. Fix option order consistency (Achiever reversal vs. other banks)
6. Fix option scaling inconsistency (standardize value spacing)
7. Add documentation comment to scoring.ts explaining the 0=worst/100=best inversion
8. Fix vendor-b-10 jurisdictional filtering (verify selector excludes for non-EU)
9. Fix the 7 critical question rewrites (security-e-7, shadow-b-6, shadow-i-7, etc.)
10. Replace "No idea" phrasing with "Not assessed"

### Improve Over Time (enhancement opportunities)
11. Expand US-specific question coverage (NIST AI RMF, CCPA/CPRA parallel questions)
12. Add non-EU regional questions (MiddleEast, LatinAmerica, AsiaPacific)
13. Decide: implement question.weight in scoring OR remove the field
14. Decide: implement option.riskLevel in immediate actions OR remove the field
15. Tighten Tauri fs permissions (restrict from $HOME/** to $DOWNLOAD/** + $DOCUMENT/**)
16. Fix architecture: load questions once in store when profile is completed (not on every DimensionStep render)
17. Fix architecture: derive dimension list from dimensions.ts in scoring.ts (eliminate duplication)
18. Remove html2canvas from package.json if unused
