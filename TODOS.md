# TODOS.md — AI Governance Tool

Deferred work items. Each item has priority, effort estimate, and dependencies.
Updated: 2026-03-18 (Session 52 — /plan-ceo-review)

---

## P1 — High Priority

### TODOS-REG-01: Multi-Jurisdiction Regulatory Sources (EU/UK)
**What:** Add EU AI Act Official Journal, GDPR guidance (EDPB), and ICO as Worker sources for EU/UK orgs.
**Why:** EU AI Act enforcement is August 2, 2026 — 4.5 months away. Sprint 1 Worker is US-only. EU/UK orgs and US orgs subject to GDPR get no regulatory updates from RegIntel Sprint 1.
**Pros:** Dramatically expands addressable market; EU AI Act urgency is the primary marketing hook.
**Cons:** EU regulatory sources are more complex (multi-language, different publishing patterns). Adds ~2 more R2 content files and Worker source modules.
**Context:** Worker architecture is built for this — just add new source modules and new JSON files. EDPB publishes guidance at edpb.europa.eu/news, EU OJ AI Act updates at eur-lex.europa.eu. Both have RSS feeds.
**Effort:** M (8 hrs human / ~45 min CC+gstack)
**Priority:** P1
**Depends on:** RegIntel Sprint 1 shipped and Worker proven stable

---

### TODOS-REG-02: Worker CI/CD GitHub Actions Workflow
**What:** Add `.github/workflows/deploy-worker.yml` to automatically deploy the Cloudflare Worker on push to main.
**Why:** Manual `wrangler deploy` works at launch but becomes a reliability risk as Worker updates become more frequent.
**Pros:** Consistent deploys, no manual steps, audit trail in GitHub Actions.
**Cons:** Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub secrets. Should wait until repo is private (DI-2) to avoid exposing secrets via public forks.
**Context:** Decision: manual deploy for Sprint 1. Add CI/CD after repo goes private. Standard `wrangler deploy` command takes 30 seconds.
**Effort:** S (2 hrs human / ~10 min CC+gstack)
**Priority:** P1
**Depends on:** DI-2 (repo → private), Cloudflare account active

---

## P2 — Medium Priority

### TODOS-LEG-01: Legislative Watch Sprint
**What:** Surface proposed/pending bills (already stored silently in R2 as `status: "proposed"`) as a visible feature — "Legislative Watch."
**Why:** Customers in regulated industries want early warning on bills that may affect them, not just enacted law.
**Pros:** Data already collected by Worker (no Worker changes needed). App just removes the enacted-only filter and adds "Proposed" status badge + filter toggle.
**Cons:** Proposed bills change materially before passage (SB 1047 failed entirely). Risk of false urgency / noise. Need clear UX to distinguish "enacted = act now" from "proposed = watch."
**Context:** Sprint 1 decision: enacted only for high signal. Proposed bills fetched silently. This sprint makes them visible. Add a "Bill status" filter toggle (Enacted / Proposed / Both).
**Effort:** S-M (6 hrs human / ~30 min CC+gstack)
**Priority:** P2
**Depends on:** RegIntel Sprint 1 shipped; customer feedback on which jurisdictions matter most

---

### TODOS-REG-03: Per-Regulation "Generate Action Plan" Button
**What:** A "Generate action plan" button per regulation card that calls Claude Haiku with the regulation summary + user's dimension scores to produce a targeted 3-step remediation specific to that regulation.
**Why:** Turns the RegulatoryWatch from a reading feature into an action feature. "What do I actually do about this regulation?" is the natural next question after reading a regulation card.
**Pros:** High perceived value. Uses existing BYOK pattern (same as ES-3). Pro-gated. Differentiates from generic regulatory newsletters.
**Cons:** Adds per-card API calls (each button press = one Haiku call). Requires BYOK. Cost borne by user.
**Context:** The regulation JSON already has `action_required` (generic). This feature makes it org-specific using their dimension scores. Pattern exists in aiSummary.ts.
**Effort:** S-M (3-4 hrs human / ~20 min CC+gstack)
**Priority:** P2
**Depends on:** RegIntel Sprint 1 shipped; ES-3 (BYOK pattern) working

---

### TODOS-QC-01: Test Suite — Regulatory Intelligence
**What:** Unit and integration tests for `cdnService.ts`, `regulatoryService.ts`, `db.ts` (regulatory_updates upsert/ack), and Cloudflare Worker (filter logic, Haiku response validation, R2 write order).
**Why:** Regulatory data directly affects compliance decisions. A silent bug in the fetch/cache/acknowledge flow could mean a customer misses a critical regulation.
**Pros:** Confidence shipping; regression protection for future Worker source additions.
**Cons:** No test framework currently set up (QC-2 deferred to V2 Tier 3).
**Context:** QC-2 overall test suite is a larger item. These regulatory-specific tests should be done as part of the RegIntel sprint or immediately after. Worker tests use Cloudflare's `vitest` Worker environment.
**Effort:** M (8 hrs human / ~30 min CC+gstack)
**Priority:** P2
**Depends on:** RegIntel Sprint 1 shipped

---

## P0 — Time-Sensitive / Blocking (Business/Legal)

### BLAW-01: Monitor Atlas Emails — Incorporation + EIN
**What:** Watch for two emails from Stripe Atlas: (1) incorporation confirmed, (2) EIN from IRS.
**Why:** EIN arrival starts the D-U-N-S clock (8 business days). Everything downstream (Apple Dev, Paddle) is blocked until EIN.
**Actions when incorporation email arrives:** File Idaho foreign entity registration (BLAW-02).
**Actions when EIN email arrives:** Start D-U-N-S same day (BLAW-04) + set up Mercury bank account (BLAW-03).
**Filed:** 2026-03-18 via Stripe Atlas. Legal name: AlphaPi, LLC (Delaware).
**Effort:** Passive — wait for emails
**Priority:** P0

---

### BLAW-02: Idaho Foreign Entity Registration
**What:** Register AlphaPi LLC as a foreign entity doing business in Idaho (where founder lives).
**Why:** Delaware LLC must register in any state where it has a physical presence (founder's home state = Idaho).
**How:** Idaho Secretary of State → sos.idaho.gov → Foreign LLC registration → ~$100 filing fee.
**Depends on:** BLAW-01 (incorporation email confirmed first)
**Effort:** XS (30 min, ~$100)
**Priority:** P0

---

### BLAW-03: Business Banking — Mercury
**What:** Open Mercury business checking account (pre-linked via Stripe Atlas).
**Why:** Required to receive Paddle payouts. Keep business and personal finances separate from day one.
**How:** Stripe Atlas dashboard → "Set up business banking" → Mercury account creation (Atlas pre-populates company info).
**Depends on:** BLAW-01 (EIN confirmed)
**Effort:** XS (15 min)
**Priority:** P0

---

### BLAW-04: D-U-N-S Number
**What:** Apply for D-U-N-S number via Dun & Bradstreet ($230 expedited, 8 business days).
**Why:** Required for Apple Developer Organization enrollment. No D-U-N-S = no Apple Dev = no macOS code signing = no distribution.
**How:** dnb.com → D-U-N-S request → select expedited ($230) → use exact legal name "AlphaPi, LLC" and EIN.
**CRITICAL:** Start this SAME DAY EIN arrives. Every day of delay = day later on Apple Dev enrollment.
**Depends on:** BLAW-01 (EIN confirmed)
**Effort:** XS to apply (20 min), then 8 business day wait
**Priority:** P0

---

### BLAW-05: Carrd Landing Page + Termly PP/ToS
**What:** Build Carrd landing page at getalphapi.com + generate PP/ToS via Termly.
**Why:** Required by Paddle (payment processor), Apple review, and GDPR/CCPA. Blocking launch.
**How:** Carrd.co ($19/yr) → build 1-page site → point getalphapi.com DNS to it. Termly.io (free) → generate PP + ToS → get hosted URLs → add to landing page footer + in-app Settings.
**Legal name to use:** AlphaPi, LLC
**Can start now** — does not require EIN or D-U-N-S.
**Effort:** S (3-4 hrs)
**Priority:** P0

---

### BLAW-06: alphalpi.com Redirect
**What:** Set up Cloudflare Redirect Rule on alphalpi.com → getalphapi.com.
**Why:** Typo domain owned — redirect prevents losing visitors. Also protects brand.
**How:** Cloudflare → alphalpi.com → Rules → Redirect Rules → forward all traffic to getalphapi.com (301).
**Depends on:** BLAW-05 (Carrd landing page live at getalphapi.com first)
**Effort:** XS (5 min)
**Priority:** P0

---

### BLAW-07: Apple Developer Organization Enrollment
**What:** Enroll in Apple Developer Program as Organization ($99/yr).
**Why:** Required for macOS code signing + notarization. Without this, app shows "unidentified developer" warning and Gatekeeper blocks install.
**How:** developer.apple.com → Enroll → Organization → requires D-U-N-S + legal name + phone verification from Apple.
**Depends on:** BLAW-04 (D-U-N-S confirmed)
**Effort:** XS (30 min to apply, Apple may call to verify)
**Priority:** P0

---

### BLAW-08: Keygen Account + Keys (GL-2)
**What:** Create Keygen.sh account, create product + policy, get KEYGEN_ACCOUNT_ID, KEYGEN_PRODUCT_ID, KEYGEN_PUBLIC_KEY.
**Why:** Currently app has DEV tier toggle hardcoded (LicensePanel.tsx ~154–187). Can't ship without real license validation.
**How:** keygen.sh → create account → create product "AlphaPi" → create license policy (binary: valid = Pro) → copy keys to .env.local.
**Also:** Remove DEV tier toggle (BLAW-11) once keys are wired and tested.
**Depends on:** BLAW-07 (Apple Dev for distribution context, but Keygen can be set up independently)
**Effort:** S (2 hrs)
**Priority:** P0

---

### BLAW-09: Paddle Payment Processor Setup (GL-5)
**What:** Create Paddle account, set up product + pricing, wire checkout into app.
**Why:** Revenue collection. Paddle is Merchant of Record — handles all VAT/GST globally.
**How:** paddle.com → create account → verify business (needs LLC + EIN + bank account) → create product "AlphaPi Pro" → get API keys → wire into app checkout flow.
**Depends on:** BLAW-01 (EIN), BLAW-03 (Mercury bank account)
**Effort:** M (4-6 hrs including app integration)
**Priority:** P0

---

### BLAW-10: In-App Support Link (mailto:)
**What:** Add `mailto:support@getalphapi.com` link in Settings footer.
**Why:** Required for Apple review. App must have a working support contact method.
**Where:** Settings footer — 5-minute code fix.
**Depends on:** Nothing (email routing already live)
**Effort:** XS (5 min)
**Priority:** P0

---

### BLAW-11: Remove DEV Tier Toggle (LicensePanel.tsx)
**What:** Remove the DEV tier toggle at `src/components/LicensePanel.tsx` ~lines 154–187.
**Why:** Pre-wired for testing. Must be removed before Apple submission — shipping with a bypass defeats the freemium model.
**Depends on:** BLAW-08 (Keygen keys wired and tested first)
**Effort:** XS (10 min)
**Priority:** P0

---

### BLAW-12: Make Repo Private (DI-2)
**What:** Set GitHub repo to private (currently public).
**Why:** Repo contains product name, architecture, and will contain Cloudflare Worker code. Must be private before adding secrets to GitHub Actions.
**How:** GitHub → repo Settings → Danger Zone → Change repository visibility → Private.
**Depends on:** Company registration complete (BLAW-01)
**Effort:** XS (2 min)
**Priority:** P0

---

### BLAW-13: File ® Trademark Registration
**What:** File USPTO trademark application for "AlphaPi" in Class 42 (Software as a Service).
**Why:** Common law ™ is sufficient at launch but ® gives nationwide legal presumption of ownership and ability to sue for infringement.
**How:** USPTO TEAS Plus application (~$250/class). Consider trademark attorney for filing (~$300-500).
**Depends on:** First revenue (need proof of commercial use in commerce)
**Timeline:** 90 days post-first-revenue
**Effort:** S (2-3 hrs DIY or hire attorney)
**Priority:** P0 (time-gated, not urgent now)

---

### BLAW-14: Tax Setup
**What:** Set up federal + state tax reminders and quarterly estimated payments.
**Why:** Single-member LLC = pass-through taxation. Quarterly estimated taxes due (IRS + Idaho). Missing payments = penalties.
**Federal:** IRS Form 1040-ES — quarterly (Apr 15, Jun 15, Sep 15, Jan 15).
**Idaho:** Idaho Form 41ES — quarterly estimated (same dates roughly).
**How:** Set calendar reminders. Consider simple bookkeeping from day one (Wave free, or QuickBooks Simple Start $15/mo).
**Depends on:** BLAW-01 (EIN + incorporation)
**Effort:** XS setup, ongoing quarterly
**Priority:** P0 (time-gated — first payment due based on when revenue starts)

---

## P3 — Lower Priority

### TODOS-MKT-01: Full Marketing Website (Track C)
**What:** Full Webflow/Framer marketing site: Home, How It Works, Pricing, Why AlphaPi, Blog/Resources, Contact.
**Why:** Carrd landing page is sufficient for launch but not for organic growth or enterprise credibility.
**Pros:** SEO, demo video embed, social proof, blog content reuses in-app help content (written once, used twice).
**Cons:** 20-40 hrs content + design + build. Significant investment before PMF confirmed.
**Context:** Track C from Help & Support backlog. Do after first revenue and validated GTM. Dimension explainers + ROI prep guide from in-app can be repurposed as website resource pages.
**Effort:** XL (40 hrs human / ~3 hrs CC+gstack)
**Priority:** P3
**Depends on:** First revenue; landing page (Carrd) live; domain active

---
