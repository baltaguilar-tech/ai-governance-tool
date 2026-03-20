# CLAUDE.md — AI Governance & ROI Assessment Tool

Auto-loaded project context for Claude Code. Keep this concise and current.

---

## ⚠️ STRATEGIC PIVOT — READ FIRST (2026-03-20)

**This repository is Stage 0 — Desktop POC.** The project has pivoted to SaaS.

- This desktop app (v0.9.2-beta) is a **completed proof of concept**, not the target product
- All core logic — 252 questions, scoring engine, 6 dimensions, recommendations — will be **ported to a SaaS web app**
- The SaaS is being built as a **24-month acquisition target** (Armanino, RSM, Moss Adams, GRC platforms)
- **Do not add features to the desktop app.** It is frozen at v0.9.2-beta
- Full strategy: `docs/saas-maturity-model.md`
- All decisions: `docs/decisions.md` (Sessions 1–59)

### Immediate Next Actions
1. **User: call Armanino contact this week** — show desktop app demo, ask what a consulting firm needs
2. **Architecture session** — design SaaS data model, Supabase RLS, tech stack (Next.js + Supabase + Vercel)
3. **Write Armanino pitch** — AI governance urgency, why now, EU AI Act, product demo
4. **Stage 1 SaaS build** — 90 days, full-time, Cursor + Claude. Scope: multi-tenant auth, client profiles, wizard port, branded PDF

---

## Project Identity

- **What:** Stage 0 Desktop POC — AI governance assessment + ROI measurement tool
- **SaaS target:** Multi-tenant web platform for consulting firms + mid-market orgs
- **Who:** Consulting firms (primary channel) + mid-market orgs without a governance team
- **Acquisition target:** Armanino / RSM / Moss Adams / GRC platforms within 24 months
- **GitHub:** https://github.com/baltaguilar-tech/ai-governance-tool (baltaguilar-tech)
- **Local:** `~/Projects/ai-governance-tool/`
- **Company:** AlphaPi, LLC (Delaware, Stripe Atlas filed 2026-03-18)
- **Domain:** getalphapi.com (live, Carrd landing page)

## Key Reference Docs
- `docs/saas-maturity-model.md` — **START HERE** — full SaaS strategy + maturity model
- `docs/decisions.md` — all architectural decisions and rationale (Sessions 1–59)
- `docs/session-log.md` — running work log
- `docs/designs/regulatory-intelligence-agent.md` — RegIntel spec (Stage 2 SaaS feature)
- `docs/PRO-MITIGATIONS-MAP.md` — 1,246-line remediation guide (port to SaaS)
- `docs/ai-governance-knowledge-base.md` — domain knowledge, EU AI Act, ISO 42001

## Desktop App Architecture (Stage 0 — reference only, do not modify)
- **Wizard flow:** Welcome → Org Profile → 6 Dimensions (10 Qs each) → Results → Export
- **6 Dimensions:** Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security/Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- **State:** Zustand (`src/store/assessmentStore.ts`)
- **Scoring:** `src/utils/scoring.ts` — port this logic to SaaS unchanged
- **Questions:** Split by profile: `src/data/experimenter/`, `builder/`, `innovator/`, `achiever/` — port to SaaS
- **Tauri backend:** `src-tauri/src/lib.rs` — desktop only, not relevant to SaaS

## SaaS Target Architecture (Stage 1 — 90 days)
- **Stack:** Next.js + Supabase (auth + PostgreSQL + RLS) + Vercel + Tailwind CSS
- **Auth model:** Consulting firm = tenant. Client org = sub-tenant. Assessment = belongs to client org.
- **Multi-tenancy:** Supabase Row Level Security — design before writing code
- **PDF:** Consulting firm logo on output (replaces AlphaPi branding)
- **Port from desktop:** Scoring engine (pure TS), question banks, dimension weights, recommendation logic

## Competitive Context (verified 2026-03-20)
- **Gap confirmed:** No affordable SaaS AI governance assessment platform exists at any price point for mid-market
- **No white-label platform exists** for consulting firms — they build their own or use enterprise tools
- **Enterprise only:** OneTrust ($50–150K), Credo AI (custom enterprise pricing), Holistic AI (enterprise)
- **Open-source:** VerifyWise (technical model governance, not org assessment)
- **Consulting firm market:** RSM, Crowe, Tevora all do AI governance assessments manually — no platform
- **Our differentiator:** Affordable, guided, scored, white-labelable — built for consulting firms to use with clients

## Claude Instructions — PERMANENT
- **ALWAYS challenge assumptions** before accepting them. Never be compliant or appease. User explicitly requires direct pushback. Flag contradictions, unvalidated assumptions, legal/business risks before proceeding.
- After every 3–5 meaningful changes, append a dated entry to `docs/session-log.md`
- Log architectural decisions to `docs/decisions.md`
- ALWAYS ask clarifying questions before starting a significant build
- ALWAYS flag things the user may have missed

## gstack (Browser & QA Skills)
- Use `/browse` for ALL web browsing
- Available skills: `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/review`, `/ship`, `/browse`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/retro`, `/document-release`

## Session Start Protocol (AUTOMATIC — no prompting needed)
At the start of EVERY new session, before doing anything else:
1. Run: `ls docs/SESSION-*-RECOVERY.md | sort | tail -1` — find the most recent recovery file
2. Read that recovery file in full
3. Read the last 50 lines of `docs/CURRENT-SESSION.md`
4. Brief the user: "Here's where we left off: [2-3 sentence summary + immediate next actions]"
Do this automatically. The user should never have to ask for a briefing.

## Environment
- Node: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node`
- Dev server: `cd ~/Projects/ai-governance-tool && npm run tauri dev`
- Git SSH: `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_alphapi" git push origin main`
- gh CLI: `~/bin/gh`
- gstack: v0.7.0

## Dev Environment Cleanup (SQLite stale file recovery)
When app hangs on `Database.load()` in dev:
1. `pkill -f "ai-governance-tool"`
2. Delete `.db` + `.db-shm` + `.db-wal` from `~/Library/Application Support/com.baltaguilar-tech.ai-governance-tool/`
3. `npm run tauri dev`
