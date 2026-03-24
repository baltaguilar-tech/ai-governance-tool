# AlphaPi SaaS — Product Plan

*Version 1.0 | Created: 2026-03-21 | Owner: Balt Aguilar*
*This is a living document. It evolves through structured planning sessions, not reactive decisions.*
*Each section is reviewed and approved before the next is built.*

---

## Table of Contents

- [Section 0 — Project State & What This Document Is For](#section-0)
- [Section 1 — Assumption Inventory & Risk Map](#section-1)
- [Section 2 — Stakeholder & Actor Map](#section-2)
- [Section 3 — Jobs-to-be-Done](#section-3)
- [Section 4 — Market & Competitive Landscape](#section-4)
- [Section 5 — Business Model](#section-5)
- [Section 6 — Product Strategy](#section-6)
- [Section 7 — Product Principles & Anti-Portfolio](#section-7)
- [Section 8 — Opportunity Map](#section-8)
- [Section 9 — Feature Discovery & Requirements](#section-9)
- [Section 10 — Data Model & Architecture Implications](#section-10)
- [Section 11 — Risk Register](#section-11)
- [Section 12 — Stage 1 MVP Definition](#section-12)
- [Section 13 — The Validation Plan](#section-13)
- [Section 14 — Definition of Done for Stage 1](#section-14)

---

<a name="section-0"></a>
## Section 0 — Project State & What This Document Is For

*Status: COMPLETE — approved 2026-03-21*

---

### 0.1 What exists today

As of 2026-03-21, AlphaPi is a fully-built **Stage 0 desktop proof of concept** (v0.9.2-beta) consisting of:

- A Tauri v2 + React + TypeScript macOS desktop application
- 252 calibrated assessment questions across 4 maturity profiles (Experimenter, Builder, Innovator, Achiever)
- 6 governance dimensions with defined weights: Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security & Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- A weighted scoring engine written in pure TypeScript — portable to any JavaScript runtime with zero modification
- A results dashboard (radar chart, risk gauge, dimension breakdown, blind spots), PDF export (free + pro tiers), ROI model builder, spend tracker, assessment history, and freemium gating logic
- An auto-updater, SQLite local persistence, deep links, and a first-run legal gate
- AlphaPi, LLC incorporated via Stripe Atlas (Delaware) — EIN and D-U-N-S pending as of 2026-03-21
- getalphapi.com live as a Carrd landing page with Privacy Policy and Terms of Service published
- 59 sessions of documented strategic and architectural decisions across `docs/decisions.md`, `docs/session-log.md`, and session recovery documents

This application is **frozen at v0.9.2-beta.** It will not be modified or enhanced. It serves three purposes going forward: (1) the domain knowledge reference — 252 questions, 6 dimensions, scoring algorithm; (2) a demo artifact for consulting firm sales conversations; (3) proof of concept that the assessment can be completed in one session and produce actionable output.

---

### 0.2 The pivot decision

In Session 59 (2026-03-20), the project direction changed fundamentally. The desktop app was designated Stage 0 of a four-stage product maturity model targeting a SaaS platform acquisition within 24 months.

**What is locked (not challengeable in this document):**
- We are building a web-based SaaS. No more desktop work. No "enhanced desktop" path.

**What is NOT locked and will be examined critically in this document:**
- Whether the consulting firm is the right primary buyer and channel
- Whether the acquisition thesis is sound and to whom
- What the business model actually looks like (pricing, unit economics, channel moat)
- Whether 120 days is a realistic and safe timeline for Stage 1
- What Stage 1 must deliver to validate or invalidate the channel thesis
- What the data architecture must decide before a single line of code is written

---

### 0.3 Honest state of knowledge

As of 2026-03-21, AlphaPi SaaS has:

- **No paying customers** — ever, at any stage
- **No validated consulting firm channel** — the Armanino contact exists but the call has not happened
- **No validated product-market fit** for the web SaaS version
- **No attorney review** of the liability structure, white-label agreement, or GDPR data processor obligations
- **No SaaS architecture** designed — no data model, no multi-tenancy schema, no auth hierarchy
- **No pricing validated** with any actual buyer
- **No acquisition interest expressed** by any named firm

The desktop app (Stage 0) gave us something more valuable than revenue: a working domain model, a validated scoring framework, a freemium logic architecture, and 59 sessions of strategic learning. But it was never sold. The SaaS pivot is based on a thesis, not data.

This is the right time to do this document. Most of what follows in Sections 1–13 contains **hypotheses**, not facts. The explicit goal of this document is to convert the most dangerous hypotheses into validated facts before writing code.

---

### 0.4 What this document is

This is the **Product Owner's pre-build deliverable** — the structured work that a seasoned product owner does before writing the first user story or opening an IDE.

It covers 14 sections, building from the ground up:

| Section | What it covers |
|---|---|
| 1 | Assumption inventory: what we believe and how certain we are |
| 2 | Stakeholder & actor map: every party in this system |
| 3 | Jobs-to-be-done: what each actor is hiring the product to accomplish |
| 4 | Market & competitive landscape: who else is in this space and how we position |
| 5 | Business model: the full economics — not just pricing |
| 6 | Product strategy: vision, goals, and how we'd know if we're succeeding |
| 7 | Product principles & anti-portfolio: what we always do, never do, and explicitly won't build |
| 8 | Opportunity map: from actor pains to ranked product opportunities |
| 9 | Feature discovery & requirements: derived from opportunities, not from "what should we build" |
| 10 | Data model & architecture implications: the decisions that must be made before code |
| 11 | Risk register: product, business, technical, and legal risks with blast radius |
| 12 | Stage 1 MVP definition: exactly what's in, out, and why |
| 13 | The validation plan: the Armanino call as a structured instrument + other required validation |
| 14 | Definition of done for Stage 1: the measurable contract |

---

### 0.5 What this document is NOT

- It is **not a feature list or a backlog.** Features are the output of this process, not the input.
- It is **not a technical specification.** Architecture is addressed only at the decision level — what must be chosen before code, not how to implement it.
- It is **not a commitment.** It is structured thinking. Sections will be revised as validation updates our understanding, especially after the Armanino call.
- It is **not a pitch deck.** It is internal strategic thinking by and for the founder.
- It is **not a replacement for customer discovery.** This document creates the framework for discovery — the Armanino call and subsequent conversations are the discovery itself.

---

### 0.6 How to use this document

**Before every architecture decision:** Check Section 1 (Assumption Inventory). If the decision depends on an assumption rated HIGH or CRITICAL risk, validate that assumption before committing.

**After any consulting firm call (Armanino or otherwise):** Return to Sections 1 (assumptions), 3 (JTBD), 5 (business model), 8 (opportunity map), and 13 (validation plan) and update based on what you learned. The plan proceeds regardless — consulting firm feedback refines it, not gates it.

**Before writing code:** Sections 10 (data model), 12 (MVP definition), and 14 (definition of done) must be complete and approved. Do not start Cursor until all three are signed off.

**As a reference during build:** Section 7 (product principles) is the decision filter. When any new feature request or scope change comes up, run it through Section 7 first.

**When a new stakeholder joins or is pitched:** Hand them Sections 2 (actor map) and 6 (strategy). They contain the clearest statement of what this product is and who it serves.

---

### 0.7 Methodology note

This document uses a hybrid framework drawing from:

- **Assumption-based planning** — ranking every belief underlying the SaaS pivot by risk and certainty before any design begins. Identifies what could prove us wrong and what we need to test.
- **Jobs-to-be-Done (JTBD)** — understanding what each actor hires the product to accomplish, expressed as progress they want to make, not as features they want. Prevents building solutions in search of a problem.
- **Opportunity Solution Tree** (Teresa Torres) — mapping from a desired outcome through the opportunity space to solutions. Ensures we are solving real problems before specifying how.
- **Product principles** (Marty Cagan) — explicit constraints on what the product always does and never does. A strategic tool, not a style guide.
- **Full Business Model Canvas** — not just a Value Proposition Canvas. Captures the multi-sided nature of a B2B2B market: AlphaPi as platform, consulting firm as channel partner and buyer, client organization as end user.

**Why not Double Diamond:** The Double Diamond (British Design Council) is a UX design process — it helps you discover user needs and prototype interfaces. That is the right tool when you don't know what to build. We already know what the product does (assessment + scoring + output). The challenge is who buys it, why, at what price, and through what channel. Those are strategy and business model questions, not design questions.

**Why not Value Proposition Canvas alone:** The VPC maps one customer segment to one value map. This product has three meaningfully different actors (consulting firm, client org, acquirer) whose needs diverge. A single VPC produces the illusion of clarity while hiding the most important tensions.

---

*Section 0 complete. Approved 2026-03-21.*

---

<a name="section-1"></a>
## Section 1 — Assumption Inventory & Risk Map

*Status: COMPLETE — 2026-03-21*

---

### 1.1 Rating methodology

Every assumption is rated on two axes:

**Risk Impact** — How badly does it hurt if this assumption is wrong?
- CRITICAL: Invalidates the entire product direction or business model
- HIGH: Requires significant rework (3+ weeks) or pivot of a major component
- MEDIUM: Requires moderate rework (days) but direction survives
- LOW: Minor adjustment needed; direction unchanged

**Certainty** — How confident are we that this is true?
- VALIDATED: Tested with real customers, data, or contractual evidence
- HIGH: Strong indirect evidence or industry-standard pattern
- MEDIUM: Reasonable inference from research but no direct validation
- LOW: Hypothesis with no supporting evidence beyond founder intuition
- UNKNOWN: Haven't even thought about whether this is true

**Combined Risk** = Impact × Uncertainty. The most dangerous assumptions are CRITICAL impact + LOW certainty. These must be validated before committing architecture or code.

---

### 1.2 Full assumption inventory

#### Channel & Market Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A1 | Consulting firms are the right primary buyer and channel | CRITICAL | LOW | 🔴 CRITICAL | Armanino says "we build our own tools" or "we refer clients to existing platforms" |
| A2 | Armanino specifically will be an early adopter | HIGH | LOW | 🔴 HIGH | They decline or express no interest in the call |
| A3 | Mid-market consulting firms (Armanino/RSM/Moss Adams tier) are the right size | HIGH | MEDIUM | 🟡 MEDIUM | These firms already have proprietary tools and no procurement budget for this; boutique firms are the actual buyer |
| A4 | Consulting firms want a white-label platform they operate | CRITICAL | LOW | 🔴 CRITICAL | They want to refer clients to a tool (not operate it); or they want to resell, not white-label |
| A5 | No white-label AI governance platform for consulting firms exists today | HIGH | MEDIUM | 🟡 MEDIUM | A competitor launches before Stage 1 ships; or Credo AI's partner program already fills this need |
| A6 | Consulting firms will pay for a platform rather than building their own | CRITICAL | LOW | 🔴 CRITICAL | RSM, Grant Thornton, BDO, and Armanino are all already building proprietary assessment tools |
| A7 | The EU AI Act deadline (Aug 2, 2026) creates buying urgency | HIGH | HIGH | 🟢 LOW | Enforcement is delayed or the first wave of penalties is mild |

#### Product Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A8 | The 252-question assessment translates from desktop to web SaaS | HIGH | LOW | 🔴 HIGH | Consulting firm clients won't sit through 252 questions in a browser; completion rates under 30% |
| A9 | The 6 dimensions and weights are correct for consulting firm engagements | HIGH | MEDIUM | 🟡 MEDIUM | Consulting firms organize their governance practices around different categories or use NIST/ISO frameworks directly |
| A10 | The scoring algorithm produces results credible enough for professional services | CRITICAL | MEDIUM | 🟡 HIGH | A consulting firm runs it and says "our clients wouldn't trust this output" |
| A11 | A PDF report is the primary deliverable consulting firms need | MEDIUM | MEDIUM | 🟡 MEDIUM | They need a live dashboard, not a static report; or they need data exports for their own tools |
| A12 | The ROI model builder adds differentiated value | MEDIUM | LOW | 🟡 MEDIUM | Consulting firms already have their own ROI frameworks and don't want a tool dictating theirs |

#### Business Model Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A13 | Revenue is not required before acquisition | CRITICAL | LOW | 🔴 CRITICAL | Every acquirer requires demonstrated ARR, not just reference customers |
| A14 | $500–$2,500/assessment is the right price for Stage 1 pilots | MEDIUM | LOW | 🟡 MEDIUM | Consulting firms expect to pay less (commodity tool) or much more (enterprise platform) |
| A15 | Subscription ($300–$800/org/month) is viable for Stage 2 | MEDIUM | LOW | 🟡 MEDIUM | Consulting firms want per-engagement pricing, not monthly subscriptions |
| A16 | 2–3 paid pilots are enough to validate Stage 1 | HIGH | MEDIUM | 🟡 MEDIUM | Pilots succeed but don't convert to recurring use; or the sample is too small to generalize |

#### Acquisition Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A17 | The product is compelling enough to acquire within 24 months | CRITICAL | LOW | 🔴 CRITICAL | No acquirer expresses interest after 12 months of active outreach |
| A18 | Armanino, RSM, Moss Adams, Hyperproof, LogicGate are plausible acquirers | HIGH | LOW | 🔴 HIGH | These firms build rather than buy; or GRC platforms (LogicGate, Drata, Vanta) already have AI governance modules |
| A19 | 5–10 active consulting firm accounts triggers acquisition interest | HIGH | LOW | 🔴 HIGH | Acquirers need 50+ accounts or $1M+ ARR to justify the deal cost |
| A20 | Clean architecture + SOC-ready audit log = acquisition readiness | MEDIUM | HIGH | 🟢 LOW | Standard technical due diligence expectation; well-understood |

#### Technical Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A21 | Next.js + Supabase + Vercel is the right stack | MEDIUM | HIGH | 🟢 LOW | Well-proven for this class of SaaS; strong community |
| A22 | Supabase RLS provides adequate multi-tenant isolation | CRITICAL | MEDIUM | 🟡 HIGH | RLS misconfiguration causes a data breach between tenants; known CVEs in Supabase RLS patterns |
| A23 | 120 days is enough for a solo founder to build Stage 1 | HIGH | MEDIUM | 🟡 MEDIUM | Multi-tenant auth + RLS + white-label + PDF branding + scoring port + testing takes 5–6 months at quality |
| A24 | The desktop scoring engine ports to web with zero changes | LOW | HIGH | 🟢 LOW | Pure TypeScript; no Tauri dependencies in scoring logic |
| A25 | A solo founder can build AND sell this without a co-founder or team | HIGH | LOW | 🔴 HIGH | Enterprise sales to consulting firms requires dedicated sales capability; building + selling simultaneously is a known failure mode |

#### Legal & Formation Assumptions

| ID | Assumption | Impact | Certainty | Combined | What proves it wrong |
|---|---|---|---|---|---|
| A26 | Delaware LLC is the right entity structure for acquisition | MEDIUM | HIGH | 🟢 LOW | Standard structure; acquirer's counsel converts if needed |
| A27 | No IP conflict with "AlphaPi" trademark | MEDIUM | LOW | 🟡 MEDIUM | USPTO search reveals existing Class 42 registration |
| A28 | Attorney review can wait until after Stage 1 MVP | HIGH | LOW | 🔴 HIGH | First consulting firm pilot requires a data processor agreement, liability cap, and IP assignment before they'll touch it |

---

### 1.3 The five most dangerous assumptions

These are the assumptions where the product direction, architecture, or business model would need to fundamentally change if they're wrong. They are ordered by combined risk.

**🔴 #1: A6 — Consulting firms will pay for a platform rather than building their own**

This is the single most dangerous assumption in the plan. The competitive research reveals that RSM has a proprietary 5-focus-area framework. Grant Thornton built CompliAI on Azure OpenAI. BDO has an AI Risk Assessment Coach. Armanino has Audit Ally. These firms are actively investing in proprietary tools because differentiated IP is how consulting firms compete for clients.

The question is not "do consulting firms need AI governance tools?" — they clearly do. The question is "will they use someone else's tool under their brand, or build their own?" The answer may differ by firm size. The largest mid-market firms (RSM, BDO, Grant Thornton) are building. The question is whether firms one tier below — the Armanino / Moss Adams / regional firms — lack the engineering capacity to build their own and would pay for a platform.

**Validation method:** The Armanino call. Specific question: "You have Audit Ally. If a tool existed that did AI governance assessments under your brand, would you use it — or would you extend Audit Ally to cover it?" This must be asked directly.

**If wrong:** The consulting firm channel collapses. Fallback options: (a) Direct-to-organization SaaS (companies assess themselves), (b) Marketplace model where independent consultants use it (not branded firms), (c) License the scoring engine / question bank to firms building their own tools.

---

**🔴 #2: A1/A4 — Consulting firms are the right channel AND want a white-label platform**

These two assumptions are coupled. A1 says consulting firms are the buyer. A4 says they want to operate the platform under their brand. If either is wrong, the entire architecture (multi-tenant, white-label, firm-branded PDF, RLS by firm) changes.

Alternative realities that would invalidate these:
- Consulting firms want to *refer* clients to AlphaPi (branded as AlphaPi), not operate it themselves. This makes AlphaPi a direct-to-org product with consulting firm referral fees.
- Consulting firms want to *resell* assessments at markup, not operate the platform. This makes AlphaPi a wholesale platform with a different auth model.
- The real buyer is the organization itself — the IT manager or compliance officer who Googles "AI governance assessment" — and the consulting firm is a nice-to-have channel, not the primary one.

**Validation method:** The Armanino call. Specific question: "If this tool existed in your browser today with your logo on it, would your managers use it to run client engagements? Or would you rather send clients a link and have them do it themselves?"

**If wrong:** Redesign for direct-to-org. Drop white-label. Drop multi-tenant firm hierarchy. This actually simplifies the architecture significantly but changes the GTM and pricing entirely.

---

**🔴 #3: A13 — Revenue is not required before acquisition**

The SaaS maturity model document states: "Revenue is not required before exit. Reference customers + demonstrated demand + clean IP is the target." This is a bold claim. In the GRC/compliance SaaS market, acquirers typically look for demonstrated ARR to justify the acquisition cost. The exceptions are acqui-hires (buying the team, not the product) and IP acquisitions (buying the patent or dataset, not the business).

AlphaPi has one founder, no team to acqui-hire, and the IP (assessment questions + scoring) could arguably be replicated by an acquirer in 3–6 months with domain experts. The question is: what exactly is the acquirer buying? If it's "proven product-market fit in a market we want to enter," they need revenue proof. If it's "time saved entering a market," they need a working product with reference customers but may accept zero revenue.

**Validation method:** Research 5 GRC SaaS acquisitions from the last 2 years. What was the target's revenue at time of acquisition? Were any pre-revenue? Specific research: Drata acquisition rumors, Vanta growth, LogicGate funding rounds and what they acquired.

**If wrong:** The plan must produce revenue, not just reference customers. This changes the timeline (longer), the pricing model (must be viable, not "pilot pricing"), and the team requirement (need someone selling full-time).

---

**🟡 #4: A23 — 120 days is enough for Stage 1 (solo founder)**

The Stage 1 scope as defined in saas-maturity-model.md includes: multi-tenant auth with org login + user roles, Supabase RLS data isolation (designed before code), client profile management, 9-step assessment wizard (ported), scoring engine (ported), results dashboard, and PDF export with firm branding.

For a solo founder working full-time with AI-assisted coding (Cursor + Claude), 120 days is plausible for the full scope including multi-tenant auth + RLS + white-label done correctly. The original 90-day estimate was challenged and extended to 120 days to account for the security-critical RLS layer. The architecture research shows that Supabase RLS has a significant CVE history (CVE-2025-48757), common misconfiguration patterns, and requires careful indexing and testing. A data breach between consulting firm tenants would be a company-ending event in a compliance product.

**Validation method:** Build a detailed work breakdown structure (WBS) with realistic task estimates. Compare against published timelines for similar SaaS builds. Factor in time for security testing of the RLS layer specifically.

**If wrong:** Options: (a) Extend timeline to 5–6 months, (b) Hire a contractor for the auth/RLS layer, (c) Reduce Stage 1 scope to single-tenant (one consulting firm only, no multi-tenant), which eliminates the hardest technical risk.

---

**🔴 #5: A25 — A solo founder can build AND sell this**

Building a multi-tenant SaaS and selling it to consulting firms are two full-time jobs. Enterprise sales to professional services firms requires relationship building, proposal writing, security questionnaires, legal review, and ongoing account management. If the founder is doing all of this while also writing code, testing RLS policies, and designing architecture, both the product and the sales will suffer.

The competitive landscape shows that Credo AI's partner program has 8 channel types with dedicated partner management. OneTrust has Protiviti as an implementation partner with 200+ certified consultants. Even at the mid-market level, selling to consulting firms is not a side project.

**Validation method:** Map the founder's weekly hours. How many hours are available for coding? How many for sales? Is there a path to a first hire (even part-time) within 6 months? Or is there a way to structure the product so it sells itself (self-serve, product-led growth) and avoids the enterprise sales problem entirely?

**If wrong:** Options: (a) Find a co-founder with sales/consulting background, (b) Pivot to product-led growth (direct-to-org, self-serve, lower price point), (c) Build for one firm only (Armanino) and use their relationship as the single sales channel.

---

### 1.4 Validation priority ranking

Based on combined risk, the assumptions should be validated in this order. Assumptions that can be tested in the Armanino call are marked (📞).

| Priority | ID | Assumption | Validation method |
|---|---|---|---|
| 1 | A6 | Consulting firms will pay rather than build their own | 📞 Direct question in Armanino call |
| 2 | A1/A4 | Consulting firm channel + white-label model | 📞 Direct question in Armanino call |
| 3 | A13 | Revenue not required before acquisition | Research GRC acquisition precedents |
| 4 | A23 | 120 days is enough for Stage 1 | Detailed WBS before starting |
| 5 | A25 | Solo founder can build + sell | Honest weekly capacity mapping |
| 6 | A10 | Scoring credible for professional services | 📞 Show Armanino the desktop report |
| 7 | A8 | 252 questions work in web browser | 📞 Ask Armanino about client tolerance |
| 8 | A17 | Acquirable within 24 months | Research comparable exits |
| 9 | A28 | Attorney review can wait | Consult attorney before first pilot |
| 10 | A22 | Supabase RLS adequate for multi-tenant | Architecture spike before full build |

**Six of the top ten assumptions can be at least partially validated in the first consulting firm call (Armanino).** The call is the single highest-leverage validation action in the plan. The build proceeds in parallel — consulting firm feedback will refine scope, not block it.

---

### 1.5 What was not considered and why

- **Founder financial runway.** How many months can the founder sustain full-time work without revenue? This affects every timeline assumption. Not assessed because it's private financial information — but it should be mapped honestly.
- **Geopolitical / regulatory reversal risk.** What if the EU AI Act is delayed or weakened? Assessed as unlikely given the August 2026 date is law, but downstream enforcement appetite is uncertain.
- **Technology platform risk.** What if Supabase is acquired, pivots, or has a major outage? Assessed as low given alternatives exist (migration to raw PostgreSQL preserves RLS).
- **Competitive response time.** If AlphaPi demonstrates the white-label consulting model works, how fast can Credo AI, LogicGate, or Vanta replicate it? Not assessed in depth — will be covered in Section 4.

---

<a name="section-2"></a>
## Section 2 — Stakeholder & Actor Map

*Status: COMPLETE — 2026-03-21*

---

### 2.1 Why this map matters

The Gemini model identified two actors: "the person answering the questions" and "the person reading the PDF." The real system has at least six distinct actors with different motivations, decision authority, and definitions of success. Designing for two actors when six exist produces a product that satisfies none of them.

The B2B2B model (AlphaPi → Consulting Firm → Client Organization) means every feature serves at least two actors, and some serve three. Conflicts between actors are where the hardest product decisions live.

---

### 2.2 Actor inventory

#### Actor 1: AlphaPi (Platform Owner — Balt)

**Role in the system:** Builds and operates the platform. Sets product direction, pricing, feature roadmap. Owns the IP. Manages the relationship with consulting firms.

**What they care about:**
- Acquisition readiness within 24 months
- Clean architecture that survives technical due diligence
- Reference customers with demonstrable engagement
- Revenue (at minimum, enough to validate the model)
- Not getting sued (liability, data breaches, regulatory missteps)

**Decision authority:** Total — product, pricing, architecture, features, partnerships

**Key tension:** Builder vs. seller. Every hour coding is an hour not selling. Every hour selling is an hour not building.

---

#### Actor 2: Consulting Firm Partner (e.g., Armanino Partner/Director)

**Role in the system:** Makes the buy/build/partner decision for the firm. Signs the contract. Sets the engagement pricing to clients. Decides whether the firm will brand and sell this.

**What they care about:**
- Firm revenue and utilization (does this create billable work?)
- Firm differentiation (does this make us look smarter than RSM?)
- Risk (will this embarrass the firm? will a bad score cause a client lawsuit?)
- Speed to market (can we sell this next quarter, not next year?)
- Control (can we customize the output? do we own the client relationship?)

**Decision authority:** Buy/no-buy. Contract terms. Engagement pricing. Go/no-go for firm adoption.

**Key tension:** Differentiation vs. cost. Building their own tool creates IP but costs engineering time the firm doesn't have. Buying a platform is faster but means other firms could use the same tool.

---

#### Actor 3: Consulting Firm Manager (Engagement Lead)

**Role in the system:** Runs the client engagement day-to-day. Sets up the client in the platform. Manages the assessment process. Reviews results. Prepares the deliverable for the client executive.

**What they care about:**
- Ease of use (can I set up a new client in 10 minutes?)
- Client experience (will my client find this professional or clunky?)
- Output quality (is the PDF something I'd put my name on?)
- Time efficiency (does this save me time vs. doing assessments manually?)
- Customization (can I add notes, override scores, annotate recommendations?)

**Decision authority:** Day-to-day platform use. Client setup. Engagement workflow. Informal influence on buy/renew decision.

**Key tension:** Efficiency vs. control. The more automated the tool is, the less the manager can customize — but customization is how they add value to justify their billing rate.

---

#### Actor 4: Client Organization Executive (CIO/COO/GC)

**Role in the system:** Receives the assessment report. Makes governance decisions based on it. Presents findings to the board. Allocates budget for remediation.

**What they care about:**
- Board readiness (can I present this to the board as-is?)
- Defensibility (if a regulator asks "what have you done about AI governance?", does this answer that question?)
- Clarity (do I understand what this score means without a PhD?)
- Action items (what do I do first, second, third?)
- Benchmarking (how do we compare to peers in our industry?)

**Decision authority:** Whether to act on recommendations. Budget allocation for remediation. Whether to repeat the assessment. Whether to recommend the consulting firm to peers.

**Key tension:** Wants the report to show they're doing well (ego/board pressure) vs. needs the report to be honest about gaps (actual governance value).

---

#### Actor 5: Client Organization Manager (IT/Compliance/Risk)

**Role in the system:** Actually answers the 252 questions. Gathers data from across the organization. Coordinates with department heads to get accurate responses.

**What they care about:**
- Time (how long will this take me? I have a day job.)
- Clarity (do I understand what this question is asking? what does "adequate" mean?)
- Accuracy (am I going to look bad if I answer wrong?)
- Resume value (completing a formal AI governance assessment is career-building)
- Follow-up burden (what happens after I finish — more work?)

**Decision authority:** Answer accuracy. Whether to complete the assessment. Whether to recommend repeating it.

**Key tension:** This person bears 100% of the labor cost (answering 252 questions) but receives the least direct benefit. The value flows to the executive (board report), the consulting firm (billable engagement), and AlphaPi (reference customer). If this person doesn't complete the assessment, nothing else in the system works.

---

#### Actor 6: The Acquirer (GRC Platform or Consulting Firm)

**Role in the system:** Evaluates AlphaPi as a potential acquisition target. Performs technical and business due diligence. Decides whether the asset is worth the price.

**What they care about:**
- Customer traction (active accounts, not just signups)
- Architecture quality (can our engineers maintain and extend this?)
- Data separation (can we isolate and migrate tenant data cleanly?)
- Regulatory defensibility (is the scoring methodology defensible under scrutiny?)
- Competitive moat (what stops us from building this ourselves in 6 months?)
- IP clarity (is the IP cleanly owned by the LLC? no open-source contamination?)

**Decision authority:** Acquire/pass. Valuation. Terms.

**Key tension:** "Build vs. buy" from the acquirer's perspective. If the product is too simple, they build it themselves. If the product is too complex, integration cost kills the deal. The sweet spot is: significant domain IP (252 questions, scoring, dimensions) + clean architecture + proven demand that would take the acquirer 12+ months to replicate.

---

### 2.3 Influence and decision flow

```
AlphaPi (builds) → Consulting Firm Partner (buys) → Firm Manager (operates)
                                                          ↓
                                                   Client Org Manager (answers)
                                                          ↓
                                                   Client Org Executive (acts)
                                                          ↓
                                                   [Board / Regulators]

Acquirer (evaluates the entire system from outside)
```

**The critical handoff points:**
1. AlphaPi → Firm Partner: The sale. This is where A1/A4/A6 get validated or invalidated.
2. Firm Manager → Client Manager: The assessment. This is where A8 (252 questions in browser) gets validated.
3. Client Manager → Client Executive: The report. This is where A10 (scoring credibility) gets validated.
4. Acquirer → AlphaPi: The exit. This is where A13/A17/A18 get validated.

---

### 2.4 Actor conflicts to design around

| Conflict | Actors | What the product must resolve |
|---|---|---|
| Customization vs. standardization | Firm Manager vs. AlphaPi | Manager wants to edit scores/recommendations. AlphaPi needs standardized methodology for credibility. Resolution: annotation layer (manager adds notes) on top of locked scoring. |
| Honest results vs. good-looking results | Client Executive vs. Assessment integrity | Executive wants to present a favorable picture. Scoring must be defensible. Resolution: frame scores as "governance maturity" (growth-oriented), not "risk exposure" (threatening). |
| Completion burden vs. assessment depth | Client Manager vs. Product value | 252 questions is the depth that makes the output valuable. Client manager wants to finish in 30 minutes. Resolution: progressive disclosure, save-and-resume, dimension-at-a-time. |
| Differentiation vs. scalability | Firm Partner vs. AlphaPi | Partner wants unique output. AlphaPi needs to serve multiple firms. Resolution: white-label + firm-specific annotations, but core assessment identical. |
| Speed to market vs. security | AlphaPi (founder) vs. The Product | 120-day timeline pressures security shortcuts. Multi-tenant data breach ends the company. Resolution: reduce scope, not quality. See Section 12. |

---

<a name="section-3"></a>
## Section 3 — Jobs-to-be-Done

*Status: COMPLETE — 2026-03-21*

---

### 3.1 Framework

Jobs-to-be-Done (JTBD) asks: "What progress is this actor trying to make in their life or work, and what would they hire this product to accomplish?" This is deliberately not a feature list. It's the underlying motivation. Features are the solutions we design to help actors accomplish these jobs.

Each job is stated as: **When [situation], I want to [motivation], so I can [expected outcome].**

---

### 3.2 Consulting Firm Partner — Jobs

**Job 1 (Primary): Win and retain advisory clients**
When a prospect asks "can you help us with AI governance?", I want to demonstrate a structured, branded assessment capability, so I can win the engagement before a competitor does.

**Job 2: Create recurring billable work**
When a client completes their first assessment, I want to show them gaps and a remediation roadmap, so I can propose a follow-up engagement (and the engagement after that).

**Job 3: Differentiate my firm**
When competing against RSM or BDO for an advisory engagement, I want to offer a proprietary-looking AI governance platform, so I can look like we have deeper capabilities than we do.

**Job 4: Manage firm risk**
When my firm puts its brand on a governance assessment, I want the methodology to be defensible, so I can avoid liability if a client's AI governance fails despite our report.

---

### 3.3 Consulting Firm Manager — Jobs

**Job 1 (Primary): Run efficient client engagements**
When I'm assigned a new AI governance engagement, I want to set up the client and start the assessment in under 30 minutes, so I can bill for advisory work, not platform administration.

**Job 2: Produce professional deliverables**
When the assessment is complete, I want to generate a report that looks like my firm produced it, so I can present it to the client without reformatting or rewriting.

**Job 3: Add value beyond the tool**
When reviewing client results, I want to annotate findings with my own expertise, so I can justify my billing rate and demonstrate that the firm adds value beyond running a tool.

**Job 4: Track multiple clients**
When managing 5–10 active engagements, I want a dashboard showing which clients have completed assessments and which are stalled, so I can follow up without manual tracking.

---

### 3.4 Client Organization Executive — Jobs

**Job 1 (Primary): Demonstrate governance to the board**
When the board asks "what is our AI risk exposure?", I want to present a clear, scored, third-party-validated assessment, so I can show we're governing AI proactively, not reactively.

**Job 2: Comply with regulations defensibly**
When the EU AI Act takes effect (or when a state attorney general inquires), I want documented evidence of a structured AI governance assessment, so I can demonstrate reasonable compliance efforts.

**Job 3: Prioritize spending**
When asked "where should we invest in AI governance?", I want a ranked list of gaps with estimated impact, so I can allocate budget to the highest-risk areas first.

**Job 4: Benchmark against peers**
When reporting to the board, I want to know how our governance maturity compares to similar organizations, so I can frame our position as leading, average, or lagging.

---

### 3.5 Client Organization Manager (Assessment Taker) — Jobs

**Job 1 (Primary): Complete the assessment without it taking over my week**
When asked to fill out an AI governance assessment, I want clear questions I can answer without researching each one, so I can finish it alongside my regular work.

**Job 2: Involve the right people**
When a question requires input from IT, Legal, or Operations, I want to save my progress and return later (or forward the question), so I can get accurate answers without guessing.

**Job 3: Understand what my answers mean**
When I answer "No, we don't have this," I want to know whether that's a critical gap or a minor one, so I can flag urgent issues to my manager immediately rather than waiting for the final report.

**Job 4: Not look incompetent**
When answering questions in front of (or for) the consulting firm, I want the assessment to feel like a professional exercise, not a test I'm failing, so I can engage honestly rather than defensively inflating my answers.

---

### 3.6 The Acquirer — Jobs

**Job 1 (Primary): Enter the AI governance market faster than building**
When my board says "we need AI governance in our platform," I want to acquire a working product with proven methodology and existing customers, so I can ship in 3 months instead of 18.

**Job 2: Acquire defensible IP**
When evaluating targets, I want a product with original assessment methodology, not a wrapper around NIST/ISO frameworks anyone can implement, so I can justify the acquisition price to my board.

**Job 3: Integrate cleanly**
When acquiring a SaaS product, I want clean architecture with documented APIs, standard auth patterns, and separable data, so my engineering team can integrate it without a 12-month rewrite.

---

### 3.7 Job priority by product stage

| Job | Stage 1 (MVP) | Stage 2 (SaaS V1) | Stage 3 (Platform) |
|---|---|---|---|
| Firm Partner: Win engagements | ✅ Core | ✅ | ✅ |
| Firm Manager: Run efficient engagements | ✅ Core | ✅ | ✅ |
| Client Manager: Complete assessment | ✅ Core | ✅ | ✅ |
| Client Executive: Board-ready report | ✅ Core | ✅ | ✅ |
| Firm Partner: Recurring billable work | ⬜ | ✅ Stage 2 feature | ✅ |
| Client Executive: Benchmark vs. peers | ⬜ | ⬜ | ✅ Requires aggregated data |
| Acquirer: Enter market faster | ⬜ | ⬜ | ✅ Stage 3 target |
| Firm Manager: Track multiple clients | ⬜ | ✅ | ✅ |

**Stage 1 must nail four jobs:** Help the firm win the engagement, help the manager run it efficiently, help the client manager complete it without pain, and produce a report the executive would show the board. Everything else is Stage 2+.

---

### 3.8 The underserved job — and the product risk it creates

**The most underserved actor is the Client Organization Manager (the assessment taker).** This person does all the work and gets the least direct value. In the desktop app, this person sits at their own computer, in their own time, with no audience. In the SaaS model, this person may be doing the assessment as part of a billable consulting engagement — meaning there's social pressure, time pressure, and reputational exposure.

If this actor churns (abandons the assessment midway), the entire system breaks. The consulting firm can't deliver. The executive doesn't get a report. The product has zero output.

**Design implication for Stage 1:** The assessment experience for this actor must be the single most polished part of the product. Not the dashboard. Not the admin panel. The wizard. The questions. The progress indicators. The save-and-resume. The "I don't know" option. The help text. This is the bottleneck of the entire business model.

---

<a name="section-4"></a>
## Section 4 — Market & Competitive Landscape

*Status: COMPLETE — 2026-03-21*

---

### 4.1 Market context

The AI governance market is projected at $417–$420M in 2026, growing at 28–49% CAGR depending on the research firm. The growth is driven by two regulatory catalysts: EU AI Act enforcement (August 2, 2026) and the Colorado AI Act (effective June 30, 2026), plus broader ISO 42001 adoption. 54% of IT leaders rank AI governance as a core concern.

This market is real and growing. The question is not "is there a market?" but "where in the market is there an unoccupied position that AlphaPi can hold?"

---

### 4.2 Competitive tiers

The market organizes into four tiers by price and capability:

**Tier 1: Enterprise Platforms ($10K–$150K+/year)**
OneTrust ($1,600–$42K/yr), IBM OpenPages ($3,300–$12K/mo), Credo AI (custom enterprise), Holistic AI (custom), Monitaur (custom). These serve Fortune 500 companies with dedicated governance teams. They provide continuous monitoring, automated compliance, model risk management, and integration with the full GRC stack.

AlphaPi is not competing here. These platforms solve a different problem (ongoing governance operations) for a different buyer (enterprise GRC team) at a different price point. However, Credo AI's partner program is relevant — it proves that consulting firms are a viable channel for AI governance platforms, at 10–15× services revenue per $1 of software.

**Tier 2: GRC Platforms with AI Governance Modules ($7K–$50K/year)**
LogicGate Risk Cloud, Drata ($7.5K+/yr), Vanta ($10K–$26K/yr), Secureframe ($12K+/yr). These are existing compliance automation platforms that have added AI governance as a module. They support ISO 42001, NIST AI RMF, and EU AI Act frameworks. Their customers already use them for SOC 2, ISO 27001, and similar certifications.

This tier is the biggest competitive threat to the acquisition thesis. If LogicGate or Vanta adds a white-label consulting firm feature, the AlphaPi acquisition story weakens significantly. The race is: can AlphaPi demonstrate the consulting firm model before these platforms build it themselves?

**Tier 3: Mid-Market and Emerging ($500–$7K/year)**
This tier is thin. The desktop AlphaPi at $79–$3K lives here. A few niche players exist (assessment toolkits, ISO 42001 template packs at $200–$500). There is no web-based, multi-tenant, white-label AI governance platform in this tier.

This is the gap. But the gap may exist because the market doesn't want it, not because nobody has thought of it.

**Tier 4: Free Frameworks and Open Source**
NIST AI RMF (framework + Dioptra tool), ISO 42001 template kits, VerifyWise (open-source AI governance platform). These provide structure but no scoring, no branding, no consulting firm workflow, and no output suitable for a board presentation.

---

### 4.3 What consulting firms use today

Based on competitive research, here's what the target buyer tier (mid-market consulting firms) currently uses:

| Firm | Current tool/approach | Implication for AlphaPi |
|---|---|---|
| Armanino | Audit Ally (proprietary) + manual AI gap assessments | Already building their own. The question is whether Audit Ally covers AI governance or just SOC 2. |
| RSM | Proprietary RSM AI Governance Framework (5 focus areas) | Built their own. Would need to see 10× value to switch. |
| Grant Thornton | CompliAI (proprietary, built on Azure OpenAI) | Built their own with real engineering investment. Very unlikely buyer. |
| BDO | AI Risk Assessment Coach (under evaluation) | Evaluating, not built. Possible window if AlphaPi is ready before they build. |
| Moss Adams | Generative AI Accelerator + manual governance consulting | No dedicated tool. Possible buyer. |
| Crowe LLP | Custom assessments, no named tool | No dedicated tool. Possible buyer. |

**Pattern:** The larger mid-market firms (RSM, Grant Thornton) have already built or are building proprietary tools. The smaller mid-market firms (Moss Adams, Crowe) may still be in the "manual assessment" phase.

**Revised target:** The sweet spot may be firms in the 200–2,000 employee range that do advisory work but lack the engineering capacity to build proprietary tools. These are the firms one tier below the research sample.

---

### 4.4 Competitive positioning map

```
                        HIGH PRICE
                            │
     Enterprise GRC ────────┼──── OneTrust, Credo AI,
     (continuous monitoring) │     IBM OpenPages
                            │
                            │     LogicGate, Vanta,
     GRC + AI Module ───────┼──── Drata, Secureframe
                            │
                            │     ← AlphaPi targets HERE
     Assessment Platform ───┼──── [EMPTY — no player]
     (consulting-firm-first) │
                            │
     Templates / Toolkits ──┼──── ISO 42001 kits, NIST tools
                            │
                        LOW PRICE
     ────────────────────────┼────────────────────────
     POINT-IN-TIME           │         CONTINUOUS
     ASSESSMENT              │         MONITORING
```

AlphaPi's positioning is: **a point-in-time assessment platform designed for consulting firm delivery, at a price point between templates and GRC platforms.** There is no occupied position here. But the question is whether the unoccupied position is a genuine opportunity or a dead zone.

---

### 4.5 The moat question

What stops an acquirer or competitor from replicating this in 6 months?

**What AlphaPi has that's hard to replicate quickly:**
- 252 calibrated questions across 4 maturity profiles — this is 59 sessions of domain work, not a weekend project
- 6 dimensions with weights validated against NIST AI RMF, EU AI Act, ISO 42001 simultaneously
- A scoring algorithm that produces maturity-appropriate results
- Working software (desktop POC) that demonstrates the assessment works end-to-end

**What AlphaPi does NOT have that would create a durable moat:**
- Network effects (no data from multiple firms to create benchmarks)
- Switching costs (no integrations, no data lock-in)
- Proprietary data (all assessment content could be reverse-engineered from the scoring output)
- Brand recognition

**Honest assessment:** The IP moat is 6–12 months of effort, not a permanent barrier. If a Tier 2 player (LogicGate, Vanta) decides to build a consulting firm module, they have the engineering team, the customer base, and the brand to do it faster than AlphaPi can scale. The window is: demonstrate the model before they notice the opportunity.

---

<a name="section-5"></a>
## Section 5 — Business Model

*Status: COMPLETE — 2026-03-21*

---

### 5.1 The fundamental business model question

There are three viable business models for this product. Each produces a different architecture, different pricing, and a different acquisition profile. The choice here shapes everything downstream.

**Model A: Consulting Firm Platform (current plan)**
AlphaPi sells to consulting firms. The firm pays a subscription. The firm uses the platform with their clients. AlphaPi is invisible to the client. Revenue comes from the firm.

**Model B: Direct-to-Organization SaaS**
AlphaPi sells directly to organizations. The organization's IT/compliance team uses it. Consulting firms may refer clients but don't operate the platform. Revenue comes from the organization.

**Model C: Marketplace / Ecosystem**
AlphaPi provides the assessment engine. Independent consultants, small firms, and organizations all use it. AlphaPi is the brand. Revenue comes from subscriptions or per-assessment fees from mixed buyer types.

---

### 5.2 Model comparison

| Dimension | Model A: Firm Platform | Model B: Direct-to-Org | Model C: Marketplace |
|---|---|---|---|
| **Primary buyer** | Consulting firm partner | IT/Compliance manager | Mixed (individual + org) |
| **Sales motion** | Enterprise (relationship-based) | Product-led growth or inside sales | Product-led growth |
| **Price point** | $300–$800/org/month or $500–$2,500/engagement | $50–$200/month per org or $500 one-time | $29–$99/month per seat |
| **Architecture** | Multi-tenant, white-label, firm hierarchy | Multi-tenant, AlphaPi-branded, org-level | Multi-tenant, AlphaPi-branded, user-level |
| **Acquisition appeal** | HIGH — consulting firm channel is hard to build | MEDIUM — direct SaaS is commodity | LOW — marketplace is hardest to monetize |
| **Build complexity** | HIGH — white-label, RLS hierarchy, PDF branding | MEDIUM — standard SaaS | LOW — simplest auth model |
| **Solo-founder feasible?** | Difficult — requires enterprise sales | Possible — PLG can work solo | Possible — PLG can work solo |
| **Revenue timeline** | Slow (months to first deal) | Faster (self-serve possible) | Fastest (low-friction signups) |
| **Risk if channel fails** | Catastrophic | N/A (no channel dependency) | N/A |

---

### 5.3 Recommendation: Hedge with Model A primary, Model B fallback

The current plan (Model A) is the most attractive for acquisition but carries the highest execution risk and the greatest dependency on a single unvalidated assumption (A1/A4/A6). If the Armanino call invalidates the consulting firm channel, Model A collapses.

**Strategic hedge:** Design the architecture so that Model B is achievable without a rewrite. This means:
- Multi-tenant data model with organization as the primary entity (not consulting firm)
- Consulting firm as an optional parent entity that can be added later
- White-label as a configuration layer, not baked into the core
- Auth that works for direct org signup AND for firm-managed client orgs

If Model A works: add the firm hierarchy and white-label features in Stage 1.
If Model A fails: pivot to Model B (direct-to-org) by removing the firm layer and launching with AlphaPi branding.

This approach adds ~1 week of architecture planning but eliminates the risk of a full rewrite if the channel hypothesis is wrong.

---

### 5.4 Revenue model by stage

**Stage 1 (Web MVP — Month 0–4):**
- Model: Per-engagement flat fee for pilot consulting firms
- Price: $500–$2,500 per client assessment (firm pays)
- Revenue target: 2–3 paid pilots = $1,500–$7,500 total
- Purpose: Validate willingness to pay. Revenue amount is irrelevant; the signal is what matters.

**Stage 2 (SaaS V1 — Month 5–14):**
- Model: Monthly subscription per consulting firm + per-seat or per-client pricing
- Price: $300–$800/firm/month for base platform + $50–$100/client assessment
- Revenue target: 5–10 firms × $500/month avg = $2,500–$5,000 MRR
- Purpose: Demonstrate recurring revenue and consulting firm retention

**Stage 3 (Platform — Month 14–24):**
- Model: Tiered platform license + white-label premium
- Price: $1,500–$5,000/firm/month for premium tier with full white-label + API + audit log
- Revenue target: Enough to demonstrate a trajectory, not a specific number
- Purpose: Acquisition readiness

**If Model B (direct-to-org) instead:**
- Price: $99–$199/month per organization OR $499 one-time per assessment
- Revenue target: 100+ organizations in 12 months (product-led growth)
- Acquisition appeal: lower per-account value but higher volume signal

---

### 5.5 Unit economics (Model A)

| Metric | Estimate | Notes |
|---|---|---|
| CAC (consulting firm) | $500–$2,000 | Relationship sale; founder's time + demo + legal review |
| LTV per firm (12 months) | $3,600–$9,600 | $300–$800/month |
| LTV:CAC ratio | 2–5× | Acceptable but thin at lower end |
| Gross margin | 85–90% | Supabase + Vercel costs are minimal at low scale |
| Time to close | 4–8 weeks | Enterprise-ish sales cycle |
| Churn risk | HIGH | If firm does 2–3 assessments and stops, LTV drops dramatically |

**Critical risk in the unit economics:** Consulting firm engagements are project-based, not continuous. A firm may use the platform intensely for 3 months, complete their client assessments, and cancel. The subscription model only works if the firm has a steady pipeline of new clients who need governance assessments. If the firm does 5 assessments and is done, the LTV drops to $1,500–$4,000.

**Mitigation:** Re-assessment (clients should reassess annually), regulatory updates that trigger new assessments, remediation tracking that requires ongoing platform access.

---

### 5.6 The Credo AI signal

Credo AI's partner program provides the strongest market signal for Model A. Their 8-channel partner program reports 10–15× services revenue per $1 of software, meaning consulting firms earn $10–$15 in billable work for every $1 they spend on the platform. If AlphaPi can achieve even a fraction of this multiplier, the value proposition to consulting firms is clear: "Spend $500/month on our platform. Bill your clients $5,000–$7,500 per assessment engagement."

The difference: Credo AI charges $50K+ and serves Fortune 500. AlphaPi would charge $300–$800/month and serve mid-market. The question is whether the multiplier holds at the lower tier.

---

### 5.7 What was not considered and why

- **Freemium for consulting firms.** Not recommended. Consulting firms expect professional tools with SLAs, not free tiers. A free tier signals "not serious" to this buyer.
- **Revenue share model.** The firm pays nothing; AlphaPi takes a % of each client engagement fee. Attractive but unenforceable — how would AlphaPi know what the firm charges their client?
- **Marketplace with consulting firm profiles.** Organizations browse and select a consulting firm to run their assessment. Creates a two-sided marketplace problem. Far too complex for Stage 1.
- **API-only model.** Sell the scoring engine and question bank as an API that firms integrate into their own tools. Interesting but eliminates the platform value and reduces to a commodity data sale.

---

<a name="section-6"></a>
## Section 6 — Product Strategy

*Status: COMPLETE — 2026-03-21*

---

### 6.1 Vision statement

**AlphaPi makes AI governance measurable, repeatable, and actionable — at every stage of an organization's AI maturity.**

This vision holds regardless of whether the channel is consulting firms (Model A) or direct-to-org (Model B). The core value is the same: take the overwhelming challenge of "govern your AI" and reduce it to a structured, scored, actionable assessment that produces a professional output. The product serves Experimenters discovering their blind spots and Achievers proving compliance to auditors — the depth changes, but the platform doesn't become obsolete.

#### Vision statement — ideation backlog

The current statement is a working draft. The three words "measurable, repeatable, and actionable" carry most of the weight and may be the right core. The qualifier after the dash needs to communicate that AlphaPi serves the full governance journey without implying a ceiling. Candidate directions to explore:

- **Maturity-journey framing:** "...for organizations at every stage of their AI governance journey" — covers Experimenter through Achiever, implies continuous use
- **Assessment-as-mirror framing:** "...helping organizations understand their true AI risk posture and act on it" — positions the tool as an honest assessment, not a checklist
- **Continuous improvement framing:** "...so organizations can implement, measure, and continuously improve their AI governance" — implies the product grows with the customer
- **Discovery-to-compliance arc:** "...from shadow AI discovery to audit-ready compliance" — ties to the AI Discovery Agent vision (Section 9.6) and spans the full maturity curve

The right version will likely emerge after the first consulting firm conversations, when we hear how they describe the problem to their clients. Their language is more valuable than ours — they sell governance daily. Capture their phrasing and test it as vision statement language.

**Action item for future session:** Dedicate a focused ideation exercise to the vision statement after at least one consulting firm conversation. Use their language as raw material.

---

### 6.2 Strategic goals — 24-month horizon

| Goal | Metric | Timeline | Why this metric |
|---|---|---|---|
| **G1: Validate the channel** | 1+ consulting firm pays for a pilot assessment | Month 1–4 | If no firm will pay, the channel is wrong. Don't build more until this is proven. |
| **G2: Prove repeatability** | 3+ firms, 10+ client assessments completed end-to-end | Month 5–10 | One firm might be a fluke. Multiple firms with completed assessments proves the product works in real engagements. |
| **G3: Demonstrate retention** | At least 2 of the 3 pilot firms return for additional assessments or renew | Month 8–14 | One-time use means no SaaS business. Retention proves ongoing value. |
| **G4: Architecture for acquisition** | Pass a mock technical due diligence review | Month 14–18 | If the architecture can't survive scrutiny, the acquisition thesis fails regardless of traction. |
| **G5: Acquisition conversation** | 1+ serious inquiry from a named acquirer | Month 18–24 | Not a signed LOI, just a real conversation. Proves the market sees the asset as valuable. |

---

### 6.3 How we'd know Stage 1 succeeded

Stage 1 (Month 0–4) success is not "we built the MVP." Success is:

1. **At least one consulting firm completed a real client assessment using the platform.** Not a demo. Not a test. A real engagement where a real client answered real questions and the firm delivered a real report.
2. **The firm paid something.** Any amount. The number doesn't matter. The willingness to pay does.
3. **The client executive found the report useful.** Qualitative feedback: "I could present this to my board" = success. "This is interesting but not actionable" = failure.
4. **The assessment completion rate exceeded 60%.** If more than 40% of started assessments are abandoned, the product has a UX problem that must be solved before scaling.

If all four conditions are met, proceed to Stage 2. If any are not met, diagnose and iterate before adding features.

---

### 6.4 How we'd know Stage 1 failed

Stage 1 failure signals (any one triggers a strategy review):

1. **No consulting firm agrees to a paid pilot after 6 weeks of outreach.** This invalidates A1/A6. Pivot to Model B (direct-to-org).
2. **The assessment completion rate is below 30%.** This invalidates A8 (252 questions in browser). Redesign the assessment for web — potentially a "Lite" 30-question version with optional deep dive.
3. **The consulting firm says "we would never put our brand on this output."** This invalidates A10 (scoring credibility). Either rebuild the output quality or pivot to an unbranded tool.
4. **The firm wants features that would take 6+ months to build (e.g., integration with their existing CRM/GRC stack).** This indicates the product isn't viable as a standalone tool for this buyer.

---

### 6.5 Strategy constraints

These are not features — they are strategic constraints that limit what the product can become. Violating any of these means we've drifted from the strategy.

1. **Assessment-first, not monitoring-first.** AlphaPi is a point-in-time assessment tool, not a continuous monitoring platform. The moment we try to compete with OneTrust on real-time governance, we lose. Our value is: fast, scored, actionable, repeatable.
2. **Credible-enough, not perfect.** The scoring methodology must be defensible ("we weight Shadow AI at 25% because...") but does not need to be academically validated or ISO-certified. Consulting firms add their own expertise on top. The tool enables the conversation; it doesn't replace the consultant.
3. **Exit-oriented architecture.** Every architectural decision should be evaluated against: "Would an acquirer's engineering team understand this? Could they maintain it? Could they extend it?" This rules out clever shortcuts, custom frameworks, and undocumented patterns.
4. **Solo-founder-compatible scope.** If a feature can't be built, tested, and shipped by one person in a reasonable timeframe, it doesn't go into Stage 1. This is the hardest constraint to enforce because ambition will always exceed capacity.

---

<a name="section-7"></a>
## Section 7 — Product Principles & Anti-Portfolio

*Status: COMPLETE — 2026-03-21*

---

### 7.1 Product principles

These are the decision filters. When a feature request, architecture choice, or scope change arises, run it through these principles. If it violates one, it needs a strong justification to proceed.

**Principle 1: The assessment taker's time is sacred.**
Every question must earn its place. If a question doesn't change the score, change a recommendation, or surface a blind spot — delete it. 252 questions is a liability, not a feature, until proven otherwise in a web context.

**Principle 2: The output must be board-presentable without editing.**
If a consulting firm manager has to reformat, rewrite, or redesign the report before giving it to a client executive, the product has failed. The PDF is the product. The wizard is just the data collection.

**Principle 3: The consulting firm must look smarter because of us, not dependent on us.**
The firm's brand is on the output. The firm's expertise is demonstrated through the assessment. AlphaPi is invisible infrastructure. If the product makes the firm look like they're running someone else's tool, the firm will stop using it.

**Principle 4: Security is not negotiable for velocity.**
A data breach between consulting firm tenants — where Firm A sees Firm B's client data — would be an extinction event for a compliance product. RLS, auth, and data isolation are designed, tested, and reviewed before any feature work. The 120-day timeline bends here, not the security requirements.

**Principle 5: Simple is not the same as easy.**
The product should feel simple to the user (clean wizard, clear scores, actionable output). But the underlying domain is complex (252 questions, 6 dimensions, 4 maturity levels, jurisdiction-aware scoring). We absorb the complexity so the user doesn't have to. This means investing in information architecture, not just UI polish.

**Principle 6: Every feature must serve the acquisition thesis.**
If a feature doesn't make the product more attractive to an acquirer (more customers, cleaner architecture, deeper IP, broader moat), it's a distraction. The product is not a lifestyle business — it's an asset being prepared for sale.

---

### 7.2 The Anti-Portfolio — What we explicitly will NOT build

| Feature we won't build | Why not | What we'd do instead |
|---|---|---|
| **Continuous AI monitoring** | Competes with OneTrust/Credo AI on their turf at Stage 1. *Note: the AI Discovery Agent vision (Section 9.6) intentionally evolves toward continuous governance at Stage 3 — via scheduled log scans, not real-time monitoring. This anti-portfolio item applies to Stage 1–2. Revisit at Stage 3.* | Point-in-time assessments with recommended re-assessment cadence (Stage 1). Scheduled recurring scans (Stage 3). |
| **Model risk management (MRM)** | Technical ML ops tool. Different buyer (data science team), different sale. | If a client needs MRM, the consulting firm recommends a dedicated tool. |
| **Custom question authoring by firms** | Breaks scoring methodology integrity. Firms could add bad questions that produce misleading scores. | Annotation layer: firms add notes and commentary on top of standardized questions. |
| **Real-time regulatory monitoring** | Requires continuous crawling infrastructure and human review at Stage 1. *Note: the full governance loop (Section 9.6, Stage F) includes a regulatory intelligence feed that tracks framework changes and re-evaluates assessments. This is Stage 3, not Stage 1.* | Static regulatory alignment at time of assessment (Stage 1). Regulatory intelligence feed with change notifications (Stage 3). |
| **Integration with client org IT systems** | Massive scope expansion. Different security posture. Slows everything. | Manual data entry by the assessment taker. Export data via PDF/API. |
| **Benchmarking against other organizations** | Requires large anonymized dataset. Network effect that doesn't exist at launch. | Benchmark against the maturity model itself (Experimenter → Achiever scale). |
| **AI-generated recommendations (LLM calls per question)** | Per-call API costs borne by user. Unpredictable output quality. Compliance product can't have hallucinated recommendations. | Rules-based recommendations authored by domain experts. Deterministic, auditable, zero marginal cost. |
| **Mobile app** | B2B compliance assessment is a desktop activity. Nobody assesses AI governance on their phone. | Responsive web design for tablet (occasional use). Phone is out of scope. |
| **Free tier for consulting firms** | Signals "not serious." Consulting firms expect professional tools. | Free tier only if pivoted to Model B (direct-to-org). |

---

### 7.3 Scope boundaries — "Yes but not now"

These are features that belong in the product eventually but must NOT be in Stage 1:

| Feature | When | Why not now |
|---|---|---|
| Remediation roadmap builder (firm annotates inside app) | Stage 2 | Valuable but not needed for first assessment. Firms can use their own project management tools initially. |
| Re-assessment with before/after comparison | Stage 2 | Requires assessment history in the SaaS. Stage 1 may be single-assessment. |
| Subscription billing (Stripe) | Stage 2 | Stage 1 pilots are flat-fee invoiced manually. Don't build billing infrastructure for 3 customers. |
| Admin dashboard (firm owner sees all engagements) | Stage 2 | Stage 1 firm managers can see their own clients. Cross-firm admin is Stage 2. |
| Regulatory Intelligence feed | Stage 2 | The R2/Worker architecture is designed but not built. Stage 1 uses static regulatory alignment. |
| API access | Stage 3 | Acquirer feature. No one needs API access with 3 pilot firms. |
| SSO/SAML | Stage 3 | Enterprise feature. Stage 1 firms use email/password or magic link. |
| SOC-ready immutable audit log | Stage 3 | Acquirer feature. Design the schema now so it's addable, but don't build the audit infrastructure yet. |

---

<a name="section-8"></a>
## Section 8 — Opportunity Map

*Status: COMPLETE — 2026-03-21*

---

### 8.1 From actor pains to product opportunities

This section connects the actor pains identified in Sections 2–3 to concrete product opportunities. An "opportunity" is a problem space worth solving — not yet a feature. Features come in Section 9.

Opportunities are ranked by **Impact** (how much value does solving this create) × **Confidence** (how sure are we this is a real pain, not an assumed one).

---

### 8.2 Opportunity inventory

#### Tier 1 — High Impact, High Confidence (Solve in Stage 1)

**O1: "I need to run an AI governance assessment with a client and produce a professional report by Friday."**
- Actor: Consulting Firm Manager
- Pain: Currently assembles assessments manually using spreadsheets, Word docs, and internal frameworks. Takes 2–3 weeks per client. The output looks inconsistent.
- Opportunity: A platform that takes the manager from "new client" to "branded PDF report" in one session.
- Impact: HIGH — this is the core value proposition. If this doesn't work, nothing else matters.
- Confidence: HIGH — consulting firms are actively doing this work manually (RSM, Crowe, Moss Adams).

**O2: "My client needs to show their board that AI governance is being addressed."**
- Actor: Client Organization Executive
- Pain: The board asks about AI risk. The executive has no data, no score, no framework to present. They need something that looks like a real assessment, not a summary email.
- Opportunity: A board-ready report with scores, dimensions, blind spots, and prioritized recommendations — branded as coming from the consulting firm.
- Impact: HIGH — this is what the client executive pays the consulting firm for.
- Confidence: HIGH — EU AI Act enforcement drives this urgency for any organization with EU operations.

**O3: "I need to complete this assessment alongside my regular work."**
- Actor: Client Organization Manager (Assessment Taker)
- Pain: 252 questions. Full-time job already. Doesn't know who in the org has the answers to some questions. Worried about looking incompetent if they answer "no" to everything.
- Opportunity: An assessment experience designed for real-world completion: save and resume, clear progress indicators, "I don't know / need to check" option, dimension-at-a-time workflow, mobile-friendly for tablet use.
- Impact: HIGH — if the assessment taker doesn't finish, nothing else in the system works.
- Confidence: HIGH — assessment fatigue is a known problem in every compliance tool.

---

#### Tier 2 — High Impact, Medium Confidence (Validate in Stage 1, build in Stage 2)

**O4: "I need to show the client what to do about their gaps."**
- Actor: Consulting Firm Manager
- Pain: The assessment identifies gaps. The client asks "now what?" The manager needs actionable recommendations, not generic advice.
- Opportunity: Prioritized, actionable recommendations tied to each gap — with enough detail that the consulting firm can scope a follow-up engagement.
- Impact: HIGH — this is how the firm creates recurring revenue.
- Confidence: MEDIUM — the desktop app already has recommendations, but they haven't been validated with a consulting firm. The firm may want to write their own recommendations.

**O5: "I'm competing against RSM for this engagement. I need something they don't have."**
- Actor: Consulting Firm Partner
- Pain: AI governance is becoming table stakes. Multiple firms offer it. The partner needs a differentiation story.
- Opportunity: A branded platform that the partner can demo in the sales meeting — "we have a proprietary AI governance platform" (even though it's AlphaPi under the hood).
- Impact: HIGH — competitive differentiation is the primary buying motivation for the firm partner.
- Confidence: MEDIUM — depends on whether firms actually see white-label as differentiation (A4). Some may see it as a commodity.

**O6: "I need to know how we compare to other organizations in our industry."**
- Actor: Client Organization Executive
- Pain: "We scored 62 out of 100. Is that good or bad?"
- Opportunity: Industry benchmarking — even a simple "organizations like yours typically score 45–55 at the Experimenter level."
- Impact: MEDIUM — adds context but doesn't change behavior.
- Confidence: MEDIUM — requires anonymized data from multiple assessments. Not possible at Stage 1 scale.

---

#### Tier 3 — Medium Impact, Lower Confidence (Stage 2–3)

**O7: "A new regulation just passed. How does it affect my clients?"**
- Regulatory intelligence feed. Consulting firms need to proactively alert clients to regulatory changes.
- Impact: MEDIUM — useful but firms already have their own regulatory research capabilities.
- Confidence: LOW — the HITM pipeline is designed but not built. Cost and quality are uncertain.

**O8: "I need to track whether the client actually implemented our recommendations."**
- Remediation tracking. The consulting firm wants to show progress over time.
- Impact: MEDIUM — creates stickiness and recurring engagement.
- Confidence: MEDIUM — requires repeat assessments. Not validated that firms will bring clients back for re-assessment.

---

#### Tier 4 — High Impact, Stage 2–3 (AI Discovery Agent & Continuous Governance Loop)

These opportunities emerge from the AI Discovery Agent vision (Section 9.6) and the full governance loop. They are not in scope for Stage 1 but are documented here to keep the opportunity map complete and consistent with the strategic direction.

**O9: "I need to know what AI my organization is actually using — not what people think we're using."**
- Actor: Client Organization Executive, Client Organization Manager
- Pain: Shadow AI is the #1 governance risk (25% weight in scoring). Self-reported answers are unreliable. The organization doesn't know what it doesn't know.
- Opportunity: An AI discovery agent that scans existing network service logs to identify actual AI usage — services, users, volumes, authorized vs. shadow. Replaces guesswork with evidence.
- Impact: HIGH — transforms the most valuable dimension from a guess into a measurement.
- Confidence: MEDIUM — technically feasible but unbuilt. Requires log access, parsing across providers, and client environment deployment.
- Stage: 2 (prototype), 3 (productized)

**O10: "Show me what we were missing and how to fix it."**
- Actor: Client Organization Executive, Consulting Firm Manager
- Pain: After the discovery scan reveals blind spots, the client needs specific guidance — not generic recommendations, but "here's how to enable AI traffic logging in your Azure AD / Okta / AWS, and here's what you need to do about what we found."
- Opportunity: The two-scan pattern (scan 1 = before picture, enablement guide, scan 2 = after picture) combined with regulation-aware remediation recommendations. Every finding comes with specific actions tied to the applicable regulatory framework (EU AI Act article, NIST AI RMF section, ISO 42001 clause).
- Impact: HIGH — the delta between scan 1 and scan 2 is the proof of value. Remediation recommendations tied to specific regulations make the consulting firm's engagement defensible.
- Confidence: MEDIUM — the two-scan pattern is a strong product concept. The regulatory mapping requires ongoing maintenance as frameworks evolve.
- Stage: 2 (two-scan pattern + single-source enablement guide), 3 (multi-source + regulation-aware recommendations)

**O11: "I need a dashboard that shows our board our AI risk posture and what we've done about it."**
- Actor: Client Organization Executive
- Pain: The board asks "where do we stand on AI governance?" quarterly. The executive needs a live view, not a static PDF from 6 months ago.
- Opportunity: An executive dashboard showing: current risk posture, risks identified, remediation actions assigned, actions completed, actions outstanding, trend over time. Updated automatically after each scan cycle. Board-ready at any moment.
- Impact: HIGH — this is the "always-on" version of O2 (board-ready report). The PDF is a snapshot; the dashboard is a living view.
- Confidence: MEDIUM — technically straightforward (it's a dashboard of data the system already has). Business confidence depends on whether executives want a dashboard or prefer periodic reports. Some will want both.
- Stage: 2 (read-only, shows assessment + scan results), 3 (full tracking with remediation status and trend)

**O12: "A new regulation just passed — and I need to know if we're still compliant."**
- Actor: Consulting Firm Manager, Client Organization Executive
- Pain: Regulatory landscape changes constantly. The EU AI Act takes effect August 2026. Colorado AI Act in June 2026. New state-level legislation is emerging. The client's assessment was compliant last quarter — is it still compliant today?
- Opportunity: A regulatory intelligence feed that tracks AI governance frameworks globally. When a regulation changes or a new one takes effect, the system re-evaluates existing assessments and scan results against the new requirements. Clients get proactive notifications with specific impact analysis and recommended actions.
- Impact: HIGH — this creates the "never done" loop. Every regulatory change triggers re-assessment, which triggers new scan cycles, which generates revenue.
- Confidence: LOW — the HITM pipeline was designed but never built. Regulatory tracking at this level requires either a curated data source or a reliable automated crawling + classification system. Cost and quality are uncertain.
- Stage: 2 (research + framework catalog), 3 (automated feed with change notifications and re-assessment triggers)

---

### 8.3 Opportunity prioritization by stage

Based on Impact × Confidence, Stage 1 must solve O1, O2, and O3. These three opportunities together form the minimum viable product:

```
Stage 1 MVP:
  O1 (Run assessment → produce report)
  + O2 (Board-ready branded output)
  + O3 (Assessment experience that people actually complete)

Stage 2 additions:
  + O4 (Actionable recommendations — full customization)
  + O5 (White-label differentiation)
  + O9 (AI Discovery Agent — prototype, single source)
  + O10 (Two-scan pattern + enablement guides)
  + O11 (Executive dashboard — read-only)
  + O12 (Regulatory intelligence — research + catalog)

Stage 3 — full governance loop:
  + O6 (Industry benchmarking — requires aggregated data)
  + O9 (Discovery agent — multi-source, productized)
  + O10 (Remediation engine — regulation-aware recommendations)
  + O11 (Executive dashboard — full tracking + trend)
  + O12 (Regulatory feed — automated + re-assessment triggers)
  + O8 (Remediation tracking over time)
```

O4 (actionable recommendations) is likely needed for Stage 1 but can ship in a simpler form — the desktop app's rules-based recommendations, ported. Full customization is Stage 2.

O5 (firm differentiation through white-label) is the channel thesis. It's included in Stage 1 as a core feature.

O7 (regulatory intelligence as a consulting firm alert tool) is absorbed into O12, which is the broader and more complete version.

Everything beyond O1–O3 is Stage 2+. The full governance loop (O9–O12) is the long-term product vision that transforms AlphaPi from an assessment tool into a continuous AI governance platform.

---

<a name="section-9"></a>
## Section 9 — Feature Discovery & Requirements

*Status: COMPLETE — 2026-03-21*

---

### 9.1 From opportunities to features

Features are derived from opportunities, not invented. Each feature below traces back to a specific opportunity and a specific actor's job-to-be-done.

---

### 9.2 Stage 1 feature set — derived from O1 + O2 + O3

#### F1: Consulting Firm Onboarding (serves O1, O5)
**What:** Firm admin creates an account. Sets firm name, logo, and primary color. These propagate to all client reports.
**Actor:** Consulting Firm Partner / Manager
**Acceptance:** A new firm can be set up and ready to create clients in under 10 minutes.
**Depends on:** Auth system (A22), white-label configuration storage

#### F2: Client Profile Management (serves O1)
**What:** Firm manager creates a client organization profile within the firm's account. Fields: org name, industry, size, regions, maturity level, AI use cases.
**Actor:** Consulting Firm Manager
**Acceptance:** Create, view, archive client profiles. Each client's data is isolated from other clients and other firms.
**Depends on:** Multi-tenant data model (Section 10), RLS policies

#### F3: Assessment Wizard — Web Port (serves O1, O3)
**What:** The 9-step guided assessment from the desktop app, ported to the web. Welcome → Org Profile (pre-filled from F2) → 6 Dimensions → Results.
**Actor:** Client Organization Manager (assessment taker)
**Acceptance:**
- Questions load correctly for the selected maturity level and jurisdiction
- Save and resume works across sessions (browser close + reopen)
- Progress is visible at all times (dimension progress bar + overall %)
- "I don't know / need to check" option available for every question
- Each dimension can be completed independently (no forced linear order)
**Critical design decision:** Do we keep 252 questions or offer a "Lite" version? Consulting firm feedback (see A8) will inform this. Default for Stage 1: keep the full set but with stronger UX scaffolding (estimated time per dimension, progress celebration, smart save). If early feedback says it's too long, add a Lite version as a fast-follow.

#### F4: Scoring Engine — Web Port (serves O1, O2)
**What:** The weighted scoring algorithm from `src/utils/scoring.ts`, ported directly. Produces overall score, dimension scores, blind spots, and recommendations.
**Actor:** System (no UI for this — it's computation)
**Acceptance:** Given the same inputs, the web scoring engine produces identical outputs to the desktop scoring engine. Zero tolerance for scoring drift.
**Effort:** LOW — pure TypeScript, no Tauri dependencies. Copy and test.

#### F5: Results Dashboard (serves O1, O2)
**What:** Scores, dimension breakdown, blind spots, risk gauge, radar chart. Consulting firm manager can view before generating the report.
**Actor:** Consulting Firm Manager, Client Organization Executive (if given access)
**Acceptance:** All scores visible. Blind spots ranked by severity. Recommendations listed with priority and timeline. No gating (everything visible — this is a B2B platform, not freemium).

#### F6: PDF Report with Firm Branding (serves O2, O5)
**What:** Multi-page PDF export: cover page (firm logo + client name), executive summary, dimension scores, blind spots, recommendations, implementation roadmap.
**Actor:** Consulting Firm Manager (generates), Client Organization Executive (reads)
**Acceptance:**
- Firm logo, name, and colors appear on every page
- Cover page looks like the consulting firm produced it, not AlphaPi
- Executive summary is understandable by a non-technical executive
- Report can be presented to a board without editing
- AlphaPi brand appears only in a small footer credit (or not at all, per firm preference)

#### F7: Authentication & Authorization (serves all)
**What:** Firm-level auth with role-based access. Roles: firm admin, firm manager, client viewer (optional).
**Actor:** All
**Acceptance:**
- Firm admin can invite firm managers
- Firm managers can create and manage clients within their firm only
- No user in Firm A can see, access, or infer the existence of data in Firm B
- Client org users (if invited) can only access their own assessment
- Password reset, email verification, session management

#### F8: Data Isolation (serves all — non-negotiable)
**What:** Supabase RLS policies ensuring complete data isolation between firms and between clients within a firm. This is not a feature — it's a security requirement.
**Actor:** System
**Acceptance:**
- Penetration test: a logged-in user of Firm A cannot access any data belonging to Firm B by manipulating API requests, URLs, or client-side state
- RLS policies cover every table, including join tables and metadata
- Security review completed before first external user

---

### 9.3 Features explicitly excluded from Stage 1

| Feature | Why excluded | When it comes |
|---|---|---|
| Subscription billing | 3 pilot firms can be invoiced manually | Stage 2 |
| Firm admin dashboard (cross-client analytics) | Not needed for pilots. Manager sees their own clients. | Stage 2 |
| Re-assessment with comparison | Requires assessment history storage. Pilots are first-time assessments. | Stage 2 |
| Remediation tracker | Consulting firms use their own PM tools initially. | Stage 2 |
| Regulatory intelligence feed | HITM pipeline not built. Static regulatory alignment in scoring is sufficient. | Stage 2 |
| Client self-service signup | Stage 1 clients are onboarded by the consulting firm manager. | Stage 2 (Model B pivot only) |
| API access | No consumer for an API at 3 pilot firms. | Stage 3 |
| SSO/SAML | Enterprise auth feature. Email/password + magic link for Stage 1. | Stage 3 |
| Audit log (immutable, SOC-ready) | Acquirer feature. Schema is designed now. Implementation is later. | Stage 3 |
| DOCX export | PDF is sufficient for consulting firm delivery. | Stage 2 |
| AI-generated executive summary (BYOK Claude) | Rules-based exec summary first. AI narrative is a Pro feature later. | Stage 2 |

---

### 9.4 The "Lite Assessment" question

The desktop app has 252 questions (63 per maturity profile × 4 profiles). With the dimension-selective UX, the length concern is largely resolved: each dimension has approximately 10 questions and takes less than 5 minutes to complete. The full assessment across all 6 dimensions takes under 30 minutes. Questions are adaptive based on maturity profile, so users only see questions relevant to their stage.

The original concern about "too long" assumed a forced linear walk through all questions. The dimension-selective approach changes the dynamic: a consulting firm can run a single dimension as a quick win (under 5 minutes) or the full assessment for a complete governance picture (under 30 minutes). The first consulting firm call should validate how they would use this flexibility.

A standalone Lite Assessment (curated 30-question subset spanning all dimensions) may still have value as a lower-tier product offering or lead-generation tool. This is deferred as a future enhancement (see Section 12.3).

**Stage 1 default:** Build the full assessment with dimension-selective UX. Users choose which dimensions to assess first and can return for the rest. The goal is all 6 for a complete governance picture.

---

### 9.5 The Actor 5 problem — making the assessment valuable for the person doing the work

The person answering the questions (Actor 5: Client Organization Manager) bears 100% of the labor and gets the least direct value. The executive gets a board-ready report. The consulting firm gets a billable engagement. AlphaPi gets a reference customer. The person sitting through 252 questions gets... more work (remediation follow-up).

This is a product design problem that goes beyond "make it shorter." It asks: **how do we make the assessment experience itself valuable to the person completing it?**

#### Ideas on the table (not yet validated, not yet scoped)

**Idea 1: User-selected dimension ordering.** Let the respondent choose which dimension to answer first. They can focus on what they care about, skip around, and build momentum on familiar territory before tackling harder topics. This gives the user agency over the experience instead of forcing a linear march through 252 questions. *Design implication:* each dimension must be self-contained — no question in Dimension 3 can depend on an answer from Dimension 1.

**Idea 2: Maturity-adaptive lighter paths.** Instead of one monolithic 252-question assessment, tie the assessment depth to where the organization is on its governance journey. An Experimenter doesn't need Achiever-level questions — they need to understand their baseline. A Builder needs depth in the dimensions where they're actively investing. This isn't just "Lite vs. Full" — it's "the right questions for where you are right now." *Design implication:* the maturity profile selection at the start of the assessment becomes a genuine routing decision, not just a label. The desktop app already has 4 question banks (Experimenter, Builder, Innovator, Achiever) — but all 4 banks are the same length (63 questions). A maturity-adaptive path could mean Experimenter gets 30 questions, Builder gets 45, Innovator gets 60, Achiever gets 63.

**Idea 3: Immediate per-dimension feedback.** Don't make the respondent wait until the end for value. After completing each dimension, show them a mini-result: their dimension score, top blind spot for that dimension, and one concrete action they could take. Each dimension takes under 5 minutes, so this turns the assessment into six quick loops of effort followed by reward. *Design implication:* the scoring engine must support per-dimension scoring mid-assessment, not just full-assessment scoring at the end.

**Idea 4: Personal governance learning.** Position the assessment as a learning experience, not just a data collection exercise. Each question could include a brief "why this matters" tooltip. After each dimension, surface one insight: "Organizations in your industry typically score X on this dimension — here's why." This gives the respondent knowledge they can use in their job, independent of what the consulting firm or executive does with the report. *Design implication:* requires benchmark data (even if synthetic/estimated initially) and educational microcopy per question.

**Idea 5: Respondent-specific output.** Give Actor 5 their own deliverable — not the executive report, but a personal summary: "Here are the 3 things you can do this week to improve your organization's AI governance posture, based on your answers." The executive gets the board report. The respondent gets an action list they can own. *Design implication:* a second output template targeting a different audience than the PDF report.

#### What this section is NOT

This is not a feature spec. These are product hypotheses about how to solve the Actor 5 value problem. They need to be evaluated against the product principles (Section 7), prioritized against the MVP scope (Section 12), and validated with real users. Some may be Stage 1. Most are Stage 2+. The point is to capture the thinking now so it informs design decisions rather than getting lost.

#### Open ideation space

The ideas above are a starting point. The Actor 5 problem is rich enough that there are likely dozens of approaches we haven't considered — gamification, collaborative assessment (multiple respondents per dimension), AI-assisted question skipping based on prior answers, progress benchmarking against anonymized peers, certification/badge on completion, and more. This is a deliberate ideation backlog. When Stage 1 is built and pilots are running, this section becomes the source material for Stage 2 UX improvements.

---

### 9.6 The AI Discovery Agent — from self-reported assessment to evidence-based governance

**The core insight:** The Shadow AI dimension (25% weight — the heaviest in the scoring model) currently relies on self-reported answers. But the whole point of Shadow AI is that organizations *don't know what they don't know.* Asking "do you have an inventory of AI tools in use?" produces a guess, not a fact. An AI agent that scans network service logs could replace guesswork with evidence.

#### What this could be

An agent (deployed on-premise or given read access to cloud service logs) that analyzes network service logs — not traffic, but service-level logs (SaaS admin consoles, SSO logs, API gateway logs, cloud provider audit trails) — to identify:

- Which AI services are being called (OpenAI, Anthropic, Google AI, Azure OpenAI, Hugging Face, etc.)
- Which internal users or service accounts are calling them
- What volume and frequency of usage exists
- Whether usage is authorized (mapped to a known inventory) or shadow (unaccounted for)
- Which data classification levels are potentially flowing to external AI services

This is not a network traffic sniffer or a DLP tool. It's a log-level discovery agent that reads what the organization's systems already record and surfaces AI-specific patterns.

#### Why this matters strategically

**For the product:** This transforms AlphaPi from "a questionnaire that produces a score" to "a platform that discovers your actual AI posture and then helps you govern it." The assessment becomes the *starting point*, not the whole product. Discovery feeds the assessment, the assessment identifies gaps, remediation closes gaps, re-discovery confirms closure. That's a continuous governance loop, not a one-time engagement.

**For the consulting firm channel:** This is the kind of capability a consulting firm cannot build themselves in a reasonable timeframe. Questions are easy to write. A log-scanning AI agent with pattern recognition across dozens of AI service signatures is hard. This directly addresses assumption A6 (will firms build their own?) — they'll build questionnaires, but they won't build discovery agents.

**For acquisition:** An AI discovery agent with a library of detection signatures is defensible IP. Acquirers can't replicate it from a PDF export. This moves the competitive moat from "we have good questions" (weak moat) to "we have an automated discovery engine" (strong moat).

**For Actor 5:** Instead of answering 252 questions about what AI tools they think the organization uses, the agent shows them what's actually happening. The assessment then becomes a conversation about the *implications* of known usage, not a guessing game about *whether* usage exists. This directly solves the "I don't know what I don't know" problem in the most valuable dimension.

#### The tokenized revenue model

The discovery agent isn't just a feature — it's a **revenue primitive**. Unlike the assessment (which is a one-time event per engagement), the agent runs continuously or periodically. Every scan cycle consumes compute and delivers fresh value: new AI services detected, usage patterns changed, shadow AI posture updated.

This enables a usage-based pricing model at the unit of work:
- **Per scan cycle:** The agent runs weekly/monthly. Each cycle is a billable event.
- **Per log source connected:** More data sources = more coverage = higher price. A client scanning 3 log sources pays less than one scanning 15.
- **Per token processed:** If the agent uses LLM inference to classify ambiguous log patterns (e.g., "is this API call to an AI service or a standard REST endpoint?"), the inference cost becomes a pass-through with margin.

**Why this matters strategically:**

The assessment tool has a churn problem baked in (Section 5.5 — a firm does 5 assessments and cancels). The discovery agent solves this because it scales with the customer's AI footprint, not their assessment calendar. As an organization adopts more AI services, the agent scans more, finds more, and costs more — revenue grows with the customer's AI maturity, not with their headcount or seat count.

For the consulting firm channel: the agent creates a continuous monitoring engagement. The firm doesn't just run an assessment once — they run the agent monthly and review findings with the client quarterly. That's recurring advisory revenue for the firm, which makes the platform stickier and increases LTV.

For acquisition: usage-based revenue with natural expansion (more AI = more scans = more revenue) is a more attractive metric than seat-based subscriptions with flat growth. This is the kind of revenue model that GRC platforms (LogicGate, Drata) are moving toward.

**Pricing model sketch (Stage 3, not committed):**
- Base platform fee (assessment + dashboard): $300–$800/firm/month (same as current model)
- Discovery agent add-on: $0.01–$0.05 per log event processed, or $200–$1,000/client/month flat rate per connected environment
- Premium tier: real-time alerting when new shadow AI is detected — priced at the client level, not the firm level

This pricing model is speculative and needs validation. But it illustrates why the agent is not just a better product — it's a better business.

#### The liability boundary — log analysis, not network crawling

This is the most critical architectural decision for the discovery agent, and it must be locked before any design work begins.

**What the agent does:** Reads existing logs that the client's systems have already produced. SaaS admin consoles, SSO sign-in logs, API gateway logs, cloud provider audit trails. These logs already exist. The agent is an analyst of records the organization chose to create.

**What the agent does NOT do:** Crawl, sniff, intercept, or monitor network traffic. The moment the agent sees raw network traffic, AlphaPi becomes liable for everything that traffic contains — PII, credentials, health records, financial data, trade secrets. One accidental exposure puts AlphaPi in HIPAA/GDPR/SOX territory with data it never needed and never wanted. This is a company-ending liability for a governance product.

**The "blind spot as a finding" pattern:** If AI traffic isn't visible in the client's existing logs, the agent doesn't start sniffing for it. Instead, it produces a governance finding: "Your current logging configuration has no visibility into AI service API calls. Here's how to enable it." The agent then tells the client which specific toggles to enable — Azure AD conditional access logging, AWS CloudTrail API event logging, Google Workspace admin audit logs, etc. The client enables the logging themselves. The next scan cycle picks it up.

This is a governance recommendation, not an infrastructure service. It keeps AlphaPi in the advisory lane (aligned with the consulting firm channel) and out of the security tooling lane (where Netskope, Zscaler, and Wiz live).

**Data flow architecture principle:** Logs are processed in the client's environment. The agent produces a structured summary (AI services detected, usage volumes, authorized vs. shadow classification) and only that summary leaves the client's environment. Raw logs never touch AlphaPi's infrastructure. This is the same architectural pattern used by on-prem security scanners (Qualys, Tenable) — process locally, report centrally.

#### Risks and considerations

**Scope creep:** This is a different product category (AI discovery/CASB-adjacent) from the assessment tool. Building it prematurely could derail the core product. It needs to be a deliberate Stage 2 or Stage 3 initiative, not a Stage 1 distraction.

**Competitive positioning shift:** This moves AlphaPi into territory adjacent to Orca Security, Wiz, and CASB tools (Netskope, Zscaler) — all of which are well-funded. The differentiation is that AlphaPi's agent is purpose-built for AI governance, not general cloud security. The agent doesn't replace their tools — it answers a specific question ("what AI is being used and is it governed?") that their tools don't focus on.

**Build complexity:** An agent that reliably parses logs from dozens of cloud services, SSO providers, and API gateways is a significant engineering effort. It's not a weekend project. It would likely require a dedicated hire or contractor with security engineering experience.

**Log format fragmentation:** Every cloud provider, SaaS platform, and SSO system produces logs in a different format. Azure AD logs look nothing like AWS CloudTrail logs. The agent needs a parsing layer per source. This is the real engineering cost — not the analysis, but the normalization.

**Client enablement burden:** If the client's logging isn't configured to capture AI traffic, the agent can't find what isn't recorded. But this is a feature, not a limitation — see the two-scan pattern below.

#### The two-scan pattern — the "before and after" that sells itself

The discovery agent's most powerful sales moment isn't the first scan. It's the delta between scan 1 and scan 2.

**Scan 1 ("the before picture"):** Run the agent against the client's existing logs as-is. Whatever their current logging configuration captures, scan it. The output is two things: (1) what AI usage is already visible — services, users, volumes, and whether it's authorized or shadow; (2) what the client *can't* see — specific blind spots in their logging configuration with concrete enablement instructions.

**The enablement guide:** For every blind spot found, the agent produces a step-by-step guide specific to the client's environment: "Your Azure AD conditional access policy doesn't log app-level sign-ins. Here's how to enable it: Settings → Conditional Access → [specific steps]. Your AWS CloudTrail is set to management events only. Here's how to add data events for Bedrock and SageMaker: [specific steps]. Your Okta system log doesn't capture API token usage for third-party AI integrations. Here's how to enable it: [specific steps]."

These aren't generic best-practice documents. They're generated from the scan results — the agent knows what's missing because it looked and didn't find it. The consulting firm delivers this as a remediation workstream: "We scanned your environment. Here's what we found. Here's what you're blind to. Let us help you close the gaps."

**Scan 2 ("the after picture"):** After the client enables the recommended logging, run the agent again. The delta between scan 1 and scan 2 is the proof of value: "Before our engagement, you had visibility into 3 AI services. After enabling the logging we recommended, you now have visibility into 14 AI services — 11 of which were shadow AI your organization didn't know about."

That delta is a board-presentable finding. It's the kind of result a CIO shows to the audit committee. And it directly feeds back into the AlphaPi assessment — the Shadow AI dimension score changes from a self-reported guess to an evidence-backed measurement.

**Why this pattern matters commercially:**
- **For the consulting firm:** Scan 1 + enablement guide + scan 2 is a multi-phase engagement. That's 3 billable touchpoints from a single tool, not 1.
- **For the client:** The before/after is undeniable proof of value. They can see exactly what they were missing.
- **For AlphaPi:** Two scans per engagement means twice the token/cycle revenue. And the enablement guide is reusable IP — the instructions for enabling Azure AD AI logging are the same across clients, but the scan results that trigger them are unique.
- **For retention:** After scan 2, the natural question is "what happens when new AI services appear?" The answer is scan 3, scan 4, scan 5 — continuous monitoring. The client is now on a recurring scan cycle.

#### The full governance loop — discover, assess, recommend, track, monitor

The discovery agent as described above is phase 1 of a larger product vision. The complete picture is a six-stage continuous governance loop:

**Stage A — Discover:** The agent scans existing logs, identifies AI services in use, and classifies them as authorized or shadow. Produces the "before picture" and the enablement guide. This is the two-scan pattern described above.

**Stage B — Assess:** The existing AlphaPi assessment, but now informed by real discovery data. Instead of asking "do you have an inventory of AI tools?" and getting a guess, the Shadow AI dimension is pre-populated with evidence from the agent. The assessment taker confirms or annotates the findings rather than starting from scratch. This collapses the weakest part of the assessment (self-reported Shadow AI answers) into the strongest (evidence-backed findings).

**Stage C — Recommend:** The agent doesn't just find problems — it tells the organization how to fix them. Each finding comes with specific remediation guidance tied to the applicable regulatory framework(s). "You have 3 employees using an unauthorized AI transcription service. Under the EU AI Act Article 26, this constitutes unmonitored AI deployment. Recommended actions: (1) add the service to your AI inventory, (2) conduct a data classification review of what's being transcribed, (3) establish an acceptable use policy that covers this category." The recommendations are regulation-aware — they cite the specific framework requirement, not just generic best practice.

**Stage D — Track:** An executive dashboard that displays the organization's AI risk posture in real time. The executive sees: initial risks identified, remediation actions assigned, actions completed, actions outstanding, current risk level vs. target risk level, trend over time. This is the board-ready view — the CIO opens it before an audit committee meeting and sees exactly where the organization stands. The consulting firm also sees this dashboard for their client, which gives them visibility into engagement progress without calling the client.

**Stage E — Monitor:** Once the initial risks are addressed (or accepted at a tolerable level), the agent transitions to scheduled recurring scans — weekly, monthly, or quarterly depending on the client's risk appetite and regulatory requirements. Each scan cycle checks: has new shadow AI appeared? Has usage volume changed on known services? Have previously remediated issues resurfaced? Is the organization still in compliance with the regulatory frameworks it targets? New findings trigger new recommendations. The cycle continues.

**Stage F — Regulatory intelligence:** The system maintains a current map of AI regulation bodies and their requirements — EU AI Act, NIST AI RMF, ISO 42001, Colorado AI Act, state-level emerging legislation, sector-specific guidance (HIPAA + AI, SEC + AI, etc.). When a regulation changes or a new one takes effect, the system re-evaluates existing assessments and scan results against the new requirements. Clients get notified: "The EU AI Act Article 6 high-risk classification was updated on [date]. Based on your last scan, 2 of your AI deployments may now fall under the high-risk category. Recommended action: [specific guidance]." This is the HITM (Human-in-the-Middle) pipeline originally designed for the desktop app (referenced in TODOS.md as P1) — now productized as a continuous regulatory feed that drives recurring assessment and scan cycles.

**Why this loop matters:**

The assessment tool alone (Stage 1) is a one-time event. The discovery agent alone (two-scan pattern) is a short engagement. But the full loop — discover → assess → recommend → track → monitor → regulatory update → re-assess — is a **permanent relationship** between AlphaPi, the consulting firm, and the client organization. The client never "graduates" out of the product because AI governance is never done. New AI services appear. New regulations take effect. New risks emerge. The loop runs continuously.

For the consulting firm, this transforms a one-time assessment engagement into an ongoing advisory retainer: "We run the platform, review findings quarterly with you, and keep your governance posture current." That's the stickiest possible revenue model.

For acquisition, this is the difference between acquiring an assessment tool (a feature) and acquiring a continuous governance platform (a product category). The full loop is what Tier 2 players (LogicGate, Vanta, Drata) are trying to build. Delivering it before they do is the competitive thesis.

#### Staging recommendation

- **Stage 1:** Not in scope. The assessment tool is the product. But the data model should be designed to accommodate scan results and remediation tracking in future stages without schema rewrites.
- **Stage 2:** Discovery agent prototype. Scan one log source (e.g., Azure AD). Build the enablement guide generator. Test the two-scan pattern with a pilot firm. Build the executive dashboard in read-only mode (shows assessment results and initial scan findings). Begin regulatory intelligence research — catalog the major frameworks and their machine-readable requirements.
- **Stage 3:** Full loop. Multi-source scanning. Remediation recommendation engine with regulatory framework citations. Executive dashboard with tracking (risks → actions → completion → trend). Scheduled recurring scans with tokenized pricing. Regulatory intelligence feed with change notifications. Integration between discovery findings and assessment scoring engine.

This is captured here as a strategic product direction, not a commitment. It needs its own feasibility assessment, architecture design, and business case before any engineering investment. But the vision is clear: AlphaPi starts as an assessment tool and evolves into a continuous AI governance platform. The consulting firm channel makes this possible because the firm is the ongoing relationship — they run the loop with their clients on behalf of AlphaPi.

---

<a name="section-10"></a>
## Section 10 — Data Model & Architecture Implications

*Status: COMPLETE — written 2026-03-23*

This section does not design the architecture — that's a dedicated architecture session before any code is written (see Session 59 Recovery Doc: "Do NOT start Cursor until architecture session is complete"). What this section does is capture the product-level decisions that constrain the architecture, flag the security requirements that are non-negotiable, and identify the trade-offs the architecture session must resolve.

---

### 10.1 The multi-tenancy model

AlphaPi is a B2B2B product. The data hierarchy is:

```
AlphaPi (platform)
  └─ Consulting Firm (tenant)
       └─ Manager (user — firm employee)
            └─ Client Organization (assessment container)
                 └─ Assessment (one per engagement)
                      ├─ Organization Profile
                      ├─ Responses (per question)
                      ├─ Dimension Scores
                      ├─ Blind Spots
                      └─ Recommendations
```

Every table must enforce tenant isolation at the database level — not the application level. This means Supabase Row-Level Security (RLS) policies on every table, with no exceptions. Application-level checks are defense in depth, not the primary boundary.

**Key constraint:** A consulting firm manager should never be able to see, access, or infer the existence of another firm's data — even through metadata queries, counts, or timing attacks.

---

### 10.2 Authentication hierarchy

Stage 1 requires three distinct actor types with different permissions:

| Actor | Auth method | What they can do | What they cannot do |
|---|---|---|---|
| AlphaPi Admin (Balt) | Email/password + MFA | Full platform access, create firms, view aggregate metrics | Impersonate users without audit trail |
| Firm Manager | Email/password or magic link | Create clients, run assessments, view all clients in their firm, export PDFs | See other firms, modify scoring, access platform admin |
| Client Contact (Stage 2) | Magic link invite | View their own assessment results | See other clients, run new assessments, modify anything |

Stage 1 only needs the first two roles. Client Contact is a Stage 2 feature — but the auth schema must be designed now to accommodate it without migration pain.

**Decision for architecture session:** Whether to use Supabase Auth's built-in role system, a custom `roles` table with RLS, or a hybrid approach. Each has trade-offs around flexibility vs. complexity.

---

### 10.3 The RLS security imperative

Supabase RLS is the correct tool for tenant isolation in Stage 1, but it carries documented risk. CVE-2025-48757 and publicly reported cases of 170+ applications exposed through misconfigured RLS policies establish that RLS is easy to get wrong.

**Non-negotiable requirements before any external user touches the system:**

1. Every table has an RLS policy. No exceptions. Tables without policies are blocked by default (`ALTER DEFAULT PRIVILEGES` — deny all).
2. RLS policies are tested with a dedicated pen-test script: logged-in user of Firm A attempts to read, write, update, and delete data belonging to Firm B via direct Supabase API calls (bypassing the application layer).
3. Join tables and metadata tables are covered — not just the primary data tables.
4. The `service_role` key is never exposed to the client. All client-side Supabase calls use the `anon` key with RLS enforced.
5. Supabase Edge Functions (if used) must pass the user's JWT — never the service key — to database calls.

**Architecture session must resolve:** Schema-per-tenant vs. shared-schema-with-RLS. For Stage 1 with 2–3 firms, shared schema with RLS is sufficient and dramatically simpler. Schema-per-tenant becomes relevant only if an acquirer demands it for SOC compliance at Stage 3.

---

### 10.4 Data model — core entities (product-level)

These are the entities the product needs. The architecture session will normalize them into a proper database schema with foreign keys, indexes, and RLS policies.

**Firms table:** `id`, `name`, `slug` (subdomain), `brand_colors`, `logo_url`, `created_at`, `is_active`

**Users table:** `id`, `firm_id` (FK), `email`, `role` (admin | manager | client_contact), `created_at`, `last_login`

**Clients table:** `id`, `firm_id` (FK), `created_by` (FK → users), `organization_name`, `industry`, `size`, `region`, `created_at`, `archived_at`

**Assessments table:** `id`, `client_id` (FK), `firm_id` (FK — denormalized for RLS performance), `status` (draft | in_progress | complete), `maturity_profile`, `started_at`, `completed_at`, `assessment_version`

**Responses table:** `id`, `assessment_id` (FK), `firm_id` (FK — denormalized for RLS), `question_id`, `value`, `responded_at`

**Results table:** `id`, `assessment_id` (FK), `firm_id` (FK — denormalized for RLS), `dimension_scores` (JSONB), `overall_score`, `risk_level`, `blind_spots` (JSONB), `recommendations` (JSONB), `computed_at`

**Audit log table (schema only — Stage 3 implementation):** `id`, `firm_id`, `user_id`, `action`, `entity_type`, `entity_id`, `payload` (JSONB), `created_at`. Design it now. Populate it later. This is an acquirer expectation.

**Discovery scan configurations table (schema only — Stage 2 implementation):** `id`, `client_id` (FK), `firm_id` (FK — denormalized for RLS), `scan_type` (log_analysis | scheduled_recurring), `log_sources` (JSONB — array of configured sources, e.g., Azure AD, AWS CloudTrail, Okta), `schedule` (cron expression for recurring scans), `enabled_at`, `disabled_at`, `created_by` (FK → users), `created_at`. This table defines *what* to scan and *how often*. One client may have multiple scan configurations (one per log source or one combined). Design it now so the architecture session plans the foreign key relationships and RLS policies alongside the Stage 1 schema.

**Discovery scan results table (schema only — Stage 2 implementation):** `id`, `scan_config_id` (FK), `client_id` (FK), `firm_id` (FK — denormalized for RLS), `scan_number` (integer — enables the two-scan pattern: scan 1 = baseline, scan 2 = delta), `status` (queued | running | complete | failed), `started_at`, `completed_at`, `ai_tools_detected` (JSONB — array of detected tools with usage metadata), `unmonitored_sources` (JSONB — log sources where AI traffic logging was not enabled), `token_count` (integer — for tokenized billing), `summary` (JSONB — aggregated findings for dashboard display), `raw_output_url` (text — reference to stored raw scan output in Supabase Storage). This is the core output of the AI Discovery Agent (Section 9.6). The two-scan pattern (baseline → enablement guide → delta scan) is the primary revenue driver for recurring scans.

**Remediation actions table (schema only — Stage 2/3 implementation):** `id`, `client_id` (FK), `firm_id` (FK — denormalized for RLS), `assessment_result_id` (FK → results, nullable), `scan_result_id` (FK → discovery scan results, nullable), `title`, `description`, `priority` (critical | high | medium | low), `status` (open | in_progress | resolved | accepted_risk), `assigned_to` (text — name or role, not a user FK since the assignee may not be a platform user), `evidence_url` (text — link to documentation or screenshot proving resolution), `due_date`, `resolved_at`, `created_at`. This table powers the executive dashboard (Section 9.6E) — tracking the journey from identified risk to resolution or accepted risk. Both assessment recommendations and discovery scan findings feed into this table, creating a unified remediation view. **Design note:** This uses two nullable FKs instead of a polymorphic `source_type` + `source_id` pattern. Polymorphic foreign keys cannot carry true database-level FK constraints, which means referential integrity depends entirely on application code — a liability during acquirer due diligence and a source of orphaned rows over time. Two nullable FKs let Postgres enforce the references natively. A CHECK constraint (`assessment_result_id IS NOT NULL OR scan_result_id IS NOT NULL`) ensures every remediation action has at least one source. If a third source type emerges (e.g., regulatory alert), a third nullable FK is cleaner than retrofitting a polymorphic pattern after data already exists.

**Regulatory frameworks table (schema only — Stage 3 implementation):** `id`, `framework_name` (e.g., EU AI Act, NIST AI RMF, ISO 42001), `version`, `effective_date`, `requirements` (JSONB — structured array of individual requirements with IDs, text, and mapping to AlphaPi dimensions), `last_updated_at`, `source_url`. This table supports the regulatory intelligence feed (Section 9.6F — the HITM pipeline). It stores structured representations of regulatory frameworks so the platform can map assessment results and discovery findings to specific compliance requirements. An acquirer expectation for any GRC platform.

The `firm_id` denormalization on Responses and Results is intentional — it allows RLS policies to filter directly on the firm_id column without joining through Assessments → Clients, which would create performance problems at scale and complex RLS policy expressions.

---

### 10.5 White-label architecture constraints

Stage 1 white-label is skin-only: consulting firm logo + brand colors on the PDF output and the assessment interface. This requires:

1. **Subdomain routing:** `armanino.alphapi.app`, `rsm.alphapi.app`. Next.js middleware resolves the subdomain to a firm record and injects brand config into the request context.
2. **CSS variable theming:** Brand colors stored in the Firms table are injected as CSS custom properties at the layout level. No per-firm CSS files, no build-time customization. Runtime only.
3. **PDF generation:** Server-side PDF generation (not client-side jsPDF as in the desktop app). The PDF must include the firm's logo and brand colors. This means the PDF engine needs access to the firm's brand config. Options: Puppeteer/Playwright on a serverless function, or a dedicated PDF service. Architecture session decides.
4. **Logo storage:** Firm logos uploaded to Supabase Storage with a public bucket (logos are not sensitive). Access URL stored in the Firms table.

**What this means for DNS:** AlphaPi needs a wildcard DNS record (`*.alphapi.app`) pointing to Vercel. Vercel handles wildcard subdomains natively with Next.js middleware.

---

### 10.6 The scoring engine — port strategy

The desktop scoring engine (`src/utils/scoring.ts`) is pure TypeScript with zero DOM dependencies, zero Electron/Tauri dependencies, and zero SQLite dependencies. It takes typed inputs and returns typed outputs.

**What ports directly:** The core algorithm — dimension weights, scoring formulas, risk-level thresholds, and the typed interfaces in `src/types/assessment.ts`. These are the most tested and validated code in the entire project. The algorithm itself does not change.

**What must be adapted:** The desktop engine assumes a complete 252-question assessment across all 6 dimensions. The SaaS UX changes this in two ways (see Section 9.5 — The Actor 5 Problem):

1. **Dimension-selective assessment.** Users choose which dimension(s) to complete first. The engine must produce valid, meaningful scores from a partial dimension set — scoring Shadow AI and Vendor Risk without requiring Data Governance answers. This means the engine needs to score completed dimensions independently and present an overall score that clearly reflects which dimensions were assessed vs. which are pending.
2. **Maturity-appropriate question filtering.** An organization at the Experimenter stage should not be asked Achiever-level questions that don't apply to them. The engine (or the question-serving layer in front of it) must filter the question set by maturity profile and still produce calibrated scores from the reduced set.

Port strategy: **copy the algorithm into the Next.js project, then extend it to handle partial inputs.** The extension is additive — the scoring math stays identical, but the input contract changes from "all 252 responses required" to "score whatever dimensions are complete." The architecture session should define the exact interface: does the engine receive a sparse response set and infer which dimensions are complete, or does the caller explicitly declare which dimensions to score?

The question bank adaptation also changes. The desktop app loads questions from per-profile TypeScript files. The SaaS should serve them from the same static source (compiled into the Next.js bundle) — not from the database. Questions are not user-editable. Putting them in a database adds complexity (admin UI, migration scripts, versioning) with no Stage 1 value. However, the question-serving layer must now support filtering by dimension and by maturity profile so the UX can present only the relevant subset.

**Decision for architecture session:** (a) Whether results are computed client-side (as in the desktop app) or server-side. Client-side is simpler and eliminates API latency. Server-side enables the audit log to capture the exact computation. Recommendation: client-side for Stage 1, server-side verification added in Stage 2 when the audit log is implemented. (b) The partial-assessment scoring interface — how the engine distinguishes "not answered yet" from "not applicable at this maturity level" from "dimension not selected." These are three different states with different scoring implications.

---

### 10.7 What the architecture session must resolve

The following decisions are explicitly deferred to a dedicated architecture session (before any code is written in Cursor):

1. **Supabase project configuration:** Shared project vs. separate staging/production projects. Database branching strategy.
2. **RLS policy design:** Exact SQL for every table's RLS policy. Pen-test script template.
3. **Auth flow:** Supabase Auth configuration — email/password, magic link, MFA for admin. JWT claims for firm_id and role.
4. **API design:** Whether to use Supabase client SDK directly, Next.js API routes as a proxy layer, or Supabase Edge Functions. Trade-offs: client SDK is fastest to build; API routes give you a testable server layer; Edge Functions run closest to the database.
5. **PDF generation approach:** Puppeteer in a Vercel serverless function, a dedicated Supabase Edge Function, or a third-party service (e.g., PDFShift, DocRaptor). Client-side jsPDF is not viable for white-label (no access to server-side brand config at render time).
6. **Deployment architecture:** Vercel project configuration, environment variables, preview deployments, production domain setup.
7. **Schema migrations:** How schema changes are managed. Supabase CLI migrations, Prisma, or raw SQL scripts. For Stage 1 with one developer, Supabase CLI migrations are sufficient.
8. **Monitoring and error tracking:** Sentry, LogRocket, Vercel Analytics, or Supabase Dashboard only. Decision depends on budget.

None of these are product decisions — they're engineering decisions that should be made with full context in a focused session, not resolved in a product plan.

---

### 10.8 What was not considered and why

- **Offline/PWA capability:** Not considered because the consulting firm use case is always connected (running assessments during client meetings with internet access). If Armanino says their clients are in air-gapped environments, this assumption breaks.
- **Data export/portability (GDPR Article 20):** Not designed for Stage 1 because the EU AI Act consulting market is a Stage 2 concern. If a Stage 1 pilot firm operates in the EU, this must be added immediately.
- **Rate limiting and abuse prevention:** Not detailed because Stage 1 has 2–3 known firms with named users. At Stage 2 with self-service signup, rate limiting becomes critical.
- **Backup and disaster recovery:** Supabase provides automatic daily backups on the Pro plan ($25/month). For Stage 1, this is sufficient. Acquirers will expect point-in-time recovery (PITR) — that's a Stage 3 upgrade.

---

<a name="section-11"></a>
## Section 11 — Risk Register

*Status: COMPLETE — written 2026-03-23*

This section catalogs every known risk to the AlphaPi SaaS initiative, organized by category. Each risk includes severity, probability, blast radius, and mitigation options. Risks are rated before mitigation (inherent risk) and are ordered by combined impact within each category.

---

### 11.1 Business risks

**B1: The consulting firm channel does not convert**
- Severity: CRITICAL | Probability: HIGH (no validation yet)
- Blast radius: Entire business model. If consulting firms don't buy, the B2B2B thesis fails.
- Mitigation: (a) Armanino call is the first gate — structured interview with kill criteria (see Section 13). (b) If Armanino says no, test 2 more firms before abandoning the channel. (c) Model B (direct-to-org) is designed as a fallback that requires no rewrite, only a different onboarding flow.
- Opposing thought: Even if Armanino says yes, one firm is not validation. Two to three firms saying yes with payment intent is the minimum signal.

**B2: Acquirers don't materialize within 24 months**
- Severity: HIGH | Probability: MEDIUM
- Blast radius: Exit strategy fails. AlphaPi becomes a lifestyle business or shuts down.
- Mitigation: (a) Design the product to generate sustainable revenue (Model B fallback) even without acquisition. (b) Start acquisition conversations at Stage 2, not Stage 3 — don't wait until you're "ready." (c) Attend GRC conferences (RSA, Gartner GRC Summit) to build acquirer relationships early.
- Opposing thought: The AI governance market is growing fast enough that the acquisition window may extend beyond 24 months. The real risk is building something nobody wants, not running out of time.

**B3: Competitor launches a white-label AI governance platform before AlphaPi reaches Stage 2**
- Severity: HIGH | Probability: MEDIUM
- Blast radius: Competitive moat collapses. AlphaPi's primary differentiator (white-label for consulting firms) is neutralized.
- Mitigation: (a) Speed to market matters more than feature completeness — Stage 1 in 120 days is the right target. (b) The 252-question depth and 6-dimension framework are hard to replicate quickly. (c) First-mover with consulting firm relationships creates switching costs.
- Opposing thought: Grant Thornton already has CompliAI, BDO has AI Risk Assessment Coach, and Armanino has Audit Ally. The competitors may already be closer than assumed — the "no white-label platform exists" assumption (A6) needs hard validation.

**B4: Single-founder dependency**
- Severity: HIGH | Probability: HIGH (it's the current state)
- Blast radius: Bus factor of 1. If Balt is unavailable, everything stops. Acquirers will flag this.
- Mitigation: (a) Document everything (this plan, architecture decisions, session logs). (b) Keep the codebase simple enough that a new developer can onboard from documentation alone. (c) At Stage 2, consider a fractional CTO or technical co-founder to reduce key-person risk before acquisition conversations.
- Opposing thought: At Stage 1, this is acceptable. Every bootstrapped startup has this risk. It becomes a real problem only when acquirers do due diligence.

**B5: Legal entity not fully formed**
- Severity: MEDIUM | Probability: LOW (Atlas filed, just waiting)
- Blast radius: Cannot sign contracts with consulting firms, cannot open a bank account, cannot process payments.
- Mitigation: (a) Follow up on Atlas incorporation email. (b) File Idaho foreign entity registration as soon as EIN arrives. (c) D-U-N-S application ($230, 8 business days) immediately after EIN.
- Opposing thought: This is a known timeline — it resolves itself. The risk is if Atlas has a problem, not if it's slow.

---

### 11.2 Product risks

**P1: Users don't complete enough dimensions for meaningful output**
- Severity: HIGH | Probability: MEDIUM
- Blast radius: The dimension-selective UX (Section 9.5) lets users choose which dimensions to assess first, which solves the "too long" problem — but creates a new one. If users consistently complete only 1–2 dimensions and never return for the rest, the platform produces shallow, incomplete governance pictures. Consulting firms can't build full engagement scopes from partial data. The goal is for users to complete all 6 dimensions for a full picture.
- Mitigation: (a) The UX must make progress visible — show which dimensions are complete, which are pending, and what the user is missing by not completing them. (b) After each completed dimension, surface a preview of what the full assessment would reveal ("You've assessed Shadow AI. Completing Vendor Risk next would expose supply-chain blind spots."). (c) Progress saving ensures users can return across sessions without losing work. (d) Validate completion rates in first pilot — if users consistently stop at 1–2 dimensions, investigate whether the remaining dimensions feel irrelevant or if the UX isn't motivating completion.
- Opposing thought: Partial completion may be fine for the consulting firm use case. A firm might deliberately run Shadow AI only as a quick-win engagement, then sell the full assessment as a follow-up. The risk is only real if partial results are *misleading*, not if they're *incomplete by design*.

**P2: Scoring algorithm doesn't map to consulting firm engagement scoping**
- Severity: MEDIUM | Probability: MEDIUM
- Blast radius: The product produces scores but the consulting firm can't translate those scores into billable remediation work. The tool becomes a novelty.
- Mitigation: (a) Section 3 JTBD analysis explicitly ties dimension scores to engagement types. (b) The blind spots output was designed to be directly actionable. (c) Post-Armanino, review the scoring output with a real consulting firm user and ask "can you write a statement of work from this?"
- Opposing thought: The scoring engine is the most mature part of the product. The risk is more about presentation than calculation.

**P3: White-label quality doesn't meet consulting firm brand standards**
- Severity: MEDIUM | Probability: MEDIUM
- Blast radius: Consulting firms won't show clients a tool that looks unprofessional. Brand damage concern kills adoption.
- Mitigation: (a) Invest in design quality — this is a B2B tool used in client-facing contexts. (b) Stage 1 PDF must be indistinguishable from a professionally designed report. (c) Give firms a preview/approval step before any client sees it.
- Opposing thought: Stage 1 is pilot-quality, not production-quality. Firms will tolerate some rough edges if the content is good. Don't over-invest in polish before validating the model.

**P4: Desktop-to-web port introduces scoring discrepancies**
- Severity: MEDIUM | Probability: LOW
- Blast radius: If the SaaS produces different scores than the desktop app for the same inputs, trust in the tool collapses.
- Mitigation: (a) The core scoring algorithm (weights, dimension formulas, risk thresholds) is a direct copy — the math does not change. (b) The engine will be extended to handle partial inputs (dimension-selective and maturity-filtered assessments per Section 10.6), but this is additive logic on top of the original algorithm. (c) Build a regression test suite that covers both full 252-question assessments (must match desktop output exactly) and partial-input scenarios (new behavior, no desktop baseline to compare against — validate against expected mathematical output). (d) Keep the desktop app available as a reference implementation for full-assessment regression.
- Opposing thought: The scoring engine is pure TypeScript with no platform dependencies. The core math risk is genuinely low. The new risk is in the partial-input extension — ensure the regression suite covers edge cases like a single dimension completed, or all dimensions completed except one.

---

### 11.3 Technical risks

**T1: Supabase RLS misconfiguration exposes tenant data**
- Severity: CRITICAL | Probability: MEDIUM
- Blast radius: Data breach. One consulting firm sees another firm's client data. Business-ending event for a governance product.
- Mitigation: (a) Dedicated architecture session to design RLS policies before any code. (b) Pen-test script run as part of CI — every deployment verifies tenant isolation. (c) firm_id denormalized on every data table for simple, auditable RLS policies. (d) No service_role key in client-side code, ever.
- Opposing thought: Supabase RLS is battle-tested when configured correctly. The risk is configuration error, not a platform flaw. The pen-test script is the primary defense.

**T2: Supabase platform dependency**
- Severity: MEDIUM | Probability: LOW
- Blast radius: If Supabase has an outage, AlphaPi is down. If Supabase changes pricing or shuts down, migration is expensive.
- Mitigation: (a) Supabase is open-source (self-hostable) — migration to self-hosted PostgreSQL + GoTrue is possible. (b) No proprietary Supabase features that can't be replaced (RLS is standard PostgreSQL). (c) Keep database access through a thin abstraction layer so the ORM/client can be swapped.
- Opposing thought: Platform dependency is acceptable at Stage 1. Every startup builds on platforms. The risk increases only if AlphaPi reaches scale where Supabase costs become a concern.

**T3: PDF generation at scale fails or is too slow**
- Severity: MEDIUM | Probability: MEDIUM
- Blast radius: Consulting firms can't deliver reports to clients. The primary deliverable breaks.
- Mitigation: (a) Architecture session evaluates PDF approaches. (b) Server-side generation with caching — generate once, serve cached copy. (c) Async generation with status polling if synchronous generation exceeds 10 seconds.
- Opposing thought: Stage 1 has 2–3 firms generating maybe 5–10 PDFs per week. Scale is not a Stage 1 problem. But the architecture must not preclude scale.

**T4: 120-day timeline is tight for a solo developer**
- Severity: HIGH | Probability: MEDIUM
- Blast radius: Missed timeline erodes confidence, delays first pilot, allows competitors to move first.
- Mitigation: (a) Ruthless scope control — Stage 1 is only what's in Section 12. Nothing else. (b) Use Cursor + Claude for implementation velocity. (c) The scoring engine and question banks are a direct port — roughly 40% of the core logic is already written. (d) Two-week check-in: if less than 30% complete at day 14, reassess timeline.
- Opposing thought: 120 days for a solo developer building auth + multi-tenancy + assessment wizard + scoring + PDF export + deployment is ambitious but achievable with AI-assisted coding. The WBS will confirm whether scope fits the window. It's better to ship a solid product than compress quality into an arbitrary deadline.

---

### 11.4 Legal and compliance risks

**L1: No attorney review of consulting firm agreement before pilot**
- Severity: HIGH | Probability: HIGH (no attorney engaged yet)
- Blast radius: AlphaPi assumes liability for consulting firm's client advice. A single client dispute could expose the company.
- Mitigation: (a) Engage attorney before first pilot — this is a hard gate, not a nice-to-have. (b) White-label agreement must include: limitation of liability, indemnification, data processing terms, and IP ownership clarification. (c) Terms of Service on getalphapi.com already exists but needs professional review.
- Opposing thought: Many startups pilot without full legal coverage. The risk is real but can be mitigated with a clear "pilot agreement" that limits scope and liability. Perfect legal coverage shouldn't block learning.

**L2: GDPR data processor obligations if EU firms are onboarded**
- Severity: HIGH | Probability: LOW (Stage 1 targets US firms)
- Blast radius: GDPR fines up to 4% of global turnover or €20M. Unlikely at AlphaPi's size, but a regulatory complaint could be fatal reputationally.
- Mitigation: (a) Stage 1 targets US consulting firms only. (b) If a firm with EU clients is onboarded, a Data Processing Agreement (DPA) is required before they create any assessments. (c) Data residency: Supabase allows region selection — choose US for Stage 1. (d) Data export and deletion capabilities must exist before any EU data is processed.
- Opposing thought: The AI governance market is heavily EU-driven (EU AI Act). Avoiding EU firms in Stage 1 may mean avoiding the best early adopters. This constraint should be revisited at Stage 2.

**L3: Assessment content creates advisory liability**
- Severity: MEDIUM | Probability: LOW
- Blast radius: A client organization takes action based on AlphaPi's assessment output and suffers harm. They claim the assessment was professional advice.
- Mitigation: (a) Prominent disclaimers: "This assessment is for informational purposes only and does not constitute legal, compliance, or professional advice." (b) The consulting firm is the advisor, not AlphaPi. The white-label model intentionally distances AlphaPi from the end client. (c) ToS includes limitation of liability and disclaimer of professional advice.
- Opposing thought: The white-label model actually reduces this risk compared to Model B (direct-to-org). The consulting firm interprets the results — AlphaPi just provides the tool.

---

### 11.5 Financial risks

**F1: Runway exhaustion before acquisition or revenue**
- Severity: HIGH | Probability: depends on personal runway
- Blast radius: Project shuts down regardless of product quality.
- Mitigation: (a) Stage 1 is 120 days of full-time work — infrastructure costs are minimal ($25/month Supabase Pro, $20/month Vercel Pro, $12/year domain). (b) First revenue target is manual invoicing of pilot firms — no billing infrastructure needed. (c) If personal runway is limited, consider part-time consulting income while building.
- Opposing thought: The low infrastructure cost is a genuine advantage. The real cost is opportunity cost of 120 days of full-time work. Quantify that explicitly.

**F2: Pricing model doesn't work for consulting firms**
- Severity: MEDIUM | Probability: MEDIUM
- Blast radius: Firms want to pay per-assessment, AlphaPi charges per-seat. Or firms want unlimited usage at a flat rate that's too low.
- Mitigation: (a) Armanino call includes pricing discovery questions. (b) Stage 1 pilots are manually priced — no billing infrastructure locks in a model. (c) Test both per-assessment and per-seat with different pilot firms.
- Opposing thought: Pricing is a feature of Product-Market Fit, not a risk to manage. Get it approximately right and iterate.

---

### 11.6 Risk heat map summary

| Risk | Severity | Probability | Priority |
|---|---|---|---|
| B1: Consulting channel doesn't convert | CRITICAL | HIGH | 🔴 #1 |
| T1: RLS misconfiguration | CRITICAL | MEDIUM | 🔴 #2 |
| L1: No attorney review | HIGH | HIGH | 🔴 #3 |
| T4: 120-day timeline tight | HIGH | MEDIUM | 🟠 #4 |
| B3: Competitor launches first | HIGH | MEDIUM | 🟠 #5 |
| B4: Single-founder dependency | HIGH | HIGH | 🟠 #6 |
| P1: Assessment too long | HIGH | MEDIUM | 🟠 #7 |
| F1: Runway exhaustion | HIGH | VARIES | 🟡 #8 |
| B2: Acquirers don't materialize | HIGH | MEDIUM | 🟡 #9 |
| All others | MEDIUM | LOW-MED | 🟢 Monitor |

The top 3 risks (B1, T1, L1) each have the potential to kill the project independently. B1 is addressed by the Armanino call (Section 13). T1 is addressed by the architecture session (Section 10.7). L1 is addressed by engaging an attorney before the first pilot.

---

### 11.7 What was not considered and why

- **Regulatory risk to AlphaPi itself:** AlphaPi is a tool vendor, not an AI deployer. The EU AI Act obligations fall on the deployer (the consulting firm's client), not on the tool. This could change if regulators expand the definition of "provider" to include assessment tool vendors — but that's speculative.
- **Intellectual property risk:** The 252 questions and scoring methodology are AlphaPi's core IP. There's no patent protection and no trade secret agreement in place. If a consulting firm reverse-engineers the methodology from the output, they could build their own. Mitigation: the IP is in the system, not the questions alone. But this risk should be discussed with the attorney.
- **Cybersecurity insurance:** Not considered for Stage 1 due to cost. Should be evaluated at Stage 2 when real client data is being processed.

---

<a name="section-12"></a>
## Section 12 — Stage 1 MVP Definition

*Status: COMPLETE — written 2026-03-23*
*This is a living scope definition. Consulting firm feedback may refine specific items — update this section when that happens.*

This section defines exactly what is in Stage 1, what is out, and the acceptance criteria for each included item. It is the contract between the product owner and the developer (both of whom happen to be Balt). If it's not in this section, it's not in Stage 1.

---

### 12.1 Stage 1 goal statement

**Build a browser-based, multi-tenant AI governance assessment tool that a consulting firm manager can use to run a branded assessment with a client organization and deliver a professional PDF report — within 120 days of starting the build.**

Success is measured by: a consulting firm manager at Armanino (or equivalent) completes an assessment for a real client, exports a branded PDF, and says "I would pay for this."

---

### 12.2 What's IN — the complete scope

Each item has clear acceptance criteria. If it doesn't have acceptance criteria, it's not defined well enough to build.

#### MVP-01: Multi-tenant authentication
- Supabase Auth with email/password and magic link
- Two roles: platform_admin, firm_manager
- Login page with firm branding (logo + colors) based on subdomain
- Password reset flow
- Session management with automatic expiry
- **Acceptance:** A firm manager at `armanino.alphapi.app` can log in and see only their firm's data. A different firm manager at `firm-b.alphapi.app` sees only their data. Cross-tenant access is impossible via API manipulation.

#### MVP-02: Firm onboarding (admin only)
- Platform admin can create a new firm record: name, slug, logo, brand colors
- System creates the subdomain routing automatically
- Admin can create the first manager account for a firm
- **Acceptance:** Balt creates a firm record, uploads a logo, and the firm's subdomain serves a branded login page within 5 minutes.

#### MVP-03: Client profile management
- Firm manager can create a new client organization: name, industry, size, region, AI maturity self-assessment
- Firm manager can view a list of their clients
- Firm manager can archive (soft-delete) a client
- No client-side self-service — the firm manager creates everything
- **Acceptance:** A firm manager creates 3 client profiles, sees all 3 in a list, archives one, and the archived client no longer appears in the active list but is recoverable.

#### MVP-04: Assessment wizard
- Dimension-selective flow: Welcome → Organization Profile (pre-filled from client record) → Dimension Selection (user chooses which dimensions to assess) → Selected Dimension steps → Results. The goal is for the user to complete all 6 dimensions for a full governance picture, but the UX allows them to choose which to start with and return for the rest later.
- Questions loaded from static TypeScript files (ported from desktop), filtered at the application level by selected dimensions and maturity profile
- Maturity-adaptive question selection: the maturity profile selected in the org profile determines which question bank is used. Questions irrelevant to the user's maturity stage are not shown.
- Progress saving: responses are saved to the database as the user progresses. If the browser closes, the assessment resumes where it left off. Partially completed assessments show which dimensions are done, which are in progress, and which are pending.
- Completion visibility: after each completed dimension, the UX shows what the user has assessed, what remains, and what value the remaining dimensions would add (e.g., "Completing Vendor Risk next would expose supply-chain blind spots").
- Jurisdiction-based question filtering: questions tagged with jurisdiction codes are shown/hidden based on the client's operating regions
- **Acceptance (full assessment):** A firm manager starts an assessment for a client, selects all 6 dimensions, answers questions across all 6, and reaches the results page with a complete governance picture. The manager closes the browser mid-assessment, reopens it, and resumes with all previous answers intact.
- **Acceptance (partial assessment):** A firm manager starts an assessment, selects only Shadow AI and Vendor Risk, completes those two dimensions, and reaches a results page that scores only the completed dimensions. The results clearly indicate which dimensions were assessed and which are pending. The manager returns later, selects Data Governance, completes it, and the results page updates to reflect 3 of 6 dimensions scored.

#### MVP-05: Scoring engine
- Direct port of `src/utils/scoring.ts` from the desktop app
- Identical inputs produce identical outputs (regression test required)
- Computes: dimension scores, overall risk score, risk level, maturity classification, blind spots, recommendations
- Client-side computation (no server round-trip for scoring)
- **Acceptance (full-assessment regression):** A test suite feeds 10 known full-assessment input sets (all 252 responses) into both the desktop scoring engine and the SaaS scoring engine. All 10 produce identical outputs to 2 decimal places.
- **Acceptance (partial-input scoring):** A second test suite feeds partial input sets (1 dimension, 2 dimensions, 5 dimensions) into the SaaS scoring engine. Each produces valid dimension scores for the completed dimensions only, with no errors or misleading aggregates for the uncompleted dimensions. No desktop baseline exists for partial inputs — validation is against expected mathematical output.

#### MVP-06: Results dashboard
- Overall risk score with gauge visualization
- Radar chart of 6 dimension scores
- Dimension breakdown with individual scores and risk levels
- Blind spots list with severity, description, and immediate action
- Top recommendations with priority and timeline
- **Acceptance:** The results page renders all components correctly for a completed assessment. The data matches the scoring engine output. The page is responsive (desktop and tablet).

#### MVP-07: Branded PDF export
- Server-side PDF generation (not client-side jsPDF)
- Consulting firm logo, name, and brand colors on every page
- Content: executive summary, dimension scores, blind spots, recommendations, methodology note
- Professional quality: consistent typography, clean layout, no rendering artifacts
- Download as PDF from the results page
- **Acceptance:** A firm manager exports a PDF for a completed assessment. The PDF opens correctly in Adobe Reader, Chrome PDF viewer, and macOS Preview. The firm's logo and colors appear on every page. No AlphaPi branding is visible to the end client.

#### MVP-08: Data isolation (RLS)
- Every database table has RLS policies enforced
- Pen-test script validates cross-tenant isolation
- The pen-test script runs in CI on every deployment
- **Acceptance:** The pen-test script confirms that a user authenticated as Firm A cannot read, write, update, or delete any record belonging to Firm B across all tables. The script runs in under 60 seconds and is part of the deployment pipeline.

#### MVP-09: Deployment and infrastructure
- Next.js application deployed on Vercel
- Supabase project (Pro plan) for database, auth, and storage
- Wildcard DNS for `*.alphapi.app`
- Environment variables for production secrets (no secrets in code)
- Basic error tracking (Vercel's built-in or Sentry free tier)
- **Acceptance:** The application is accessible at `[firm-slug].alphapi.app` with HTTPS. Deployment from `main` branch to production takes less than 5 minutes. Error tracking captures and reports unhandled exceptions.

---

### 12.3 What's OUT — explicitly excluded from Stage 1

| Item | Rationale | When |
|---|---|---|
| Subscription billing (Stripe) | 2–3 pilot firms are invoiced manually. Billing infrastructure is wasted effort at this scale. | Stage 2 |
| Client self-service portal | Stage 1 clients are managed by the firm manager. End clients don't log in. | Stage 2 |
| Re-assessment with comparison | Pilots are first-time assessments. Before/after requires assessment history. | Stage 2 |
| Remediation tracker | Consulting firms use their own tools (Asana, Jira, Monday). Building a tracker competes with their workflow. | Stage 2 |
| Regulatory intelligence feed | The HITM pipeline is not built. Static regulatory alignment in the question bank is sufficient for Stage 1. | Stage 2 |
| Firm admin dashboard (cross-client analytics) | Not needed for pilots. A manager runs one assessment at a time. | Stage 2 |
| SSO/SAML | Enterprise auth. Email/password + magic link is fine for pilot firms. | Stage 3 |
| API access | No consumer for an API at pilot scale. | Stage 3 |
| Immutable audit log | Schema is designed in Stage 1 (the table exists). Populating it is Stage 2. Immutability guarantees are Stage 3. | Stage 2/3 |
| DOCX export | PDF is the standard consulting deliverable. | Stage 2 |
| Lite Assessment (30 questions) | The dimension-selective UX largely replaces the original Lite Assessment concept. Users who want a quick engagement can complete 1-2 dimensions in under 5 minutes each. A standalone Lite Assessment (curated 30-question subset across all dimensions) may still have value as a lower-tier product offering or lead-generation tool. Revisit as a future enhancement when pricing tiers are defined. | Future enhancement |
| Mobile-responsive assessment UI | Assessments are run on laptops during meetings. Mobile is not the use case. Tablet is nice-to-have. | Stage 2 |
| Multi-language support | Stage 1 targets US English-speaking firms. | Stage 3 |

---

### 12.4 Dependencies and sequencing

The MVP items have a natural build order dictated by dependencies:

```
Week 1–3:   MVP-09 (infrastructure) + MVP-01 (auth) + MVP-02 (firm onboarding)
             ↓ Auth and infrastructure must exist before anything else
Week 4–5:   MVP-03 (client profiles) + MVP-08 (RLS policies on initial tables)
             ↓ Clients must exist before assessments
Week 6–10:  MVP-04 (assessment wizard) + MVP-05 (scoring engine port)
             ↓ Assessment flow is the core product
Week 11–13: MVP-06 (results dashboard)
             ↓ Results require scoring to be complete
Week 14–16: MVP-07 (branded PDF export) + MVP-08 (RLS pen-test finalization)
             ↓ PDF is the deliverable; RLS pen-test is the safety gate
Week 17:    Buffer / bug fixes / pilot preparation
```

**Critical path:** Auth → Client Profiles → Assessment Wizard → Scoring → Results → PDF. If any item on this path slips, the timeline slips. The RLS work runs in parallel throughout and is the safety gate before any external user.

**Check-in gate at Week 3:** If auth + infrastructure + firm onboarding is not working by day 21, the timeline needs to be reassessed. This is the earliest possible signal.

---

### 12.5 What would prove this scope wrong

- A consulting firm says: "We don't need branded PDFs — we just need the data in a format we can paste into our own templates." → MVP-07 changes to a structured data export instead of PDF generation.
- A consulting firm says: "Our clients need to complete the assessment themselves, without our staff present." → Client self-service portal moves from Stage 2 to Stage 1. This is a significant scope increase.
- A consulting firm says: "We'd never use something that requires a separate login — can it integrate with our existing tools?" → SSO/SAML or API integration moves forward. This may break the 120-day timeline.
- A consulting firm says: "Even 5 minutes per dimension is too much for our workflow." → Investigate a rapid-fire format or pre-populated assessments based on industry templates. This would be a significant product redesign.
- Architecture session reveals that Supabase RLS cannot cleanly support the B2B2B data hierarchy. → Evaluate schema-per-tenant or a different database strategy. This could add 2–3 weeks.

Each of these triggers is tested in the consulting firm interview guide (Section 13). The build proceeds with current scope — feedback adjusts, not blocks.

---

<a name="section-13"></a>
## Section 13 — The Validation Plan

*Status: COMPLETE — written 2026-03-23*

Nothing in this product plan is validated. Every assumption, business model hypothesis, and feature decision is based on inference, competitive research, and product reasoning — not customer evidence. This section defines the validation activities required before and during the Stage 1 build, in priority order.

---

### 13.1 Validation Activity 1: The Armanino call (HIGHEST PRIORITY)

This is the single most important activity in the entire plan. If this call doesn't happen, the entire consulting firm channel (Model A) is built on faith.

**Objective:** Determine whether a real mid-market consulting firm would use, pay for, and recommend a white-label AI governance assessment tool to their clients.

**Format:** 45–60 minute video call (Zoom/Teams). Show the desktop app as a demo. Structured conversation, not a sales pitch.

**Preparation required:**
1. Confidentiality slide: Displayed at the start of the video call via screen share. States that all concepts, methodologies, and intellectual property are the sole property of AlphaPi, LLC, shared for evaluation and feedback purposes only, and should not be distributed without written permission. Sets the professional tone before any product content is shown.
2. Demo approach: Walk through one dimension live (Shadow AI recommended — most visceral) answering 5–6 questions together so the PM experiences the assessment as a user would. Then skip to a pre-completed results page showing all 6 dimensions scored. Walk the output: radar chart, blind spots, recommendations. Export the branded PDF live. This takes ~20 minutes and leaves 30+ minutes for the interview questions below.
3. Pitch framing: "AI governance is becoming mandatory (EU AI Act, NIST AI RMF, ISO 42001). Your clients need help. We built a tool for consulting firms to deliver that help under their own brand."
4. One-pager PDF (leave-behind): Problem, solution, how it works, why consulting firms. Includes confidentiality notice in the footer. Shared after the call alongside the sample assessment PDF output — two documents: one that sells, one that shows.
5. Sample assessment PDF (leave-behind): A completed assessment export showing all 6 dimensions scored. This is the product demo in document form. Includes confidentiality notice in the footer.

**Interview questions — grouped by what they validate:**

*Channel validation (does the consulting firm model work?):*
- "How are you currently helping clients with AI governance? What tools or frameworks do you use?"
- "If a tool existed that let your team run a branded AI governance assessment with clients, would you use it? What would it need to do?"
- "Would you expect to pay for the tool, or would you expect the client to pay?"
- "Browser-based or installed software — does it matter to your team?"

*Product validation (is the assessment the right product?):*
- "A user can complete one dimension in under 5 minutes or all six for the full governance picture in under 30 minutes. How would your team use that flexibility, would you run focused single-dimension assessments as quick wins, or push for the full picture every time?"
- "Looking at this results page — could you scope a consulting engagement from this output?"
- "What's missing from this report that you'd need to include in a client deliverable?"
- "Do your clients complete assessments themselves, or does your staff walk them through it?"

*Pricing validation (will they pay, and how much?):*
- "If this tool existed today with your firm's branding, what would you expect to pay? Per assessment? Per seat? Flat annual fee?"
- "Would a per-client-assessment model work better than a per-user-seat model?"
- "At what price point would this be an easy yes for your practice leader?"
- "At what price point would you say 'no way'?"

*Competitive validation (what are we up against?):*
- "Are you aware of any other tools that do this? Have you evaluated any?"
- "Has your firm built or considered building something in-house?"
- "What would prevent you from using a third-party tool with your clients?"

*Legal/contractual validation (what are the barriers?):*
- "What would your firm need contractually to use a third-party tool with client data?"
- "Do you have existing vendor agreements we'd need to fit into?"
- "Who in your firm makes the decision to adopt a new client-facing tool?"

**Kill criteria — signals that the consulting firm model is wrong:**
- "We already built something like this internally" → The build-vs-buy decision already went to build. Model A is dead at this firm.
- "We'd never use a third-party tool with client data" → Contractual barriers too high for mid-market firms. Test with 2 more firms before abandoning.
- "Our clients wouldn't spend more than 10 minutes on this" → The assessment model is wrong for this channel. Pivot to automated scanning or a different product shape.
- Zero pricing sensitivity (they have no idea what they'd pay and can't anchor) → The problem isn't painful enough to pay for.

**Who needs to be on the call:** The Armanino contact, ideally someone in the advisory/consulting practice (not audit). If possible, someone who has direct client engagement responsibility.

---

### 13.2 Validation Activity 2: Attorney review

**Objective:** Ensure AlphaPi can legally offer a white-label tool to consulting firms without unacceptable liability exposure.

**What needs review:**
1. White-label license agreement template (AlphaPi ↔ Consulting Firm)
2. Terms of Service for the SaaS platform
3. Data Processing Agreement (DPA) template for firms with EU clients
4. Limitation of liability and disclaimer of professional advice
5. IP ownership: confirm AlphaPi retains IP, firm gets a license to use the tool under their brand

**Timeline:** Engage before the first pilot. This is a hard gate. The Armanino call can happen without the attorney. The first pilot cannot.

**Budget consideration:** Startup-focused attorneys (e.g., Clerky, LegalZoom business attorney, or a local Idaho attorney with SaaS experience) may be more cost-effective than a Big Law engagement. The documents needed are standard SaaS agreements, not novel legal work.

---

### 13.3 Validation Activity 3: Architecture spike (Week 0)

**Objective:** Prove that the chosen stack (Next.js + Supabase + Vercel) can support the B2B2B data model with proper tenant isolation before committing 120 days to the build.

**What the spike must prove:**
1. Supabase RLS policies can enforce firm-level isolation on a shared schema
2. Subdomain routing works on Vercel with Next.js middleware
3. Supabase Auth can support the two-role model (admin + firm_manager)
4. A basic assessment response can be saved and retrieved with RLS enforced

**Duration:** 3–5 days. This is not a prototype — it's a proof that the architecture works. Throw it away after validation (or keep it as the seed if it's clean enough).

**Kill criteria:** If RLS cannot cleanly enforce the B2B2B hierarchy, evaluate alternatives: schema-per-tenant (Supabase supports multiple schemas), application-level isolation with a middleware layer, or a different database platform (PlanetScale, Neon, Turso).

---

### 13.4 Validation Activity 4: Second and third consulting firm conversations

**Objective:** Validate that the Armanino signal (positive or negative) is not a sample size of one.

**When:** After the Armanino call, regardless of the outcome. If Armanino says yes, the second and third conversations confirm demand. If Armanino says no, they determine whether the problem is Armanino-specific or the channel is wrong.

**Who:** Mid-market consulting firms with advisory practices. Not Big 4, not boutique. Target firms in the 200–5,000 employee range with technology advisory or risk advisory practices. Potential sources: LinkedIn outreach, local CPA/advisory firm networks, GRC conference contacts.

**Interview guide:** Same questions as the Armanino call (Section 13.1), adapted for the context of not having a personal contact.

---

### 13.5 Validation Activity 5: Work Breakdown Structure (WBS) — the build plan

**Objective:** Before starting the 120-day build, break every MVP item (Section 12.2) into tasks estimable in hours, assign them to weeks, and identify the critical path.

**When:** After the architecture spike. The spike informs the WBS by revealing which items are harder than expected.

**Format:** A task list (not a Gantt chart). Each task has: description, estimated hours, dependencies, and which MVP item it belongs to. Total estimated hours should be compared to available hours (120 days × ~6 productive hours/day = ~720 hours) to validate the timeline.

**If estimated hours exceed 720:** Cut scope from the bottom of Section 12.2 or extend the timeline. Do not compress by working more hours — that's how quality drops and burnout happens.

---

### 13.6 Validation sequence and timeline

```
Week 0:         Architecture spike + Armanino call + Attorney engagement (all in parallel)
Week 1:         Process any consulting firm feedback → update Sections 1, 5, 9, 12 as needed
                WBS creation → validate 120-day timeline
Week 1–17:      Stage 1 build (per Section 12.4 sequencing, adjusted for 120-day window)
Week 4–8:       Second and third consulting firm conversations (while building)
Week 17:        Pilot preparation → first consulting firm onboarded
```

All three Week 0 activities run in parallel — they have no dependencies on each other. The build starts immediately after the architecture spike confirms the stack works. Consulting firm calls happen alongside the build and refine scope — they don't gate it. Attorney engagement starts early because document review turnaround is typically 2–4 weeks, and agreements must be ready before the first pilot.

---

<a name="section-14"></a>
## Section 14 — Definition of Done for Stage 1

*Status: COMPLETE — written 2026-03-23*

Stage 1 is "done" when every criterion below is met. Not most of them — all of them. This is the contract. If any criterion is unmet, Stage 1 is not complete and the product is not ready for external users.

---

### 14.1 Product criteria

- [ ] A consulting firm manager can log in at `[firm-slug].alphapi.app` and see their firm's branded interface
- [ ] The manager can create a client organization with all required profile fields
- [ ] The manager can start and complete a full assessment for a client (all 6 dimensions, maturity-adaptive questions, jurisdiction filtering). The goal is all 6 dimensions for a complete governance picture.
- [ ] The manager can choose which dimensions to assess first, complete a subset, receive valid scored results for those dimensions, and return later to complete remaining dimensions. The UX clearly shows which dimensions are assessed, which are pending, and what value the remaining dimensions would add.
- [ ] Assessment progress is saved — closing the browser and reopening resumes where the user left off, with all previously completed dimensions and in-progress responses intact
- [ ] The results dashboard displays: overall risk score, dimension radar chart, dimension breakdown, blind spots, and recommendations. For partial assessments, the dashboard scores only completed dimensions and clearly indicates which dimensions are pending.
- [ ] The scoring engine produces identical results to the desktop app for the same full-assessment inputs (regression test passes). Partial-input scoring produces valid dimension scores with no errors or misleading aggregates for uncompleted dimensions.
- [ ] The manager can export a branded PDF that includes the firm's logo and colors with no AlphaPi branding visible to the end client
- [ ] The PDF opens correctly in Adobe Reader, Chrome PDF viewer, and macOS Preview

### 14.2 Security criteria

- [ ] Every database table has RLS policies enforced
- [ ] The pen-test script confirms complete cross-tenant data isolation across all tables
- [ ] The pen-test script runs in CI on every deployment and blocks deployment on failure
- [ ] No Supabase `service_role` key is present in any client-side code
- [ ] All environment variables are stored in Vercel's environment variable system — no secrets in the repository
- [ ] HTTPS is enforced on all subdomains

### 14.3 Legal criteria

- [ ] Attorney has reviewed the white-label license agreement template
- [ ] Attorney has reviewed the Terms of Service
- [ ] Limitation of liability and disclaimer of professional advice are present in the ToS and in the assessment output
- [ ] If EU firms are onboarded: Data Processing Agreement is signed

### 14.4 Business criteria

- [ ] At least one consulting firm has been onboarded and completed a real assessment with a real client
- [ ] The consulting firm manager's feedback has been documented
- [ ] Pricing has been tested (even if not finalized) — the firm has stated what they would pay
- [ ] Invoice has been sent for the pilot (even if at a reduced/free pilot rate — the act of invoicing validates the transaction)

### 14.5 Operational criteria

- [ ] The application is deployed on Vercel with production-grade configuration
- [ ] Error tracking is active and capturing exceptions
- [ ] Database backups are configured (Supabase Pro automatic daily backups minimum)
- [ ] A runbook exists for: creating a new firm, resetting a user's password, investigating an error, and rolling back a deployment

### 14.6 Documentation criteria

- [ ] Architecture Decision Records (ADRs) exist for every major technical decision made during the build
- [ ] The CLAUDE.md in the SaaS repo contains all context needed for a new developer (or AI agent) to understand the system
- [ ] The session-summary.md is current with all decisions and outstanding items

---

### 14.7 What "done" does NOT mean

- It does not mean the product is perfect. Stage 1 is pilot quality, not production quality.
- It does not mean billing works. Pilots are manually invoiced.
- It does not mean the product is ready for self-service signup. Firms are onboarded by the admin.
- It does not mean the product is acquisition-ready. That's Stage 3.
- It does not mean every consulting firm will say yes. It means one has tried it and the feedback informs Stage 2.

---

### 14.8 The "done" conversation

When every checkbox in 14.1–14.6 is checked, the question is: **"Do we consider Stage 1 done?"**

If yes: Write a Stage 1 retrospective documenting what worked, what didn't, and what changes for Stage 2. Update the product plan. Begin Stage 2 planning.

If no: Identify which criteria are unmet, why, and what it would take to meet them. Decide whether to extend Stage 1 or accept the gap and move forward.

---

## Document Status

| Section | Status | Written | Approved |
|---|---|---|---|
| 0 — Project State | ✅ Complete | 2026-03-21 | 2026-03-21 |
| 1 — Assumption Inventory | ✅ Complete | 2026-03-21 | — |
| 2 — Stakeholder Map | ✅ Complete | 2026-03-21 | — |
| 3 — Jobs-to-be-Done | ✅ Complete | 2026-03-21 | — |
| 4 — Competitive Landscape | ✅ Complete | 2026-03-21 | — |
| 5 — Business Model | ✅ Complete | 2026-03-21 | — |
| 6 — Product Strategy | ✅ Complete | 2026-03-21 | — |
| 7 — Product Principles & Anti-Portfolio | ✅ Complete | 2026-03-21 | — |
| 8 — Opportunity Map | ✅ Complete | 2026-03-21 | — |
| 9 — Feature Discovery | ✅ Complete | 2026-03-21 | — |
| 10 — Architecture Implications | ✅ Complete | 2026-03-23 | — |
| 11 — Risk Register | ✅ Complete | 2026-03-23 | — |
| 12 — Stage 1 MVP Definition | ✅ Complete | 2026-03-23 | — |
| 13 — Validation Plan | ✅ Complete | 2026-03-23 | — |
| 14 — Definition of Done | ✅ Complete | 2026-03-23 | — |

All 15 sections (0–14) are now written. Sections 1–14 await formal review and approval. The document is ready for the architecture session and Stage 1 build.

---

*End of document. Next actions (in parallel): architecture spike, consulting firm call(s), attorney engagement → then Stage 1 build.*

---

## Section 15 — Desktop UX Carry-Over Features

*Added 2026-03-24. These are UX patterns and capabilities from the desktop Beta (v0.9.2-beta) that must be carried forward into the SaaS build. Not optional — they define the expected product experience.*

### 15.1 Responses Tab (Review + Edit Answers with Live Re-Scoring)

**What it is:** A dedicated tab on the results page where users can review all their answers grouped by dimension, change any response, and see scores update in real time.

**Why it matters:** Users need to correct answers without restarting the assessment. Consulting firms need to walk clients through responses as part of a facilitated review session.

**Desktop status:** Not yet built. Infrastructure exists (tab system, calculateResults() in Zustand store). Estimated effort: 4-6 hours.

**SaaS requirement:** Build from scratch in the SaaS results view. Must support:
- Group responses by dimension
- Show question text + current answer selection
- Allow changing any answer
- Trigger score recalculation immediately on change
- Persist updated responses to Supabase

### 15.2 Dimension-Selective Back Navigation

**What it is:** Users can navigate back to a previous dimension without losing answers already entered.

**Desktop status:** Already implemented via Zustand prevStep(). Responses persist in store.

**SaaS requirement:** Preserve this behavior. The SaaS wizard must allow backward navigation without clearing state. Back navigation should not trigger re-scoring — only forward completion (moving to results) triggers scoring.

### 15.3 Seamless Update and Reinstall

**What it is:** When a new version is released, the user can install it without manually ejecting the previous mounted disk image. Duplicate volume mounts (two "AlphaPi" volumes in Finder) cause confusion and failed installs.

**Desktop fix:** Auto-eject any already-mounted AlphaPi volume at the top of `Install AlphaPi.command` before copying the new app.

**SaaS equivalent:** Not applicable (web app, no local install). But the principle carries: version transitions must be seamless with no user intervention required.
