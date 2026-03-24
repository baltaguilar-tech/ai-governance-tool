# AlphaPi — Session Summary Index

This file is maintained by Claude. Each session appends a new entry — never overwrites.
See also: `~/.claude/session-index.md` for cross-project index.

---

## Session: 2026-03-21

**Focus:** Pre-build product planning — SaaS Product Plan document (Section 0)

### Decisions Made

- Adopted a 14-section Product Owner pre-build framework for the AlphaPi SaaS, superseding the Gemini-proposed Double Diamond + Value Proposition Canvas model
- Framework draws from: assumption-based planning, JTBD, Opportunity Solution Tree (Teresa Torres), Product Principles (Cagan), and full Business Model Canvas
- SaaS pivot confirmed as locked (not challengeable). Everything else is open: channel, pricing, acquisition thesis, timeline, architecture
- Output format: one comprehensive document (`docs/saas-product-plan.md`), built section by section with approval at each stage
- Pre-validation state acknowledged: Armanino call not yet scheduled; no paying customers; no validated consulting firm channel; no architecture designed

### Tasks Agreed

- [x] Read the full project folder and synthesize state
- [x] Propose planning framework and structure
- [x] Build Section 0 — Project State & What This Document Is For
- [ ] Build Section 1 — Assumption Inventory & Risk Map (pending approval of Section 0)
- [ ] Build Sections 2–14 (pending, one per approval cycle)
- [ ] Create `~/.claude/session-index.md` entry for this project

### Outstanding / Deferred

- Armanino call not yet happened — Sections 10, 11, 12 should not be finalized before it
- Attorney review of ToS, white-label agreement, GDPR data processor structure — not yet done
- Business formation still pending: EIN from IRS, D-U-N-S application, Mercury bank account, Apple Dev enrollment — all blocked on Atlas incorporation email
- Desktop app (v0.9.2-beta) frozen — do not modify

### Notes

- The 252-question desktop assessment may not be the right experience for a web SaaS served through consulting firms — this assumption will be explicitly examined in Section 1 (Assumption Inventory)
- The "90-day Stage 1 build" timeline needs challenge before it becomes a commitment — it carries multi-tenant auth security risk
- The consulting firm channel is the most important unvalidated assumption in the entire plan
- All prior session docs live in `docs/SESSION-XX-RECOVERY.md` (Sessions 36–59); architectural decisions in `docs/decisions.md`

---

## Session: 2026-03-23

**Focus:** Completing all 14 sections of the SaaS Product Plan (`docs/saas-product-plan.md`)

### Decisions Made

- Sections 1–9 were written in the previous session (2026-03-21, continued into 2026-03-23 due to context window). Sections 10–14 written in this continuation session.
- Section 10 (Architecture): Shared-schema-with-RLS chosen for Stage 1 over schema-per-tenant. firm_id denormalized on all data tables for RLS simplicity. Scoring engine port strategy: direct copy, no refactor. Questions served from static TypeScript files, not database. Architecture session required before code — 8 specific decisions deferred to that session.
- Section 11 (Risk Register): 16 risks cataloged. Top 3 priority: (1) consulting firm channel doesn't convert — CRITICAL/HIGH, (2) RLS misconfiguration — CRITICAL/MEDIUM, (3) no attorney review — HIGH/HIGH. Each can independently kill the project.
- Section 12 (MVP): 9 MVP items defined with acceptance criteria. Build sequenced over 13 weeks. Check-in gate at Week 2: if auth+infra isn't working by day 14, reassess timeline. 90-day estimate challenged — honest estimate may be 120 days.
- Section 13 (Validation Plan): 5 validation activities prioritized. Armanino call is #1 with a full interview guide (channel, product, pricing, competitive, legal questions) and explicit kill criteria. Architecture spike is #2 (3–5 days). Attorney review is #3 (hard gate before first pilot).
- Section 14 (Definition of Done): 24 checkboxes across product, security, legal, business, operational, and documentation criteria. All must be met. "Done" explicitly does not mean perfect, billing-ready, or acquisition-ready.

### Tasks Agreed

- [x] Build Section 0 — Project State
- [x] Build Section 1 — Assumption Inventory & Risk Map
- [x] Build Section 2 — Stakeholder & Actor Map
- [x] Build Section 3 — Jobs-to-be-Done
- [x] Build Section 4 — Market & Competitive Landscape
- [x] Build Section 5 — Business Model
- [x] Build Section 6 — Product Strategy
- [x] Build Section 7 — Product Principles & Anti-Portfolio
- [x] Build Section 8 — Opportunity Map
- [x] Build Section 9 — Feature Discovery & Requirements
- [x] Build Section 10 — Data Model & Architecture Implications
- [x] Build Section 11 — Risk Register
- [x] Build Section 12 — Stage 1 MVP Definition
- [x] Build Section 13 — The Validation Plan
- [x] Build Section 14 — Definition of Done for Stage 1
- [ ] Formal review/approval of Sections 1–14 (pending Balt's review)
- [ ] Create `~/.claude/session-index.md` entry for this project

### Outstanding / Deferred

- Sections 10–14 note that the Armanino call should trigger updates to Sections 1, 5, 9, and 12 based on consulting firm feedback
- Architecture session (dedicated, before Cursor) — 8 decisions deferred from Section 10.7
- Attorney engagement — hard gate before first pilot (not before build)
- The 90-day timeline is challenged in both Section 11 (Risk T4) and Section 12 — honest estimate may be 120 days
- `~/.claude/session-index.md` still needs to be created
- Lite Assessment (30 questions) decision deferred to post-Armanino validation

### Notes

- The complete product plan is 1,861 lines across 15 sections (0–14)
- Competitive research revealed RSM, Grant Thornton, BDO, and Armanino are all building proprietary AI governance tools — this is the #1 threat to the consulting firm channel thesis
- CVE-2025-48757 (Supabase RLS bypass) was flagged — pen-test script in CI is a non-negotiable requirement
- The document is designed as a living document — each section should be updated as assumptions are validated or invalidated
- Next actions in priority order: (1) Armanino call prep, (2) Armanino call, (3) architecture spike, (4) attorney engagement, (5) Stage 1 build

---

## Session: 2026-03-23 (Review Session)

**Focus:** Section-by-section review of the complete SaaS Product Plan (Sections 10–14) with Balt. Incorporated new product ideas, updated stale language, and aligned all sections with decisions made during review.

### Decisions Made

- **Dimension-selective UX confirmed as core design pattern.** Users choose which dimensions to assess first and can return for the rest. The goal is all 6 for a full picture, but partial completion is a designed workflow, not an edge case. This decision cascaded across Sections 9.5, 10.6, 11.2 (P1), 12.2 (MVP-04, MVP-05), and 14.1.
- **Scoring engine port strategy updated (Section 10.6).** "Zero refactor" stance replaced with "copy the algorithm, extend for partial inputs." Core math unchanged. Engine must handle three input states: not answered yet, not applicable at maturity level, dimension not selected. Architecture session decides the interface contract.
- **Questions stay in static TypeScript files, not database.** Filtering by dimension and maturity profile happens at the application layer on the already-loaded static set. No admin UI, no migration scripts, no versioning logic needed.
- **Remediation actions table uses two nullable FKs instead of polymorphic source_id.** `assessment_result_id` (FK → results, nullable) and `scan_result_id` (FK → discovery scan results, nullable) with a CHECK constraint. Avoids the polymorphic anti-pattern — Postgres enforces referential integrity natively.
- **Four placeholder schema entities added to Section 10.4:** Discovery scan configurations (Stage 2), Discovery scan results (Stage 2), Remediation actions (Stage 2/3), Regulatory frameworks (Stage 3). All follow the "design it now, populate it later" pattern.
- **P1 risk reframed (Section 11.2).** No longer "assessment too long" — now "users don't complete enough dimensions for meaningful output." Lite Assessment contingency removed, replaced with UX-driven completion nudges and pilot monitoring.
- **P4 risk updated (Section 11.2).** Regression test now covers both full-assessment (must match desktop) and partial-input scenarios (validated against expected math, no desktop baseline).
- **MVP-04 rewritten (Section 12.2).** Rigid 9-step linear flow replaced with dimension-selective flow. Two acceptance criteria: full assessment and partial assessment.
- **MVP-05 updated (Section 12.2).** Second acceptance criterion added for partial-input scoring (1 dimension, 2 dimensions, 5 dimensions).
- **Lite Assessment moved from "fast-follow" to "future enhancement" (Section 12.3).** Dimension-selective UX largely replaces the concept. May revisit as a lower-tier product offering when pricing tiers are defined.
- **14.1 product criteria expanded.** Added criteria for dimension-selective completion, partial-assessment dashboard display, and partial-input scoring validation.
- **Armanino call approach decided (Section 13.1):** Option A — walk one dimension live (Shadow AI), skip to pre-completed results, export PDF. ~20 min demo, 30+ min interview. Confidentiality slide displayed via screen share at start of call. Two leave-behind documents: branded one-pager PDF + sample assessment PDF, both with confidentiality footers.
- **IP protection approach: Option 3 (verbal framing + document notices).** Verbal confidentiality statement at start of call, confidentiality notices on all shared documents. Formal NDA deferred to pilot stage.
- **Product plan document NOT to be shared externally.** Contains staging strategy, acquisition thesis, pricing models, and competitive analysis. One-pager and assessment PDF are safe to share.
- **Interview question updated (Section 13.1).** "Is 45-90 minutes reasonable?" replaced with dimension-selective framing: "A user can complete one dimension in 15 minutes or all six in 45-90 minutes. How would your team use that flexibility?"

### Tasks Agreed

- [x] Add placeholder schema entities to Section 10.4
- [x] Update remediation actions table to use nullable FKs
- [x] Update scoring engine port strategy (Section 10.6) for partial inputs
- [x] Reframe P1 risk for dimension-selective UX
- [x] Update P4 risk for partial-input regression testing
- [x] Rewrite MVP-04 for dimension-selective flow
- [x] Add partial-input acceptance criteria to MVP-05
- [x] Update Lite Assessment row in Section 12.3
- [x] Update Section 14.1 product criteria for partial assessments
- [x] Update Armanino call prep in Section 13.1
- [x] Update interview question for dimension-selective framing
- [x] Update session-summary.md
- [ ] Create Armanino call prep deliverables (confidentiality slide, one-pager PDF, sample assessment PDF)
- [ ] Full second-pass review of all 14 sections
- [ ] Create `~/.claude/session-index.md`

### Outstanding / Deferred

- Armanino call prep deliverables need to be built (confidentiality slide, one-pager PDF, sample assessment PDF) — next session
- Full second-pass review of the product plan — Balt wants another complete pass
- `~/.claude/session-index.md` still not created (low priority, deferred from session 1)
- Attorney engagement not yet started
- Balt hopes to have the Armanino call this week with a solid Program Manager

### Notes

- Product plan is now ~2100+ lines across 15 sections (0–14)
- The dimension-selective UX decision was the most impactful change in this session — it cascaded across 6 sections
- Balt confirmed he understands the static TypeScript question filtering approach after a plain-language explanation
- Balt confirmed he understands the nullable FK vs polymorphic pattern after explanation
- The AI Discovery Agent vision (Section 9.6) was expanded in the prior session — this review session ensured consistency with that vision across Sections 10, 11, 12, and 14
- Session is getting long — context was compacted once during this session

---

## Session: 2026-03-24

**Focus:** Building the AlphaPi one-pager PDF for the Armanino call, plus correcting assessment timing across the product plan.

### Decisions Made

- **One-pager audience:** The PM on the Armanino call. Not a sales doc; purpose is to get an assessment and response.
- **One-pager visual tone:** Modern and bold. Dark gradient background (#02093A to #0D1B4B) with gold accents, brand logo as watermark.
- **PDF built via Python/reportlab**, not markup. Coded iteratively through 4+ versions.
- **Stats selected for credibility block:** 56% of CEOs report no revenue gains from AI (PwC, 2026) and 79% of companies lack a mature AI governance model (Deloitte, 2026 — inverse of "only 21% have a mature model").
- **Dimension grid uses pill-shaped backgrounds** with subtle gold border stroke. Not a boxy grid.
- **Assessment timing corrected across the product plan:** Each dimension takes under 5 minutes (not 15). Full assessment under 30 minutes (not 45-90). Updated in Sections 9.4, 9.5, 11.2 P1, 12.2 MVP-04, 12.3, and 12.5.
- **How It Works step spacing:** Option B chosen — minimum bottom margin per step (0.18") so short steps get equal breathing room without wasting space on longer steps.
- **Descriptor text shortened for two pills:** "Vendor Risk" → "Third-party AI exposure across vendors." and "Security & Compliance" → "AI use vs. policy enforcement gaps."
- **No em dashes anywhere** in the document. Noted as a standing rule for all AlphaPi content.
- **Clickable citation hyperlinks** added for PwC and Deloitte sources, plus mailto and website links in footer.
- **IP protection via document footer:** Confidentiality notice on all shared documents. Formal NDA deferred to pilot stage.
- **Contact email:** support@getalphapi.com (confirmed working from non-Outlook services).

### Tasks Agreed

- [x] Develop one-pager content iteratively (one paragraph at a time, 5 blocks)
- [x] Code the PDF using Python/reportlab
- [x] Iterate through v1 (white/clean), v2 (dark theme), v3 (stats + dimensions grid + firm value block), v4 (spacing/alignment/pills/hyperlinks fixes)
- [x] Fix stats overlap with tagline
- [x] Fix dimension pill text overflow
- [x] Fix How It Works uneven step spacing
- [x] Add clickable citation hyperlinks
- [x] Correct assessment timing across the product plan (5 locations)
- [x] Update session-summary.md

### Outstanding / Deferred

- Confidentiality slide for Armanino call screen share — not yet built
- Sample assessment PDF export (second leave-behind document) — not yet built
- Full second-pass review of all 14 sections of the product plan
- `~/.claude/session-index.md` still not created
- Fix support@getalphapi.com email routing from Outlook (works from other services)
- Consider Adobe Acrobat for Mac for full PDF feature support (hyperlinks, etc.)

### Notes

- The one-pager PDF is at `docs/alphapi-onepager.pdf`; generator script at root `alphapi_onepager.py`
- The EY "1 in 5" stat was initially misattributed — research confirmed it was Deloitte. Corrected.
- Pill height set to 0.46" with 0.12" row gap as a safety margin for descriptor text
- The one-pager is a single page, confirmed
- Balt approved the final version and marked the task complete

---

## Session: 2026-03-24 (Close)

**Focus:** Session close — memory commit, next session prompt.

### Decisions Made

- One-pager PDF confirmed final and approved. Moved to `~/Projects/alphapi-onepager.pdf` and copied to `docs/alphapi-onepager.pdf`.
- `alphapi_onepager.py` (reportlab generator script) is MISSING from disk. Must be reconstructed at start of next session before any PDF changes can be made.
- ProgressFix items (tagline-to-stats 0.50" spacing, How It Works minimum bottom margin Option B) — status unclear. Visually the PDF looks good from the uploaded version. Confirm at next session whether tweaks are still needed before regenerating.
- Context at 18% remaining — session closed intentionally. All state committed to memory.

### Tasks Agreed

- [x] Copy PDF to docs/alphapi-onepager.pdf
- [x] Update session-summary.md
- [x] Update SESSION-59-RECOVERY.md with session 60 state
- [x] Update MEMORY.md
- [x] Commit + push to GitHub

### Outstanding / Deferred (carry to next session)

1. Reconstruct `alphapi_onepager.py` from the existing PDF (FIRST — needed for any PDF changes)
2. Confidentiality slide for Armanino call screen share
3. Sample assessment PDF export (second leave-behind document)
4. Confirm ProgressFix items still needed (tagline spacing + How It Works margins)
5. Full second-pass review of all 14 sections of the product plan
6. `~/.claude/session-index.md` creation
7. Fix support@getalphapi.com email routing from Outlook

### Notes

- The one-pager looks strong: dark navy (#02093A/#0D1B4B), gold accents (#FFCE20), logo, 56%/79% stats, 6 dimension pills, 4-step How It Works, consulting firm value block, confidentiality footer
- Armanino call not yet scheduled as of this session close
- Product plan is at `docs/saas-product-plan.md` (2,105 lines, 15 sections 0-14) — do NOT share externally
