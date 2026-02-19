# AI Governance & ROI Assessment Tool

> **Know your AI risk. Prove your AI value. Before regulators ask.**

A guided desktop assessment that helps mid-market organizations measure AI governance maturity, identify blind spots across 6 risk dimensions, and calculate the ROI of their AI investments — without needing an AI governance team to get started.

**Coming soon.** Built for the August 2, 2026 EU AI Act enforcement deadline.

---

## The Problem

Most organizations using AI have no clear picture of their risk exposure:

- Employees are using AI tools IT doesn't know about (Shadow AI)
- Vendors are making decisions with your data using AI you didn't audit
- Boards want ROI numbers that nobody can produce
- EU AI Act enforcement starts August 2026 — with fines up to 3% of global revenue

Enterprise governance platforms cost $50,000–$150,000 and assume you already have a governance team. Free frameworks (NIST AI RMF, ISO 42001) are useful guides but provide no assessment, no scoring, no recommendations, and no output you can hand to a board.

**There's nothing in between — until now.**

---

## What It Does

The AI Governance & ROI Assessment Tool guides your organization through a structured 9-step wizard that:

1. **Profiles your organization** — maturity level (Experimenter → Builder → Innovator → Achiever) and operating regions
2. **Assesses 6 risk dimensions** — 10 calibrated questions each, tailored to your profile
3. **Scores your governance posture** — weighted risk scoring with dimension breakdowns
4. **Surfaces your blind spots** — specific gaps ranked by severity
5. **Delivers personalized recommendations** — immediate actions, 90-day playbooks, vendor questionnaires
6. **Calculates your ROI** — across cost savings, risk avoidance, productivity gains, and revenue impact

### The 6 Dimensions

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Shadow AI | 25% | Unauthorized AI tool usage, employee oversight, policy coverage |
| Vendor Risk | 25% | AI vendor contracts, SLAs, data handling, audit rights |
| Data Governance | 20% | Data quality, lineage, access controls, training data practices |
| Security & Compliance | 15% | Vulnerability management, regulatory alignment, incident response |
| AI-Specific Risks | 10% | Hallucination, bias, explainability, model drift controls |
| ROI Tracking | 5% | Measurement frameworks, baseline metrics, value attribution |

---

## Who It's For

- **Mid-market organizations** (50–5,000 employees) adopting AI without a dedicated governance team
- **CTOs and CIOs** who need board-ready AI risk and ROI reporting
- **Legal and compliance teams** preparing for EU AI Act, GDPR, CCPA, or ISO 42001 audits
- **Consultants and advisors** who want a structured tool to run client AI governance reviews

---

## Free vs Pro

| Feature | Free | Pro |
|---------|------|-----|
| Full 60-question assessment | ✓ | ✓ |
| Overall governance score | ✓ | ✓ |
| Top 3 blind spots | ✓ | ✓ |
| Generic recommendations | ✓ | ✓ |
| Basic ROI (cost savings only) | ✓ | ✓ |
| 1-page PDF summary | ✓ | ✓ |
| Full dimension-by-dimension breakdown | — | ✓ |
| All blind spots ranked by severity | — | ✓ |
| Customized 90-day implementation playbooks | — | ✓ |
| Full 30-question vendor questionnaire | — | ✓ |
| 5-dimension ROI dashboard | — | ✓ |
| Full PDF + DOCX export | — | ✓ |
| Implementation roadmap | — | ✓ |
| Assessment history & trend tracking | — | ✓ |

Pro pricing: **$500–$3,000** (one-time, per organization). Details on launch.

---

## Compliance Coverage

The tool is jurisdiction-aware. Questions and recommendations adapt based on your operating regions:

- **EU AI Act** (enforcement: August 2, 2026) — risk classification, prohibited practices, transparency requirements
- **ISO 42001** — AI management system standard (becoming enterprise-expected in 2026)
- **GDPR** — data processing, consent, automated decision-making (Article 22)
- **CCPA / CPRA** — California consumer rights, opt-out obligations
- **NIST AI RMF** — US voluntary framework for AI risk management

---

## Screenshots

> Screenshots coming soon. The app runs as a native desktop application on macOS (Windows and Linux in progress).

---

## Tech Stack

Built as a native desktop app — no cloud dependency, no data leaves your machine.

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Tauri v2](https://tauri.app/) (Rust) |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| State | Zustand |
| Local database | SQLite (tauri-plugin-sql) |
| PDF export | jsPDF + jsPDF-AutoTable |
| Auto-updater | tauri-plugin-updater |

---

## Development Setup

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Node.js](https://nodejs.org/) v18+
- Tauri system dependencies — see [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS

### Local development

```bash
git clone https://github.com/baltaguilar-tech/ai-governance-tool.git
cd ai-governance-tool
npm install
npm run tauri dev
```

### Build for production

```bash
npm run tauri build
```

Output is in `src-tauri/target/release/bundle/`.

---

## Project Status

This project is in active development. Current progress:

- [x] Full 9-step wizard UI
- [x] 240 assessment questions across 4 maturity profiles
- [x] Weighted scoring engine
- [x] Recommendation engine (free/pro gated)
- [x] Jurisdiction-aware question selection
- [ ] SQLite persistence (assessment history)
- [ ] Complete PDF/DOCX export
- [ ] Licensing (Keygen.sh integration)
- [ ] macOS code signing + notarization
- [ ] GitHub Releases / auto-updater
- [ ] Windows + Linux build validation

---

## License

Copyright 2026 baltaguilar-tech. All rights reserved.

Proprietary software. Unauthorized copying, redistribution, or commercial use of this software is prohibited.

---

## Contact

Questions, partnership inquiries, or early access requests: open an issue or reach out via GitHub.
