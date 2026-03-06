# Architectural Decisions Log

Append new decisions here as they're made. Format: date, decision, alternatives considered, rationale.

---

## 2026-02-16 — Framework: Tauri v2 + React

**Decision:** Desktop app built with Tauri v2 (Rust backend) + React 19 + TypeScript frontend.

**Alternatives considered:**
- Electron — heavier, larger bundle, slower startup
- Flutter — less mature for desktop business apps, smaller React ecosystem overlap
- Web-only SaaS — requires auth/hosting infrastructure, harder to monetize with one-time purchase

**Rationale:** Tauri gives native performance + small bundle, offline-first capability, native file system access for export, and code signing support for Windows/macOS distribution. React ecosystem is well-suited for wizard-style forms and data visualization.

---

## 2026-02-16 — State Management: Zustand

**Decision:** Zustand for wizard state and assessment results.

**Alternatives considered:**
- Redux Toolkit — more boilerplate than needed for this scope
- React Context — sufficient but no devtools, harder to debug

**Rationale:** Lightweight, minimal boilerplate, good TypeScript support, handles wizard step navigation + response collection cleanly.

---

## 2026-02-16 — Scoring: Client-Side Only (No Backend AI)

**Decision:** All scoring and recommendations computed client-side (weighted averages, rules-based), no LLM calls.

**Alternatives considered:**
- Claude API for personalized recommendations — adds per-use cost, requires connectivity, complicates offline model
- Server-side scoring — contradicts offline-first goal

**Rationale:** Offline-first is a core differentiator. Rules-based scoring is deterministic, auditable, and zero marginal cost per assessment. Playbooks and recommendations are pre-authored in `docs/PRO-MITIGATIONS-MAP.md`.

---

## 2026-02-16 — Licensing: Keygen.sh

**Decision:** License validation via Keygen.sh with offline grace period.

**Alternatives considered:**
- Self-hosted license server — too much infrastructure to maintain
- Paddle/LemonSqueezy license keys — less control over entitlements
- Honor system — not viable for commercial product

**Rationale:** Keygen.sh supports feature entitlements (free vs. pro tiers), offline validation, and has a Tauri plugin. Rust-side validation prevents frontend-only bypass.

**Status:** Not yet implemented.

---

## 2026-02-16 — Distribution: GitHub Releases + CrabNebula CDN

**Decision:** Binaries on GitHub Releases; CDN via CrabNebula Cloud for faster global downloads.

**Rationale:** GitHub Releases integrates with Tauri's built-in updater. CrabNebula provides CDN layer without managing S3/CloudFront.

**Status:** Not yet configured.

---

## 2026-02-18 — Question System: Option B (Maturity-Adaptive Question Banks)

**Decision:** Replace single flat question bank with 4 separate question banks, one per AI maturity level (Experimenter, Builder, Innovator, Achiever). Each bank has 10 questions per dimension × 6 dimensions = 60 questions per bank = 240 questions total.

**Alternatives considered:**
- Option A: Single bank with maturity-specific wording — simpler but less flexibility, questions still assume wrong context
- Option D: Single bank with dynamic score thresholds — doesn't fix relevance problem (Experimenters see advanced questions)

**Key design decisions (all confirmed by user):**
1. Scores are relative to maturity level — add disclaimer to results page
2. Dashboard progress tracking: users mark completed items → score naturally improves over time
3. Scoring engine is dynamic (thresholds calibrated to maturity level, not static)
4. Multi-jurisdiction: show union of all regulatory questions for orgs in multiple regions
5. Achiever-tier autonomous governance features = separate Pro feature

**Implementation:**
- New file: `src/data/questionBanks.ts` — all 240 questions keyed by maturity level
- Updated: `src/types/assessment.ts` — `AssessmentQuestion` gets optional `jurisdictions` field
- Updated: `src/data/questions.ts` — exports `getQuestionsForProfile(maturityLevel, regions)`
- Deferred: dynamic scoring thresholds in `src/utils/scoring.ts`

**Status:** Implementation in progress (2026-02-18).

**Question content design rules (confirmed 2026-02-18):**
- All 4 banks use the same 6 dimensions with the same weights (Shadow AI 25%, Vendor Risk 25%, Data Governance 20%, Security/Compliance 15%, AI-Specific Risks 10%, ROI Tracking 5%)
- Questions scale in relevance AND sophistication by maturity level — Experimenter = foundational/basic, Builder = structured/process, Innovator = optimizing/scaling, Achiever = advanced/nuanced governance
- knowledge-base.md content (AI governance research) will be used later for executive summary copy in results display — NOT needed for question rewriting
- Work plan: One bank per fresh session to avoid context overflow (Experimenter → Builder → Innovator → Achiever)
- Jurisdiction-specific questions start at Builder level (not Experimenter). Reason: results output explains risks and mitigations with jurisdiction context — users need to know which regulations apply to them and how to comply. Experimenter = pre-compliance-aware, no jurisdiction questions. Builder+ = include jurisdiction-tagged questions where regulatory obligations become relevant (EU AI Act, GDPR, CCPA, etc.)

---

## 2026-02-16 — Freemium Gating

**Decision:** Gate on export quality and depth of results, not on the assessment itself.

**Free tier:** Full 60-question assessment, overall score, top 3 blind spots, generic recommendations, 1-page PDF
**Pro tier:** Full dimension breakdown, all blind spots, customized playbooks, full vendor questionnaire, 5-dimension ROI dashboard, full PDF/DOCX, assessment history

**Rationale:** Let users get full value from the assessment (reduces friction, increases conversion). Monetize on the actionable outputs they need to share with leadership/auditors.

---

## Future Ideas (Not Scheduled)

### Regulatory Intelligence Agent — Architecture Notes (2026-03-05)

**Status:** Not scheduled — do NOT build before first revenue. Architecture evaluated and logged for post-launch revisit.

**Problem:** Regulatory landscape (EU AI Act, GDPR, CCPA, ISO 42001, etc.) evolves continuously. Users need current information to stay compliant.

**Data Acquisition Options (Evaluated):**
1. **Direct crawl** — fragile (layout changes), legal gray area (terms-of-service violation risk), rate-limit risk — NOT recommended
2. **Curated human review** — reliable but doesn't scale, requires ongoing user labor
3. **LLM-assisted hybrid (RECOMMENDED)** — subscribe to RSS/email from governing bodies (e.g., EU portal, NIST updates) → run summaries through Claude → push structured JSON to R2 CDN + update manifest.json

**Content Delivery:** LLM output slots into existing R2 CDN infrastructure + `manifest.json` pattern (low friction). Remote content fetch on app launch already wired for industry-specific questions; same pattern handles regulatory updates.

**UX for Users with Completed Assessments (Unsolved):**
- **Option A:** "Re-assess affected dimensions" prompt when user opens an old assessment
- **Option B:** Notification badge on assessment history entry showing "new regulations apply"
- **Option C:** Separate "What's New in AI Governance" feed in app sidebar

**Monetization:** Live regulatory updates as Pro-tier-only feature; Free tier gets static content from the assessment timestamp.

**Recommended Cadence:**
- Monthly for regulatory changes (threshold updates, new guidance)
- Weekly for enforcement announcements (penalties, case studies)

**Decision:** Do NOT build before first revenue. Architecture is logged; revisit post-launch with first-year learnings.

---

## 2026-03-05 — Phase 5 Wizard UI Design (ProfileStep + DimensionStep)

**Decision:** Visual/UX redesign of ProfileStep.tsx and DimensionStep.tsx. Zero logic, scoring, or store changes.

### ProfileStep
- Two labeled sections: "About Your Organization" (fields 1–5) and "Your AI Program" (fields 6–10)
- Section header style: `text-xs font-semibold uppercase tracking-widest text-light-muted border-b border-navy-100 pb-2 mb-6`. First section `mt-0`, second `mt-10`
- Required badge chip (not asterisk) on Org Name, Industry, Organization Size only. Style: `ml-2 text-xs font-medium text-accent-blue bg-blue-50 rounded px-1.5 py-0.5`
- Section 2 note directly under header: "Optional — these fields improve your personalized recommendations."

### DimensionStep
- **Icon header:** Lucide icon (w-7 h-7 text-accent-blue) left of dimension label. Map: shadowAI=EyeOff, vendorRisk=Link2, dataGovernance=Database, securityCompliance=ShieldCheck, aiSpecificRisks=Zap, roiTracking=TrendingUp
- **Progress track:** 10 numbered dots. Answered=bg-accent-green/white text, current(first unanswered)=bg-accent-blue/white text, unanswered=bg-white/border-navy-200/muted text. Clicking dot scrolls to `id="question-{i}"`. Secondary text below: `{n} of {m} answered · answer at least {x} to continue`
- **Answer options:** Full pill buttons (full-width). Selected: `bg-accent-blue/10 border-accent-blue text-accent-blue font-medium`. Indicator dot inside (filled circle selected, bordered circle unselected) via `flex items-start gap-3`
- **canContinue threshold:** 50% (`Math.ceil(questions.length / 2)`) — intentional, do not change
- **WelcomeStep:** Off-limits, deferred to future session

**Status:** Implemented session 32 (2026-03-05). tsc clean. Not yet committed.

---

## Executive Summary — AI-Generated (Session 35, 2026-03-05)

**Decision:** Build AI-generated personalized executive summary as a Pro feature with free teaser.

**API key model:** BYOK (user enters their own Anthropic API key in Settings). Key stored in tauri-plugin-store. Direct device→Anthropic call — no proxy for launch. Proxy (Cloudflare Worker) added later for enterprise tier.

**Personalization:** Summary uses org profile + per-dimension scores + actual question responses + jurisdiction context + governance framework knowledge (user-supplied research). Generic responses are not acceptable.

**Placement:** Results dashboard (new section) + PDF export (new page) + DOCX export.

**Freemium gate:** Free = first 2-3 sentences visible, rest blurred/truncated, upgrade CTA. Pro = full summary.

**Consent:** One-time modal before first generation — discloses Anthropic API call. Stored in settings.json so not repeated.

**Privacy Policy:** Add paragraph disclosing Anthropic API call as the single exception to offline-first data policy.

**Cost to operator:** $0 at launch (user pays Anthropic directly via their own key).
