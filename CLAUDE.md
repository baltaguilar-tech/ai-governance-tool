# CLAUDE.md — AI Governance & ROI Assessment Tool

Auto-loaded project context for Claude Code. Keep this concise and current.

---

## Project Identity
- **What:** Commercial desktop app for AI governance assessment + ROI measurement
- **Who:** Mid-market orgs ($500–$3K price range) without a dedicated AI governance team
- **How:** Tauri v2 (Rust) + React 19 + TypeScript + Vite + Tailwind CSS
- **Model:** Freemium — free assessment + gated Pro exports/history/playbooks
- **GitHub:** https://github.com/baltaguilar-tech/ai-governance-tool (baltaguilar-tech)
- **Local:** `~/Projects/ai-governance-tool/`

## Key Reference Docs
- `docs/decisions.md` — architectural decisions and rationale
- `docs/session-log.md` — running work log (Claude appends after every 3–5 changes)
- `docs/open-questions.md` — unresolved items to revisit
- `docs/PRO-MITIGATIONS-MAP.md` — 1,246-line remediation guide for all 60 questions
- `docs/ai-governance-knowledge-base.md` — domain knowledge: what AI governance is, why it matters, 4-stage implementation model (Discover/Design/Deliver/Drive), EU AI Act/ISO 42001/GDPR context, and how it maps to this product's design

## Architecture Snapshot
- **Wizard flow:** Welcome → Org Profile → 6 Dimensions (10 Qs each) → Results → Export
- **6 Dimensions:** Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security/Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- **State:** Zustand (`src/store/assessmentStore.ts`)
- **Scoring:** `src/utils/scoring.ts` — weighted avg → risk level → achiever score
- **Recommendations:** `src/utils/recommendations.ts` — rules-based, free/pro gated
- **Questions:** `src/data/questions.ts` — 60 questions, all defined
- **Tauri backend:** `src-tauri/src/lib.rs` — plugins only, no custom Rust commands yet
- **Permissions:** `src-tauri/capabilities/default.json` — deny-by-default, scoped

## Build Status (updated 2026-02-17)
### Done ✓
- Full wizard UI (all 9 steps rendered)
- All 60 questions with scoring options
- Scoring engine + recommendation engine
- Zustand state management
- Tauri v2 setup with plugins (sql, store, updater, http, fs, dialog, process)
- Scoped capabilities / CSP

### Not Yet Built ✗
- SQLite persistence (no schema, no save/load, no assessment history)
- Licensing (Keygen.sh — currently hardcoded to "professional")
- PDF/DOCX export (skeleton exists in `src/utils/pdfExport.ts`, incomplete)
- Custom Rust IPC commands (zero beyond plugins)
- Settings page / preferences UI
- Auto-updater wiring + GitHub Releases config
- README (still generic Vite template placeholder)

## Competitive Context
- **Gap:** No affordable downloadable AI governance tool for mid-market
- **Enterprise:** OneTrust ($50–150K), IBM ($100K+), Credo AI ($50–100K)
- **Open-source:** VerifyWise (technical model governance, not org assessment)
- **Differentiator:** "AI governance for orgs that don't have an AI governance team"
- **Urgency:** EU AI Act enforcement Aug 2, 2026; ISO 42001 becoming expected in 2026

## Claude Instructions
- After every 3–5 meaningful changes, append a dated entry to `docs/session-log.md`
- Before building anything non-trivial, check `docs/open-questions.md`
- Log architectural decisions to `docs/decisions.md` when making design choices
- ALWAYS ask clarifying questions before starting a significant build
- ALWAYS flag things the user may have missed or not considered
