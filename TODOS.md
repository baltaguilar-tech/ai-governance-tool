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
