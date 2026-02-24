[!WARNING]
**Work in Progress** — This project is under active development. Features, APIs, and documentation are incomplete and subject to change without notice. Not ready for production use until Phase 2 is complete.

---

# AI Governance & ROI Assessment Tool

> **Know your AI risk. Prove your AI value. Before regulators ask.**

A guided desktop assessment that helps mid-market organizations measure AI governance maturity, identify blind spots across 6 risk dimensions, and calculate the ROI of their AI investments — without needing an AI governance team to get started.

**Target launch:** 2026 Q2. Built for the August 2, 2026 EU AI Act enforcement deadline and ISO 42001 adoption wave.

---

## Features

- **9-step guided wizard** — Welcome → Org Profile (maturity level + regions) → 6 Assessment Dimensions → Results → Export
- **240 calibrated assessment questions** — 60 questions per maturity profile (Experimenter, Builder, Innovator, Achiever), dynamically selected based on org profile
- **6 governance dimensions** — Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security & Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- **Jurisdiction-aware** — Questions and recommendations adapt to EU, UK, US, APAC, LatAm, MEA; covers EU AI Act, GDPR, CCPA, ISO 42001, NIST AI RMF
- **Weighted risk scoring** — Overall governance score + per-dimension scores + blind spots ranked by severity
- **Personalized recommendations** — Immediate actions + 90-day playbooks + vendor questionnaires
- **ROI framework** — Financial + operational + innovation + customer + strategic value against direct + hidden + opportunity + risk costs
- **Draft persistence** — Auto-saves to local SQLite, no account required, no cloud
- **PDF export** — Free 1-page summary + Pro full report with implementation roadmap
- **React error boundaries** — Graceful error handling and recovery

---

## Freemium Model

| Feature | Free | Pro |
|---------|------|-----|
| Full 240-question assessment | ✓ | ✓ |
| Overall risk score | ✓ | ✓ |
| Top 3 blind spots | ✓ | ✓ |
| Generic recommendations | ✓ | ✓ |
| 1-page PDF summary | ✓ | ✓ |
| **All blind spots (ranked by severity)** | — | ✓ |
| **Full dimension-by-dimension breakdown** | — | ✓ |
| **Customized playbooks & vendor questionnaire** | — | ✓ |
| **Full ROI dashboard** | — | ✓ |
| **Full PDF + DOCX export** | — | ✓ |
| **Implementation roadmap** | — | ✓ |
| **Assessment history & trends** | — | ✓ |

**Pro pricing:** $500–$3,000 (one-time, per organization).

---

## Assessment Dimensions

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| **Shadow AI** | 25% | Unauthorized AI tool usage, employee oversight, policy coverage, adoption risk |
| **Vendor Risk** | 25% | AI vendor contracts, SLAs, data handling, audit rights, vendor lock-in |
| **Data Governance** | 20% | Data quality, lineage, access controls, training data practices, bias detection |
| **Security & Compliance** | 15% | Vulnerability management, regulatory alignment, incident response, model security |
| **AI-Specific Risks** | 10% | Hallucination, bias, explainability, model drift, autonomous decision risks |
| **ROI Tracking** | 5% | Measurement frameworks, baseline metrics, value attribution, spend tracking |

---

## Why This Exists

**The problem:** Most organizations using AI have no clear picture of their risk exposure or ROI. Employees are using AI tools IT doesn't know about. Vendors are making decisions with your data. Boards want ROI numbers nobody can produce. EU AI Act enforcement (August 2026) carries fines up to €35M or 7% of global revenue.

**The gap:** Enterprise governance platforms (OneTrust, IBM, Credo AI) cost $50,000–$150,000+ and assume you have a dedicated governance team. Free frameworks (NIST AI RMF, ISO 42001) are useful guides but provide no assessment, no scoring, no recommendations, no output for your board.

**Our answer:** An affordable ($500–$3K), downloadable, guided assessment for mid-market organizations. No cloud. No account. No assumption of a governance team.

---

## Tech Stack

Built as a native desktop application — no cloud dependency, no data leaves your machine.

- **Desktop shell:** [Tauri v2](https://tauri.app/) (Rust backend, no-electron overhead)
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **State:** Zustand
- **Local database:** SQLite (tauri-plugin-sql) with auto-save
- **Export:** jsPDF (PDF), docx.js (DOCX)
- **Updates:** Tauri updater + custom HTTP content sync

---

## Project Status

### Phase 1: App Completeness ✓ DONE
- [x] Full 9-step wizard UI (all steps rendered and wired)
- [x] 240 questions across 4 maturity profiles (all defined, scored, jurisdiction-aware)
- [x] Weighted scoring engine with dimension breakdown and blind spots
- [x] Recommendation engine (rules-based, free/pro gated)
- [x] SQLite draft persistence (auto-save, no account required)
- [x] PDF export (free summary + pro full report with roadmap)
- [x] React error boundaries (global + per-step graceful recovery)
- [x] Freemium gates (blind spots, recommendations, PDF depth, history)

### Phase 2: Monetization — IN PROGRESS
- [ ] Keygen.sh licensing integration (feature entitlements, offline grace period)
- [ ] Settings page (profile edit, export history, license management)
- [ ] Spend tracker UI (link assessments to AI spend data)
- [ ] Pro tier unlock flow (landing page, pricing, payment link)

### Phase 3: Distribution — PENDING
- [ ] GitHub Actions CI/CD (build on release tags)
- [ ] macOS code signing + notarization (Apple Developer account)
- [ ] GitHub Releases auto-updater (tauri-plugin-updater wiring)
- [ ] Windows + Linux build validation

### Known Limitations
- No automated tests (unit/integration tests not yet written)
- No privacy policy or terms of service
- macOS notarization not yet configured
- Keygen.sh licensing not yet active (currently hardcoded to 'professional' tier in dev)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Rust](https://rustup.rs/) (stable)
- [Tauri system dependencies](https://tauri.app/start/prerequisites/) for your OS

### Local Development

```bash
git clone https://github.com/baltaguilar-tech/ai-governance-tool.git
cd ai-governance-tool
npm install
npm run tauri dev
```

The app will open in a dev window with hot-reload enabled.

### Build for Production

```bash
npm run tauri build
```

Output is in `src-tauri/target/release/bundle/`.

---

## License

Copyright 2026 baltaguilar-tech. All rights reserved.

Proprietary software. Unauthorized copying, redistribution, or commercial use is prohibited without explicit permission.

---

## Contact

Questions, partnership inquiries, early access requests: open an issue on GitHub or reach out via [GitHub](https://github.com/baltaguilar-tech/ai-governance-tool).
