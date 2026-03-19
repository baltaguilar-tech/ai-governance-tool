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

---

## Session 43 Decisions (2026-03-11)

### Executive Summary Personalization Architecture

**Decision**: Implement industry + region personalization in `generateTemplatedSummary()` using a new `src/utils/industryContent.ts` file rather than expanding `execSummary.ts`.

**Rationale**: execSummary.ts already at 317 lines. Industry content map will add ~300–400 lines. Splitting keeps the generator logic clean and the content maintainable as more industries are added over time.

**Level 1 (Free)**: Industry colors Section 1 opening sentence and regulatory callout language. Generic dimension insights unchanged.

**Level 2 (Pro)**: Industry + worst gap combination triggers industry-specific dimension insights in Section 2. All three sections shaped by industry context.

**First pass industries** (session 44): Healthcare, Financial Services, Technology, Manufacturing, Government, Legal Services.

**Remaining industries** (session ES-2): Retail & E-Commerce, Education, Energy & Utilities, Telecommunications, Media & Entertainment, Real Estate, Nonprofit, Other — fall back to generic content until ES-2 is complete.

**Fallback rule**: If `profile.industry` not in content map, existing DIMENSION_INSIGHTS used unchanged. No regression in output quality for unimplemented industries.

### PDF Executive Summary — Redesign Deferred

**Decision**: PDF exec summary visual redesign (ES-4) deferred until ES-1 (industry personalization) is complete. Visual design should reflect the finalized content structure, not the current template.

**Redesign scope confirmed**: summary card with score gauge, maturity badge, industry/region context, stronger visual hierarchy for the three board question sections, AlphaPi branding in footer.

### Session Sequencing (sessions 44+)

Confirmed order:
1. Session 44: PNG workflow protocol discussion → decision → industry personalization start (ES-1)
2. Session 45+: Continue ES-1 if incomplete, then ES-3 (AI-generated exec summary)
3. Later: ES-4 (PDF redesign) after ES-1 content is finalized

### Workflow Protocol — Adoption Decision (2026-03-11, Session 44)

**Decision**: Adopt 5 of 6 workflow items (item 4 already in practice). User retains all decision authority; Claude is the technical resource providing options, input, and recommendations.

| Item | Adopted | Adaptation |
|------|---------|------------|
| 1. Plan Node Default | Yes | Clarifying questions = the spec; formal plan mode for architecture/new feature builds only |
| 2. Subagent Strategy | Yes | More aggressive — all exploration/research/file discovery goes to subagents |
| 3. Self-Improvement Loop | Yes | Maps to `docs/lessons-learned.md` (not `tasks/lessons.md`) |
| 4. Verification Before Done | Already in practice | No change needed |
| 5. Demand Elegance (Balanced) | Yes | As-is — "skip for simple obvious fixes" caveat preserved |
| 6. Autonomous Bug Fixing | Yes | As-is — fix build/tsc errors without asking for hand-holding |

**Task management**: maps to existing `CURRENT-SESSION.md` (no new `tasks/todo.md` file).
**Core principles** (Simplicity First / No Laziness / Minimal Impact): already in spirit, now explicit.

### GTM Plan — Created

Full go-to-market plan saved to `docs/gtm-plan.md`. Phase 6 (GTM) added to remaining-work-plan.md. No build work scheduled until business gates clear (trademark, company registration, Apple Dev, payment processor).

### Governance Synthesis — Ingested

2026-03-11 governance synthesis saved to `docs/governance-synthesis.md`. Primary knowledge base for executive summary copy, GTM narrative, and website dimension descriptions. Citation policy: synthesize into confident copy — no inline citations, no direct quotes. Source acknowledgment in internal docs only.

---

## Session 48 Decisions (2026-03-16)

### V1 Feature Completeness Declaration

**Decision: V1 feature set is COMPLETE as of session 48.**

All planned features are built and working:
- 252-question guided wizard (all 4 profiles × 6 dimensions)
- Weighted scoring engine + blind spots + recommendations
- SQLite persistence (draft + completed assessments + mitigation tracker + spend tracker + ROI model)
- PDF export (free summary + Pro full report)
- ES-3 AI-generated executive summary (Claude API via Rust/reqwest, consent modal, model selector)
- ROI Calculator (quick estimate, snapshot history)
- ROI Model Builder (3-pillar wizard, task baseline, TCO iceberg, 3-scenario results) — Pro-gated
- Settings (Account, License, Email, Notifications, Updates, My Data)
- Auto-updater wired (GitHub Releases, ed25519 signed)
- Freemium gates (Free vs Pro throughout)

**Remaining pre-launch items are NOT feature work — they are business/infrastructure blockers:**
| Item | Blocked on |
|------|-----------|
| GL-2: Keygen license activation | Keygen.sh account |
| GL-3/GL-4: Code signing + notarization | Apple Developer Organization + D-U-N-S |
| GL-5: Payment processor | Company registration |
| DI-1: CrabNebula CDN | GL-3 signing |
| DI-2: Repo → private | Company registration |
| DI-3/4: Windows | EV cert |

**Two minor code items before shipping:**
1. Pro PDF aiNarrative wiring (TrackProgress.tsx generateProPDF call sites don't pass aiNarrative)
2. DEV toggle removal (LicensePanel.tsx lines ~154–187)

---

### Regulatory Intelligence Feature — V2 (Confirmed)

**Decision: Do NOT build before first revenue. Confirmed V2.**

**Feature description:** Automated monitoring of regulatory bodies (EU AI Act enforcement updates, GDPR guidance, CCPA amendments, NIST AI RMF revisions, ISO 42001 updates, FTC AI guidelines, etc.) → LLM synthesis (Claude) → delivery via R2 CDN JSON → ES citation engine with specific regulatory references, cost/fine data, and jurisdiction-specific guidance → update surfacing UX for users who've already completed assessments.

**Why V2:**
1. V1 isn't shipped yet — no revenue to fund ongoing LLM synthesis cost
2. Requires always-on Cloudflare Worker (operational cost before customers exist)
3. Complex UX problem: how to surface regulatory updates to users who've already closed their assessment
4. Better to build with real feedback about which regulatory bodies matter most to actual customers
5. Architecture already evaluated and documented (2026-03-05 decisions.md)

**What V1 covers for regulatory:** Static jurisdiction-aware questions, EU AI Act penalty amounts ($35M / 7% turnover), GDPR/CCPA/NIST AI RMF content in question banks and recommendations. Sufficient for launch.

**V2 regulatory scope (when ready):**
- RSS/webhook monitoring: EU AI Act Official Journal, NIST, FTC, ICO, CNIL, EDPB, India DPDPA, Australia Privacy Act
- Monitoring cadence: weekly automated check, monthly human review
- Synthesis: Claude Haiku → structured JSON (regulation_name, jurisdiction, effective_date, key_requirements, penalty_structure, industry_impact)
- Delivery: R2 CDN + manifest (existing pattern from remote-content-plan.md)
- ES integration: "Regulatory Watch" section — cites specific provisions relevant to org's jurisdiction and industry
- Update surfacing: in-app notification + re-run prompt for users who completed assessment before a major update

---

### ROI Model Builder — V2 Enhancements Backlog

- Detailed revenue attribution: baseline conversion rate × post-AI rate × avg transaction value × volume
- Multiple risk pillars (not just one category — allow 3–5 risk events)
- Custom scenario multipliers (slider instead of fixed 0.6×/1.0×/1.4×)
- Payback period calculation and chart
- ROI model history snapshots (track model changes over time, not just adoption snapshots)
- TCO: merge hidden costs into spend_items as a cost type (cleaner UX)
- Monte Carlo simulation toggle (for $1M+ AI investments) — enterprise tier only
- Industry benchmarks integration: show "your Pillar 1 ROI vs. industry median" for org's sector

---

## Session 49 Decisions (2026-03-16)

### Connectivity Architecture — Path A now, Path B planned

**Decision: Build Path A (opt-in connectivity) for V1–V3. Plan for Path B (separate product) without building for it.**

**Path A definition:** Core assessment engine stays 100% offline forever. Specific features that require network access (AI Summary via BYOK, future Discovery via admin APIs) are opt-in, explicitly triggered by the user. No always-on requirement.

**Path B definition:** "AlphaPi Discover" or "AlphaPi Enterprise" as a separate connected SaaS module — different SKU, subscription pricing, different deployment model. Assessment product stays offline-first.

**Why not build B now:** Zero customers, zero revenue, zero product-market feedback. The B split point will be obvious once real users show which features drive retention vs. require connected infrastructure. Building the seam prematurely wastes investment on guesses.

**Natural B inflection point:** V3 Shadow Discovery. By then: first revenue, real customer feedback, established brand, known usage patterns. That's when "does Discovery belong in the desktop app or its own product?" becomes answerable.

**Architectural constraints to preserve B optionality (enforce going forward):**
1. All network calls stay in isolated service files (`aiSummary.ts`, future `discovery.ts`) — never inline in components
2. Assessment engine, scoring, and question banks stay pure functions with no side effects — these become the shared library both products depend on
3. Connectivity assumptions must never bleed into Zustand store — assessment state and connection state are separate concerns
4. DB schema migrations stay additive only — both products can share schema if they ever sync

---

### AI Shadow Discovery — Confirmed V3

**Decision: AI Shadow Discovery is a V3 feature. Do NOT build before V2 ships and first revenue is established.**

**Feature description:** IT-admin-initiated scan that discovers AI tools in use across the organization via SaaS admin APIs, compares discovered inventory to what the user self-reported in the Shadow AI assessment dimension, and surfaces gaps ("You reported 5 unauthorized tools — we found 23") as recalibrated scores and a new Discovery section in the Pro PDF.

**Why V3 (not V2):**
- Requires Azure AD app registration onboarding — needs website, support docs, and DPA template that don't exist yet
- No customers yet to validate which SaaS integrations matter most
- Privacy/compliance architecture (GDPR DPA, data minimization, deletion, encryption) requires dedicated design session
- No fingerprint database methodology finalized yet

**V3 scope (when ready):**
- **Discovery layer:** Microsoft 365 (Graph API — OAuth grants, user consent records, license type, last-used), Google Workspace (Admin SDK — third-party OAuth apps, user-level access), Okta (sign-in logs for AI tool authentications)
- **Fingerprint database:** 50+ known AI tools + heuristic for unknown AI domains (study methodology from existing Shadow IT vendors — Netskope, Defender for Cloud Apps, etc.)
- **Paid vs. free detection:** enterprise license = paid; OAuth scope patterns distinguish licensed vs. personal accounts
- **Usage-type breakdown:** available only for tools with admin usage APIs (Copilot, ChatGPT Enterprise); all others report frequency + user attribution only. Full usage categorization (email gen / image gen / PPT / chat) deferred to V4 browser extension
- **ROI integration:** license cost ÷ active users = true cost per licensed seat → feeds ROI Model Builder cost section automatically. Example: "Salesforce Einstein licensed to 200 users, only 34 active — $X wasted annually"
- **Gap analysis engine:** compare discovered inventory vs. Shadow AI assessment responses → recalibrated dimension score + specific gap findings narrative
- **Approval gate:** admin must explicitly confirm authorization and employee consent policy before scan executes
- **GDPR compliance:** scan data stored locally only, "Purge Discovery Data" in My Data settings, Privacy Policy update (second exception after Anthropic API), DPA template for enterprise customers
- **Rate limiting:** iterative chunked API calls (throttle-aware, resumable scan with progress indicator)

**What V2 covers for Shadow AI:** Existing 60 Shadow AI questions + scoring engine. Sufficient for launch and V2.

**No name assigned yet.** Name the agent when V3 planning begins.

---

### V2 Project Plan — Locked (2026-03-16)

*Pre-condition: V1 shipped, first customers, Tier 0 infrastructure complete.*

#### Tier 0 — Infrastructure Gates
| Item | Est. | Blocked on |
|---|---|---|
| GL-2: Keygen license wiring | 4 hrs | Keygen.sh account |
| GL-3/4: macOS code signing + notarization | 8 hrs | Apple Dev Org + D-U-N-S |
| GL-5: Payment processor (Paddle / LemonSqueezy) | 6 hrs | Company registration |
| DI-1: CrabNebula CDN | 3 hrs | GL-3 signing |
| DI-2: Repo → private | 1 hr | Company registration |
| DI-3/4: Windows build + EV signing | 12 hrs | EV cert |

#### Tier 1 — High-Impact V2 Features
| Feature | Est. | Notes |
|---|---|---|
| Regulatory Intelligence Agent | 25 hrs | Cloudflare Worker + Claude Haiku synthesis + R2 CDN + ES Regulatory Watch section + update surfacing UX. Pro only. |
| DOCX export | 12 hrs | docx.js already in package.json. Pro feature. |

#### Tier 2 — ROI Model Builder V2
| Enhancement | Est. |
|---|---|
| Detailed revenue attribution | 4 hrs |
| Multiple risk pillars (3–5 events) | 3 hrs |
| Custom scenario multipliers (slider) | 2 hrs |
| Payback period calculation + chart | 3 hrs |
| ROI model history snapshots | 4 hrs |
| TCO: merge hidden costs into spend_items | 3 hrs |
| Industry benchmarks ("your ROI vs. sector median") | 10 hrs |
| Monte Carlo simulation — Enterprise tier only | 8 hrs |

#### Tier 3 — Content + Quality
| Item | Est. | Notes |
|---|---|---|
| Exec summary remaining industries (ES-2) | 8 hrs | Retail, Education, Energy, Telco, Media, Real Estate, Nonprofit, Other |
| Industry CDN content files (energy-utilities.json + 5 more) | 6 hrs | Remote content plan |
| ES-4: PDF exec summary visual redesign | 6 hrs | Deferred session 43 |
| Automated test suite (QC-2) | 12 hrs | Pre-enterprise gate |
| Accessibility — ARIA roles (QC-1) | 8 hrs | Pre-enterprise/public sector gate |

**V2 total: ~119 hrs feature work + ~34 hrs infrastructure = ~153 hrs**
**Suggested sequencing:** Tier 0 → Regulatory Agent (compliance urgency = highest conversion driver) → DOCX → ROI V2 → Content/Quality

#### V3 Backlog (not V2)
- AI Shadow Discovery — SaaS edition (see above)
- Scheduled automated scans
- ChatGPT Enterprise / Copilot usage API integration (usage-type breakdown)

#### V4 / Enterprise Backlog
- Browser extension (usage categorization for any AI tool)
- Endpoint agent
- CASB integration (Netskope, Defender for Cloud Apps)
- Multi-user / team assessments
- White-label / reseller tier
- Proxy-mode Anthropic API (removes BYOK — enables enterprise provisioning)

---

### Agent / Token Strategy — Codified (2026-03-16)

**Decision: Prescribed model usage going forward.**

| Model | Use for |
|---|---|
| **Haiku** | File exploration, content generation (question banks, regulatory summaries, industry copy), memory updates, research subagents, all "write N items of type X" tasks |
| **Sonnet** | Complex multi-file code changes, architecture decisions, debugging, anything requiring context across 5+ files simultaneously |
| **Parallel Haiku pattern** | When work is parallelizable — spawn N Haiku subagents simultaneously, each owning one independent unit (e.g., 8 industry exec summaries, 8 regulatory body monitors). Cheap tokens in parallel beats expensive tokens sequentially. |

**Rule:** Default to Haiku. Escalate to Sonnet only when the task genuinely requires it. Never use Sonnet for research, exploration, or content generation that Haiku can handle.

---

### DMG Install Experience — Polish for V2 Pre-Launch (2026-03-17)

**Decision: Defer custom DMG installer script until code signing is complete.**

**What's deferred:** A post-processing CI step that unpacks the Tauri-built DMG, injects an `Install AlphaPi.command` script (copy app + xattr + launch + eject volume), and repacks. This gives users a "window auto-closes = install succeeded" signal.

**Why deferred:** Beta testers are technical enough for the current 5-step guide. Once Apple code signing is in place (post D-U-N-S + Apple Dev Org), macOS won't quarantine the app at all — the Terminal xattr step disappears entirely. At that point, the full polish pass (DMG background image, icon layout, auto-eject script) is worth building together as one unit.

**Trigger:** Do this work alongside GL-3/GL-4 (macOS code signing). Not before.

---

### ROI Model Builder — Multi-Select Risk Categories (2026-03-17)

**Decision: Shared probability inputs across combined exposure for V1. Per-category probability inputs deferred to V2.**

Single `riskProbBefore/After` pair applies to the summed exposure of all selected categories. When user selects multiple categories, default exposures are summed and pre-filled. User can override the combined total. V2 "Multiple risk pillars" backlog item (3 hrs) will add per-category probability configuration.

---

### Help, Website & Support — Feature Backlog (2026-03-17)

Captured from session 51. Organized into three tracks: pre-launch blockers, in-app V2 features, and website/marketing.

---

#### TRACK A — Pre-Launch Blockers (must exist before public launch)

**A-1: Landing page + Privacy Policy + ToS**
- Required by: Paddle/LemonSqueezy merchant onboarding (product URL), Apple Developer review (support URL), GDPR/CCPA (Privacy Policy URL in app), D-U-N-S business verification
- Minimum viable: single-page site with headline, product description, pricing, Privacy Policy, ToS, and contact email
- Hosting options: Webflow (easiest, no-code), Framer (designer-friendly), Carrd ($19/yr, fastest)
- Privacy Policy + ToS: generate via Termly or Iubenda (~$10-30/mo), needs a real hosted URL
- **Trigger:** Do before payment processor onboarding. Do alongside company registration.

**A-2: In-app support link**
- App must surface a support email or URL — required for Apple review and user trust
- Decision needed: `mailto:support@[domain]` alias (simplest) vs Crisp chat widget (free tier, real-time) vs help center URL
- Recommendation for V1: `mailto:` link in Settings footer. No infrastructure required.
- Location: Settings panel footer, and optionally the Help tab (see B-1)

---

#### TRACK B — In-App V2 Features

**B-1: Help tab**
- Dedicated tab in Settings or as a top-level nav item
- Contents: dimension explainers, ROI prep guide, FAQ, glossary, version changelog, support link
- Decision needed: standalone tab vs integrated into Settings vs contextual (? icons inline)
- Recommendation: contextual tooltips on questions (highest ROI, lowest friction) + a Help tab for deep content

**B-2: Dimension explainers ("How to" section)**
- For each of the 6 dimensions: why it matters, what good looks like, what the score means, 2-3 real-world examples
- Can surface as: (a) expanded description on DimensionStep before questions, (b) Help tab content, (c) website content (same copy, dual purpose)
- Tone: "plain English for orgs that don't have an AI governance team"

**B-3: ROI calculation prep guide**
- Shown before or during ROI Tracking dimension + ROI Model Builder
- Content: what data to gather in advance (AI tool spend, headcount, current task times, incident costs), where to find it, typical sources per org size
- Format: checklist-style, collapsible, skippable
- Can also be a downloadable PDF from the website — doubles as a lead magnet

**B-4: In-app changelog / "What's new" modal**
- On first launch after an app update: show a brief modal with top 3 changes in the new version
- Pairs naturally with the existing auto-updater wiring
- Lightweight: pull from a JSON file in R2 (same CDN pattern as regulatory content)

**B-5: Contextual ? tooltips on questions**
- Each question already has `helpText` — surface it more prominently
- Add a small `?` icon that expands the help text inline or in a tooltip
- Higher-value than a Help tab for users in the assessment flow

---

#### TRACK C — Website / Marketing (V2, post first revenue)

**C-1: Full marketing website**
- Pages: Home, How It Works, Pricing, Why AlphaPi (vs enterprise tools), Blog/Resources, Contact
- SEO target keywords: "AI governance assessment," "AI risk management for SMB," "EU AI Act compliance checklist"
- Help content (B-2, B-3) repurposed as blog/resource pages — same writing effort, organic search value
- Include: product screenshots, assessment sample output, ROI calculation example

**C-2: Demo / explainer video**
- 2-3 minute walkthrough of a full assessment → results → PDF export
- Embed on home page and pricing page
- Can be screen recording (Loom) for V1

**C-3: Lead magnet — ROI prep PDF**
- "AI Governance ROI Prep Checklist" — free downloadable PDF
- Email capture gate → feeds marketing list
- Repurposes B-3 content

**C-4: In-app → website links**
- "Learn more about AI governance" → blog/resources on website
- "Get support" → support email or help center
- "View pricing" → pricing page (replaces disabled "View Plans" button in LicensePanel)
- "Release notes" → website changelog or GitHub releases page

---

#### Open questions for these tracks
1. **Support channel**: email alias vs Crisp widget vs Discord — decide before A-2
2. **Website platform**: Webflow vs Framer vs Carrd vs custom — decide before A-1
3. **Help tab vs inline**: ship B-5 (tooltips) first, then B-1 (full tab) in a later sprint?
4. **Content ownership**: who writes the dimension explainers and ROI prep guide — user or Claude-assisted?


---

### Help & Support — Locked Decisions (2026-03-17, session 51)

Answers locked from user review of Track A/B/C backlog:

1. **Help UX pattern**: Both contextual tooltips AND a full Help tab. Tooltips = short single sentence (inline, low friction). Help tab = deeper content (dimension explainers, ROI prep guide, FAQ, glossary, changelog).
2. **ROI prep guide**: Build it. Lives in-app before ROI Tracking dimension + ROI Model Builder. Also publish as downloadable PDF from website (lead magnet / email capture gate).
3. **Support channel**: Email alias (`mailto:support@[domain]`) for V1. No chat widget until meaningful support volume justifies it.
4. **Website**: Required pre-launch for landing page + PP/ToS. Full marketing site (Track C) is post-first-revenue. Needs dedicated planning session before build.
5. **Landing page pre-launch**: Confirmed as launch blocker. Do alongside company registration and domain purchase. Minimum: headline, product description, pricing, PP/ToS, support email.
6. **SEO via help content**: Confirmed. Dimension explainers + ROI prep guide written once, used in-app AND published as website resource pages. Same content, dual-purpose.

---

### V2 Sprint 1 — Regulatory Intelligence Agent: Locked Decisions (2026-03-17, session 51)

All 5 clarifying questions answered and locked. Sprint 1 is fully specced.

---

#### Decision 1: Bill status — enacted only, proposed tracked silently

**Locked:** Regulatory Watch surfaces **enacted law only** (`status: "enacted"`).

Proposed/pending bills are fetched by the Worker and stored in R2 with `status: "proposed"` but are NOT surfaced in the in-app UI in Sprint 1. They live in R2 silently, ready for a future "Legislative Watch" sprint (Pro-only).

**Rationale:** Bills change materially before passage (SB 1047 failed entirely). Surfacing proposed bills creates noise and potential misguidance. Enacted-only keeps the signal high.

**R2 schema implication:** All regulation objects carry `"status": "enacted" | "proposed"`. Worker fetches both; app filters to `enacted` only for display and badge count.

**Future sprint trigger:** When proposed bill tracking is added, the UI already has the data — just remove the filter.

---

#### Decision 2: Worker always writes manifest with fresh `last_checked` timestamp

**Locked:** Worker writes to R2 on every cron run regardless of content changes.

- Content files (`us-federal.json`, `ca-state.json`) updated only when content actually changed (hash comparison)
- `manifest.json` updated every run with fresh `last_checked` timestamp
- Provides a clear audit signal: "Worker ran successfully on [date]" vs "Worker has not run in X days"
- App can display "Regulatory data last verified: [date]" with confidence
- Supports regulatory compliance audits — verifiable that monitoring was active

---

#### Decision 3: Per-update acknowledge + audit log

**Locked:** Each regulation card dismissed individually. Acknowledgment tracked in SQLite with timestamp.

**SQLite schema addition to `regulatory_updates` table:**
```sql
acknowledged        INTEGER DEFAULT 0,   -- 0 = unread, 1 = acknowledged
acknowledged_at     TEXT                 -- ISO8601 timestamp, null until read
```

**Audit implication:** This enables a **Regulatory Acknowledgment Log** in the Pro PDF report:
> "User acknowledged: NIST AI RMF — March 10, 2026"
> "User acknowledged: CA AB 2013 (enacted) — March 17, 2026"

This is a genuine compliance differentiator — customers in regulated industries can demonstrate they actively monitored and acknowledged regulatory changes. Flag this in marketing copy.

**Badge behavior:** Unread count shows only unacknowledged enacted regulations. Badge clears per card on click/dismiss.

---

#### Decision 4 & 5: Business entity — Delaware single-member LLC

**Locked:** Delaware single-member LLC. Self-funded, sole founder.

- No equity split documentation needed
- Single-member LLC operating agreement (simple template)
- Pass-through taxation (profits on personal return)
- Easiest formation path: Stripe Atlas or DIY via Northwest Registered Agent
- Convert to C-Corp only if VC funding becomes realistic (cross that bridge later)
- D-U-N-S + Apple Dev Organization account work the same for LLC as C-Corp

---

### Session 52 Decisions (2026-03-18) — /plan-ceo-review Review

#### Plan A: Regulatory Intelligence Agent — Architecture Decisions (LOCKED)

All decisions confirmed via /plan-ceo-review Selective Expansion mode.

**cdnService.ts generalization (LOCKED)**
- Refactor existing `contentService.ts` into a shared `cdnService.ts` that handles any content type (industry, regulatory, future changelogs)
- `regulatoryService.ts` becomes a thin wrapper over `cdnService.ts`
- Eliminates duplicate CDN fetch, manifest parsing, and SQLite cache logic
- `contentService.ts` (industry content) also becomes a thin wrapper — same shared layer

**R2 bucket strategy (LOCKED)**
- Use existing `ai-governance-content` bucket with `regulatory/` subdirectory (NOT a separate bucket)
- Paths: `regulatory/manifest.json`, `regulatory/us-federal.json`, `regulatory/ca-state.json`
- Single `VITE_CONTENT_CDN_URL` env var handles both industry and regulatory content
- No new Cloudflare R2 bucket to provision

**Worker project location (LOCKED)**
- Cloudflare Worker lives in `workers/regulatory-worker/` subdirectory of the main repo
- Shared TypeScript types in `src/types/regulatory.ts` — imported by both app and Worker
- Manual `wrangler deploy` for now; GitHub Actions CI/CD added after repo goes private (DI-2)

**Regulation JSON schema additions (LOCKED)**
All regulation objects must include:
- `severity: "critical" | "high" | "medium"` — derived from penalty_structure in Haiku prompt
- `affected_dimensions: string[]` — must use exact dimension keys: `shadowAI`, `vendorRisk`, `dataGovernance`, `securityCompliance`, `aiSpecificRisks`, `roiTracking`
- `content_hash: string` — SHA hash of summary+action_required; Worker uses to detect material changes; app resets `acknowledged=0` only when hash changes on upsert
- `status: "enacted" | "proposed"` — app filters to `enacted` only for display

**Federal Register filtering strategy (LOCKED)**
- Worker uses keyword allowlist filter: categories = Rules/Proposed Rules; title/abstract must contain any of: `['artificial intelligence', 'machine learning', 'automated decision', 'AI system', 'algorithmic']`
- Haiku does a second-pass relevance check before synthesizing: "Is this relevant to AI governance for a mid-market org?"
- Cap: max 100 results per source per Worker run (prevents FR API rate limit exhaustion at 1,000 req/day)

**Pro gate scope (LOCKED)**
- Regulatory data fetch happens for ALL users (free + pro) on launch
- Display is Pro-gated: free users see a locked badge "You have N critical regulatory updates — Upgrade to view"
- This is the upsell hook; fetch has no privacy concern (public regulatory data)

**Stale data UX (LOCKED)**
- First launch / no cache: empty state "Regulatory data will appear after your first sync"
- Badge hidden until data arrives
- If `manifest.last_checked` is >30 days old: yellow warning chip "Data may be outdated" on RegulatoryWatch panel
- Worker writes `worker_health.json` to R2 on every run: `{ last_run_at, run_status, sources_fetched, regulations_written }`

**ES-3 regulatory citation (LOCKED)**
- Top 3 unacknowledged regulations injected into ES-3 Haiku prompt
- Scoring: severity weight (critical=3, high=2, med=1) + dimension weight (user's weak dimensions score higher)
- Tie-break: show one per dimension to avoid 3 regulations all about Shadow AI
- Graceful nil: if no regulations available (non-US user, no cache), ES-3 works without regulatory context

**Regulatory Acknowledgment Log (LOCKED — already in plan, confirmed)**
- Per-update dismiss; `acknowledged` + `acknowledged_at` in SQLite `regulatory_updates` table
- Shows in Pro PDF as compliance evidence trail
- Re-acknowledgment required if `content_hash` changes on same regulation

**SQLite error handling requirements (LOCKED)**
- All `regulatory_updates` DB operations need `try/catch`; fallback to in-memory Zustand state
- Use `INSERT OR REPLACE` (upsert) — not `INSERT` — regulations update in place between Worker runs
- New columns added via `ALTER TABLE ... ADD COLUMN` in try/catch after `CREATE TABLE IF NOT EXISTS`
- Acknowledgment DB write failure: catch + optimistic UI (Zustand first), don't surface to user

**Revised effort estimate (LOCKED)**
- Original: 25 hrs. contentService.ts reuse saves ~8 hrs on app side. Cherry-picks add ~8.5 hrs.
- Net: ~25 hrs for a significantly more complete product. Same clock time, higher completeness.
- Design doc: `docs/designs/regulatory-intelligence-agent.md` (generated by /plan-ceo-review)

---

#### Plan B: Pre-Launch Critical Path — Decisions (LOCKED)

**Payment processor (LOCKED): Paddle**
- Merchant of Record — handles all global VAT/GST/sales tax automatically
- Fees: 5% + $0.50 per transaction
- No tax compliance burden ever; strong track record with desktop software
- Signals professionalism to compliance-focused buyers

**Landing page platform (LOCKED): Carrd**
- $19/year, drag-and-drop, custom domain, SSL
- Target: live within 2-4 hours of starting build
- Intentionally temporary — migrate to Webflow/Framer for full V2 marketing site
- Build alongside company registration / domain purchase

**PP/ToS generator (LOCKED): Termly**
- Free tier (GDPR + CCPA compliant), hosted URL in 20 min
- Upgrade to $10/mo to remove Termly branding if needed
- Required before: Paddle onboarding, Apple review, app submission

**Trademark strategy (LOCKED)**
- Do USPTO TESS search first (free, anonymous — search queries are not public)
- Use common law ™ for launch (first commercial use is legally sufficient)
- File USPTO ® application 90 days post-first-revenue (~$250/class)
- Search Class 42 (software) AND Class 35 (business services)

**Legal name consistency (CRITICAL FLAG — LOCKED)**
- The exact legal LLC name must be IDENTICAL across: D-U-N-S application, Apple Dev form, Paddle, Keygen, bank account
- Even minor formatting differences (comma, capitalization) will cause Apple Dev rejection
- Verify D-U-N-S record matches exactly before submitting Apple Dev application

**Missing item identified (LOCKED)**
- In-app Privacy Policy URL link needed in Settings footer (alongside `mailto:support@[domain]`)
- 5-min fix; required for Apple review and GDPR compliance
- Add at same time as `mailto:` support link

**Timeline estimate (LOCKED)**
- Day 1: Trademark search → Day 1-2: Domain + Carrd landing page
- Day 2-5: Delaware LLC formation
- Day 5: EIN (instant online) + start D-U-N-S ($230 expedited) + start Keygen + Paddle
- Day 13: D-U-N-S received → Day 14-17: Apple Dev approved → code signing → submit
- Minimum: ~19 calendar days from trademark clear to Apple submission
- D-U-N-S is the critical path; nothing in Apple chain moves until it arrives

**Post-launch 90-day actions (LOCKED)**
- File USPTO ® trademark application ($250/class)
- Business insurance: NEXT Insurance (~$25/mo tech E&O)
- Open business bank account: Mercury (free for LLCs)
- Consider trademark attorney for Class 42 search validation (~$300-500)

---

### Domain & Brand — Decisions (2026-03-18, session 52 continued)

**Primary domain (LOCKED): getalphapi.com**
- alphapi.com taken by MarkUpgrade domain broker (for sale, broker contacted)
- alphapi.io also taken (parked)
- getalphapi.com registered via Cloudflare Registrar on 2026-03-18
- getalphapi.com is primary domain for landing page, email, all marketing
- "getXYZ.com" is an established pattern for software products — professional and clean

**Secondary domain (OWNED): alphalpi.com**
- Accidentally registered before getalphapi.com (typo during registration)
- Keep it — set up redirect alphalpi.com → getalphapi.com
- Costs ~$9/yr, provides typo protection

**alphapi.com acquisition strategy (DEFERRED)**
- Broker: MarkUpgrade. Contact sent 2026-03-18.
- Expected price range: $500–$2,000 (niche compound word, not a dictionary term)
- Action: wait for broker response, negotiate post-first-revenue
- If price is reasonable (<$1,500), acquire and make primary with redirect from getalphapi.com

**Email (NEXT ACTION): support@getalphapi.com**
- Set up via Cloudflare Email Routing (free) → forward to balt.aguilar@outlook.com
- Required before Apple review submission
- Also needed in Settings footer (mailto: link) and landing page

**Trademark status**
- USPTO TESS search completed 2026-03-18: NO CONFLICTS found for "AlphaPi"
- Common law ™ applies from first commercial use (sufficient for launch)
- File USPTO ® application 90 days post-first-revenue (~$250/class, Class 42 + Class 35)

---

## 2026-03-18 — Session 53: Delaware LLC + Legal Name

**Decision:** Legal name is **AlphaPi, LLC** (Delaware LLC, filed via Stripe Atlas 2026-03-18).

**Rationale:** Clean, matches product name, available in Delaware entity search (confirmed via ICIS), USPTO TESS clear (no conflicts for "AlphaPi").

**Atlas filing details:**
- Structure: LLC (not C-Corp — single founder, no outside investment planned at launch)
- State: Delaware
- EIN: to be issued by IRS within 1–2 business days of incorporation
- Banking: Mercury (pre-linked via Atlas)

**Idaho foreign entity registration required** — founder is in Idaho (Boise), triggering foreign registration requirement (~$100, sos.idaho.gov).

**83(b) election: N/A** — only relevant for equity grants at below-market value; not applicable to single-member LLC.

**Name consistency rule (CRITICAL):** Use exact string "AlphaPi, LLC" everywhere — D-U-N-S, Apple Dev, Paddle, bank, legal docs. Do not vary capitalization or punctuation.

---

## 2026-03-19 — Session 59: Regulatory Intelligence Agent — Content Freshness & HITM Decisions

### Decision 1: Human-In-The-Middle (HITM) Content Approval Pipeline (LOCKED)
No regulatory content reaches production without owner review and explicit approval. Content generated by the Worker + Haiku sits in a pending state (R2 `pending/` prefix) until approved. Approved content is promoted to `regulatory/` and goes live on next app fetch.

**Admin dashboard (FUTURE — not V2 scope):** An owner-only operator panel embedded in the Tauri app will handle approvals, license key management, support queue, and basic CRM. Notification bell in-app + email alert when content is queued for review. Build post-first-revenue.

**For V2 Sprint 1:** HITM approval is a manual process (owner reviews R2 pending content directly). Admin dashboard UI is deferred.

### Decision 2: Model Cascade — Primary + Fallback (LOCKED)
**Primary model:** Haiku (pinned version — upgrades are intentional, not automatic).
**Fallback model:** More capable model (Sonnet, Opus, or non-Anthropic — best available at time of evaluation) kicks in when Haiku output fails schema validation.
**Not locked to Anthropic only** — evaluate best-available model for regulatory synthesis quarterly.
**Fallback output:** Still goes through HITM review queue before going live. No auto-approval regardless of model capability.
**Quarterly model review:** Baked into process — owner + Claude evaluate whether primary/fallback assignments still make sense as new models release.

### Decision 3: Haiku Synthesis Rules (LOCKED)
Rules = system prompt + structured output schema. Both maintained by owner, versioned as a config file in the Worker repo (git-controlled). Edit rules → redeploy Worker.
**Validation:** If Haiku output fails schema validation, cascade to fallback model (one attempt). If fallback also fails, flag for manual review in next HITM queue. Skip that regulation until next cron run.
**System prompt constraints (to be authored at build time):** cite only primary sources, no extrapolation beyond source text, severity must match defined criteria, output must conform to R2 JSON schema.

### Decision 4: Free User Regulatory Staleness Notice (LOCKED)
**Trigger:** Fires only after at least one regulatory update has been published (not a generic static message from day one).
**Banner:** Persistent, non-dismissible until user upgrades to Pro. Copy is A+B hybrid — count-aware + urgency language. Example direction: "X regulatory updates have been published. AI regulations change constantly — your assessment may not reflect current requirements. Upgrade to stay current."
**PDF + DOCX:** Regulatory staleness notice appears at the top of both free PDF and free DOCX exports on every generation after at least one update exists. Wordsmithing deferred.

### Decision 5: Pro User Auto-Launch Check-In Modal (LOCKED)
**Trigger:** Auto-launches on app open if >30 days since last CDN fetch (not since last app open).
**Content:** Lists specific regulatory updates + affected dimensions + impact signal. Includes new questions if the update introduces pertinent assessment questions.
**Re-scoring:** App re-scores assessment with before/after snapshot displayed. Snapshot is display-only — not persisted to SQLite.
**New questions:** Mini wizard flow — pertinent new questions only. User must answer to get revised score.
**Act flow:** User acknowledges update + answers new questions. Closeable without acting, but all responses, acknowledgments, and non-actions are tracked in SQLite.
**Scope:** Pro-only.

### Decision 6: Regulation Lifecycle — Enacted → Superseded (LOCKED)
When a regulation is superseded:
1. **Original card:** Struck through + labeled "Superseded" in RegulatoryWatch UI.
2. **New card:** Generated for the superseding regulation — goes through HITM approval queue before going live.
3. **Audit log:** Prior acknowledgment of the superseded regulation is preserved (immutable, timestamped). New card requires a fresh acknowledgment — tracked separately.

**Audit log design principle (SOC-ready):** All regulatory_updates DB operations are immutable — no deletes, clean timestamps, append-only acknowledgment records. SOC 1 compliance is a future milestone (full product scope, post-revenue). Design now for SOC readiness; formal audit deferred.
