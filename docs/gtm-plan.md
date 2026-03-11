# AlphaPi — Go-to-Market Content & Web Presence Plan

*Produced: 2026-03-10 | Status: Draft v1*

---

## 1. Webpage Plan

### Recommendation: Astro Static Site on Cloudflare Pages

For a solo founder at pre-revenue stage: **Astro** (static output). Reasons:
- Zero hosting cost on Cloudflare Pages free tier
- No runtime/SSR server to maintain
- Markdown-driven content updates
- Ships as static HTML — fast, no JavaScript bloat
- Handles blog/content marketing natively if needed later

Avoid Next.js (overkill). Avoid plain HTML (you'll want components for pricing table, FAQ accordion).

**Domain**: Register `alphapi.com` (or `tryalphapi.com` / `alphapi.io` as fallback). Do this before anything else — no company required.

**Deploy target**: Cloudflare Pages (free, global CDN, custom domain, HTTPS automatic).

---

### Landing Page Structure (10 Sections)

#### Section 1: Hero
**Purpose**: State the problem + the product in under 5 seconds.
- Headline: "Know your AI risk. Prove your AI value. Before regulators ask."
- Subheadline: "AlphaPi is a guided AI governance assessment for mid-market organizations — without needing a governance team to get started."
- Primary CTA: "Download Free — macOS" (links to GitHub Release)
- Secondary CTA: "See what it assesses" (scroll anchor)
- Urgency badge: "EU AI Act enforcement: August 2, 2026 — fines up to €35M or 7% of global revenue"
- Trust signal: "All data stays on your device. No account. No cloud."
- **Status**: Can write now. [BLOCKED: Apple Dev/signing] for final signed DMG link.

#### Section 2: Problem Statement
**Purpose**: Make the buyer feel seen.
- Gap framing: Enterprise tools ($50K+) vs free frameworks (no scores, no recommendations) vs nothing for mid-market
- Stats row: "1,200 unauthorized AI apps per enterprise" | "86% blind to AI data flows" | "$67.4B in losses from AI hallucinations in 2024"
- Closer: "If your organization uses AI — and it does — you have governance risk you haven't measured."
- **Status**: Can write now.

#### Section 3: What AlphaPi Does
**Purpose**: Show the product in motion.
- 3-step visual: "Answer 252 calibrated questions → See your score + blind spots → Get a prioritized action plan"
- 6 Dimensions with 1-line descriptions
- Free / Pro feature table
- App screenshot (required)
- **Status**: Structure can write now. [NEEDS SYNTHESIS] for business-framed dimension descriptions.

#### Section 4: Who It's For
**Purpose**: Help the right buyer self-identify.
- 3 persona chips: IT Manager / Compliance/Legal / Operations-COO
- "Not for": Fortune 500 / enterprise platforms
- **Status**: Can write now.

#### Section 5: Jurisdiction & Regulatory Coverage
**Purpose**: Establish credibility with compliance buyers.
- Coverage list: EU AI Act, GDPR, CCPA, ISO 42001, NIST AI RMF, UK, APAC/LatAm/MEA
- EU AI Act urgency callout (August 2, 2026, €35M fines)
- **Status**: Coverage list can write now. [NEEDS SYNTHESIS] for plain-language EU AI Act explainer.

#### Section 6: Pricing
**Purpose**: Remove friction. State price clearly. Emphasize free entry.
- Two-column: Free (forever) / Pro (one-time, $500–$3,000 per org)
- FAQ: free trial, per-org meaning, upgrade path
- [BLOCKED: Keygen + payment processor] — "Buy Pro" button can't wire yet. Use "Join waitlist" email capture as interim CTA.
- **Status**: Copy can write now. Button wiring blocked.

#### Section 7: Privacy & Trust
**Purpose**: Address #1 objection — "do I want my risk profile leaving my org?"
- "Your data never leaves your machine."
- Bullet list: no account, no telemetry, no cloud sync, local SQLite, fully offline
- Exception stated clearly: Anthropic API key for AI Executive Summary goes device → Anthropic directly — we never see it.
- **Status**: Can write now.

#### Section 8: Social Proof / Early Signals
**Purpose**: Reduce risk perception.
- Beta tester quotes (collect via structured follow-up) — [needs BT-7 complete]
- Founder note: short 3-sentence statement — who built this, why, what you stand behind
- Skip press badges until earned
- [NEEDS SYNTHESIS] for testimonial framing language
- **Status**: Founder note can write now. Quotes depend on tester feedback.

#### Section 9: FAQ
**Purpose**: Handle objections before they become support tickets.
Recommended questions:
1. SaaS or one-time download? → Desktop app, no subscription
2. What OS? → macOS now, Windows 2026
3. How long? → 45–90 minutes
4. Per-seat or per-org? → Per organization
5. What do I get when done? → Score, blind spots, ranked action plan, shareable PDF
6. Real regulations or best practices? → Both — maps to EU AI Act, GDPR, CCPA, ISO 42001, NIST AI RMF
7. Free vs Pro difference? → Free = full picture of where you stand. Pro = everything to act on it and prove it to your board.
- **Status**: Can write now.

#### Section 10: Footer CTA + Contact
- Repeat primary CTA
- Contact: balt.aguilar@outlook.com (switch to company email once entity formed)
- Footer links: Privacy Policy | Terms of Service | GitHub
- [BLOCKED: company email]

---

### What to Build Now vs What to Wait On

| Item | Build Now | Wait For |
|---|---|---|
| Domain registration | Yes | — |
| Astro site structure + copy-ready sections | Yes | — |
| Pricing table copy | Yes | — |
| "Buy Pro" button | No | Payment processor live |
| Final signed DMG download link | No | Apple Dev / signing |
| Beta tester quotes | No | Tester feedback collected |
| EU AI Act section detail | No | [NEEDS SYNTHESIS] |
| Dimension descriptions (business-framed) | No | [NEEDS SYNTHESIS] |
| Company email address | No | Entity formed |

---

## 2. How-To Documents Plan

### Priority 1 — Must-Have Before First Customer

**1. Installation Guide (macOS)**
- Adapt from TESTER-GUIDE.md — remove all beta language, rewrite for non-technical customer
- Format: Web page (not just README)
- Effort: 1 hour

**2. Assessment Guide: How to Get Accurate Results**
- Who to involve, what info to have on hand, how to interpret maturity level selection
- Format: Web page + in-app tooltip on Profile step
- Effort: 2–3 hours

**3. Reading Your Results: A Plain-Language Guide**
- What dimension scores mean, how to interpret overall score, what blind spots require action
- Format: Web page + appendix page in Free PDF
- Effort: 2–3 hours

**4. Upgrading to Pro: What You Get and Why**
- Specific Pro outputs: vendor questionnaire walkthrough, playbook format, ROI dashboard, DOCX report
- Format: Web page (also functions as sales page)
- Effort: 2 hours

**5. Privacy & Data FAQ**
- Exactly what the app stores, where, how to export, how to delete, what the Anthropic API key does
- Format: Web page linked from Privacy Policy
- Effort: 1 hour (most content already in Privacy Policy)

### Priority 2 — Nice-to-Have Before First Revenue

**6. EU AI Act Readiness Guide** — long-form, high SEO value. [NEEDS SYNTHESIS]. Effort: 3–4 hrs

**7. How to Share Your Results with Leadership** — script for board/exec presentation, email-gated 1-pager for lead capture. Effort: 2–3 hrs

**8. Vendor Questionnaire User Guide (Pro)** — how to send it, what to do with responses, vendor score thresholds (0–30 Replace / 31–60 Renegotiate / 61–80 Remediate / 81–100 Renew). Effort: 2 hrs

### Priority 3 — Post-Revenue
- Regulatory jurisdiction guides (EU AI Act, CCPA, ISO 42001, NIST AI RMF) — high SEO value, [NEEDS SYNTHESIS]
- Video walkthrough (5–8 min screen recording) — do after first 10 customers
- Assessment history / benchmarking guide (Pro feature)

### Format Recommendations
- **Web pages** over PDFs for anything you want found via search
- **In-app tooltips** for context during assessment (dimension descriptions, question intent)
- **Downloadable PDF** only for content buyers will print or share internally
- **GitHub wiki**: avoid for customer-facing content — signals "open source project"

---

## 3. Marketing Ideas

### 5 Positioning Angles

**Angle 1: EU AI Act Compliance Urgency (Primary)**
- "August 2, 2026 is 5 months away. Do you know if your AI usage qualifies as high-risk? AlphaPi tells you in under 2 hours."
- Target: Organizations with EU operations or EU customer data
- Channel: LinkedIn, direct outreach to compliance/legal

**Angle 2: The Unauthorized AI Problem (Shadow AI)**
- "Your employees are using 1,200+ AI tools IT doesn't know about. AlphaPi shows you how exposed you are — and what to do first."
- Target: IT managers, CISOs at mid-market
- Channel: LinkedIn, IT Slack communities

**Angle 3: Board Accountability (ROI + Governance)**
- "Your board is asking about AI ROI. Your CEO approved the tools. Nobody has the numbers. AlphaPi builds the measurement framework."
- Target: COOs, Operations VPs, strategy roles at 200–2,000 person companies
- Channel: LinkedIn, executive newsletters

**Angle 4: The Affordable Alternative**
- "Enterprise governance platforms start at $50,000. AlphaPi costs $500. You don't need a platform — you need an assessment."
- Target: Companies that priced OneTrust/Credo AI and walked away
- Channel: G2 reviews, comparison content, Capterra

**Angle 5: Privacy-First (Anti-SaaS)**
- "A governance tool that respects your data. No cloud. No account. No vendor seeing your risk profile."
- Target: Healthcare-adjacent, legal, financial services, government contractors
- Channel: LinkedIn, industry communities

---

### Channel Recommendations

**LinkedIn (Primary — Start Here)**
- 2x/week organic posts: EU AI Act news, knowledge-base stats, product behind-the-scenes, dimension tips
- 10–20 targeted connection requests/week to compliance officers, IT managers, ops leads at 200–2,000 employee companies
- LinkedIn Articles (1–2 long-form on EU AI Act readiness) — index in Google, build credibility
- No LinkedIn Ads until payment flow works and first 5 customers — need conversion proof first

**Industry Slack/Discord Communities**
- Identify 5 relevant communities, join this week
- Lurk 2 weeks before engaging
- Goal: be the person who answers "has anyone evaluated AI governance tools?" — not the person who posts ads

**Content SEO**
- Target: "EU AI Act compliance checklist," "AI governance assessment tool," "shadow AI risk assessment," "how to measure AI ROI"
- Each Priority 1/2 how-to doc is an SEO asset when hosted on the site
- Timeline: 3–6 months to surface results — start planting content now

**Direct Email Outreach**
- After company registered + company email live
- Start with existing network (warm > cold)
- Sequence: LinkedIn connect → follow 1 week → DM → email if no response

**ProductHunt + Hacker News**
- Plan for Tuesday–Thursday launch alongside signed macOS release (GL-3/GL-4)
- One shot — do it when product is polished and Gatekeeper-clean
- [BLOCKED: Apple Dev signing]

---

### Assessment Output as a Marketing Asset (Underutilized)

**PDF as leave-behind**: Free users share their 1-page PDF with leadership. Your brand travels with it. Ensure footer of free PDF includes: "Generated by AlphaPi | alphapi.com"

**"Share your score" mechanic**: After assessment, show a shareable card with org score + 1–2 headline findings. Users share to LinkedIn organically. Viral loop at zero cost. [Low effort: 2–3 hrs in Results dashboard]

**Vendor questionnaire as outbound**: Pro users send AlphaPi's questionnaire to their AI vendors. Those vendors see "this org uses AlphaPi to assess vendor risk" — a warm impression to a decision-maker at another org. Add "Powered by AlphaPi" to vendor questionnaire footer.

**Beta tester case studies**: 3–5 testers who ran full assessment → structured 15-min conversation → 300-word case study. Anonymize if needed. High-value conversion asset.

---

### Launch Sequencing

**Before first revenue (now through payment processor live)**:
1. Register domain — this week
2. Build Astro site with all copy-ready sections (pricing with waitlist CTA)
3. Start LinkedIn: 2x/week posts
4. Collect 3–5 beta tester quotes via structured follow-up email
5. Write Priority 1 how-to documents
6. Draft EU AI Act readiness guide [NEEDS SYNTHESIS]
7. Join 5 Slack/Discord communities

**After payment processor live (GL-5)**:
1. Wire "Buy Pro" button on site
2. Activate checkout (Paddle or LemonSqueezy)
3. Direct outreach to beta testers at early-customer Pro pricing
4. "We're live" LinkedIn post with personal founder story

**After first 5 paying customers**:
1. 2–3 anonymized case studies
2. G2 and Capterra free listings
3. LinkedIn Ads test ($500/month budget)
4. Revisit Regulatory Intelligence Agent for roadmap

---

## 4. Project Plan Integration

### Recommended New Phase: Phase 6 — Go-to-Market

| Item | Description | LOE | Blocked On |
|---|---|---|---|
| **GTM-1** | Register domain | XS — 30 min | Nothing — start this week |
| **GTM-2** | Build Astro landing page | M — 8–12 hrs | GTM-1 |
| **GTM-3** | Write Priority 1 how-to docs (5 guides) | S — 8–10 hrs | Nothing |
| **GTM-4** | LinkedIn presence: profile polish + 10 posts queued | S — 3–4 hrs | Nothing |
| **GTM-5** | Collect beta tester quotes | XS — 1 hr | BT-7 complete |
| **GTM-6** | EU AI Act readiness guide | M — 3–4 hrs | [NEEDS SYNTHESIS] |
| **GTM-7** | Dimension descriptions, business-framed (for site) | S — 2–3 hrs | [NEEDS SYNTHESIS] |
| **GTM-8** | "Share your score" card mechanic in Results | S — 2–3 hrs dev | Nothing |
| **GTM-9** | Wire "Buy Pro" button on website | XS — 1 hr | GL-5 payment processor |
| **GTM-10** | ProductHunt + Hacker News launch prep | S — 3–4 hrs | GL-3/GL-4 Apple Dev/signing |
| **GTM-11** | G2 and Capterra listings | XS — 2 hrs | First 3 customer reviews |
| **GTM-12** | LinkedIn Ads test ($500 budget) | S — 2 hrs setup | First 5 customers |

**Total effort estimate**:
- Can-start-now work (GTM-1 through GTM-5, GTM-8): ~25–35 hrs
- All GTM through launch: ~37–51 hrs

---

### Hard Gates — Do NOT Spend on Marketing Until:
1. Trademark search for "AlphaPi" clears (USPTO Class 42, EUIPO, UK IPO)
2. Legal entity registered
3. macOS app signed + notarized (GL-3/GL-4) — unsigned = poor first impression
4. Payment processor live (GL-5) — you need a way to collect before driving traffic
5. E&O and cyber liability insurance in place

---

### Flagged Gaps — Things Not Yet Considered

1. **Company email**: Set up `balt@alphapi.com` or `hello@alphapi.com` via Cloudflare Email Routing (free) once domain registered. Do before site goes public.

2. **App screenshots**: Before building the site, take 30 minutes to capture clean screenshots of wizard flow, results dashboard, and PDF output at 1440×900 with realistic (not test) data. PNG format, retina-ready.

3. **SEO basics**: Before publishing: hand-write page title ("AI governance assessment" in it), meta description, unique title per how-to page. 30 minutes, irreversible to do wrong.

4. **Pricing tier clarity**: "$500–$3,000 per organization" will raise questions. Decide exact tiers (e.g., $500 / 1–100 employees, $1,500 / 101–500, $3,000 / 501–2,000) before payment processor goes live. Ambiguous pricing increases drop-off.

5. **Refund policy**: Decide before first sale. "30-day refund if app doesn't run on your machine" is safer than "no refunds after download" — reduces chargebacks. Log decision in decisions.md.

---

*See also: `docs/remaining-work-plan.md` | `docs/decisions.md` | `docs/business-setup.md`*

*Last updated: 2026-03-10 — GTM v1 (planning session)*
