> [!NOTE]
> **Pre-launch beta** — Core functionality is complete. This build is unsigned (macOS Gatekeeper warning expected). See [TESTER-GUIDE.md](TESTER-GUIDE.md) for installation instructions.

> [!WARNING]
> **Beta testers:** Do not purchase a license key — use `BETA-TESTER-2026` to activate Pro features during testing.

---

# AlphaPi — AI Governance & ROI Assessment Tool

> **Know your AI risk. Prove your AI value. Before regulators ask.**

A guided desktop assessment that helps mid-market organizations measure AI governance maturity, identify blind spots across 6 risk dimensions, and calculate the ROI of their AI investments — without needing an AI governance team to get started.

**Target launch:** 2026 Q2. Built for the August 2, 2026 EU AI Act enforcement deadline and ISO 42001 adoption wave.

---

## Features

- **9-step guided wizard** — Welcome → Org Profile → 6 Assessment Dimensions → Results → Export
- **240 calibrated assessment questions** — 60 questions per maturity profile (Experimenter, Builder, Innovator, Achiever), dynamically selected based on org profile
- **6 governance dimensions** — Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security & Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- **Jurisdiction-aware** — Questions and recommendations adapt to EU, UK, US, APAC, LatAm, MEA; covers EU AI Act, GDPR, CCPA, ISO 42001, NIST AI RMF
- **Weighted risk scoring** — Overall governance score + per-dimension scores + blind spots ranked by severity
- **Personalized recommendations** — Immediate actions + 90-day playbooks + vendor questionnaires
- **ROI framework** — Financial + operational + innovation + customer + strategic value against direct + hidden + opportunity + risk costs
- **Draft persistence** — Auto-saves to local SQLite, no account required, no cloud
- **Executive Summary** — Board-framed 3-section summary (How governed / Exposure / ROI) in every PDF export; Pro + Anthropic API key unlocks AI-generated version (future)
- **PDF export** — Free multi-page summary (cover + exec summary + scores + gaps) + Pro full report with dimension detail, recommendations, and implementation roadmap
- **Auto-updater** — In-app update check and install via GitHub Releases (cryptographically signed)
- **Privacy-first** — All data stays on device; no telemetry, no cloud sync

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

- **Desktop shell:** [Tauri v2](https://tauri.app/) (Rust backend, no-Electron overhead)
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **State:** Zustand
- **Local database:** SQLite (`tauri-plugin-sql`) with auto-save
- **Settings/store:** `tauri-plugin-store` (notifications, legal acceptance, license)
- **Export:** jsPDF (PDF), docx.js (DOCX)
- **Updates:** `tauri-plugin-updater` + GitHub Releases (ed25519 signed)
- **Licensing:** Keygen.sh via `tauri-plugin-keygen` (pending activation)
- **Deep links:** `aigov://` scheme (QR license activation, progress reminders)

---

## Project Status

### Phase 1: App Completeness ✅ DONE
- [x] Full 9-step wizard UI (all steps rendered and wired)
- [x] 240 questions across 4 maturity profiles (all defined, scored, jurisdiction-aware)
- [x] Weighted scoring engine with dimension breakdown and blind spots
- [x] Recommendation engine (rules-based, free/pro gated)
- [x] SQLite draft persistence (auto-save, no account required)
- [x] PDF export (free summary + pro full report with roadmap)
- [x] React error boundaries (global + per-step graceful recovery)
- [x] Freemium gates (blind spots, recommendations, PDF depth, history)

### Phase 2: Settings, Licensing & Security ✅ DONE
- [x] Settings page (Account, License Key, Email, Notifications, Updates, About, My Data panels)
- [x] Account panel: Anthropic API key input (stored locally, format-validated, show/hide toggle)
- [x] Keygen.sh license service pre-wired (activation UI ready; awaiting Keygen account keys)
- [x] Notification reminders (30/60/90 day, tauri-plugin-notification)
- [x] Deep link handler (`aigov://activate`, `aigov://track`)
- [x] Security hardening (CSP, source map disabled in prod, SQLite schema version check)
- [x] Privacy Policy + Terms of Service (in-app modal + first-run acceptance gate)
- [x] Reset All Data (wipes SQLite + store, returns to Welcome)
- [x] Executive Summary card in Track Progress (board-framed, templated, tier-gated)

### Phase 3: Distribution ✅ MOSTLY DONE
- [x] GitHub Actions CI/CD release workflow (triggers on `v*` tags, matrix: arm64 + x86_64)
- [x] Auto-updater wired end-to-end (`tauri-plugin-updater`, ed25519 signed, GitHub Releases endpoint)
- [x] Tauri signing keypair generated; `TAURI_SIGNING_PRIVATE_KEY` added to GitHub Secrets
- [ ] macOS code signing — **blocked on Apple Developer account + D-U-N-S number**
- [ ] macOS notarization — **blocked on Apple Developer account + D-U-N-S number**
- [ ] Windows build (NSIS + MSI) — **blocked on EV code signing cert**

### Remaining Pre-Launch Gates
| Item | Blocked on |
|------|-----------|
| GL-2: Keygen license activation | Keygen.sh account setup |
| GL-3: macOS code signing | Apple Developer Organization account |
| GL-4: macOS notarization | Apple Developer + D-U-N-S number |
| GL-5: Payment processor | Company registration + payment provider decision |
| DI-1: CrabNebula CDN | GL-3 signing |
| DI-3/4: Windows build + signing | EV code signing cert |

### Known Limitations
- No automated tests (unit/integration tests not yet written)
- macOS builds are unsigned until GL-3 is complete (users will see Gatekeeper warning)
- Keygen.sh license validation not yet active (license UI is present but activation is disabled pending account setup)

---

## For Beta Testers

If you received a `.dmg` file from the AlphaPi team, see **[TESTER-GUIDE.md](TESTER-GUIDE.md)** — it has everything you need: installation steps, what to test, and how to send feedback.

**Quick summary:**
1. Mount the `.dmg` and double-click `Install AlphaPi.command`
2. Click **Open** if macOS asks for confirmation — this is expected for unsigned builds
3. The app installs to `/Applications` and launches automatically
4. To test Pro features: **Settings → License Key** → enter `BETA-TESTER-2026` → **Activate Key**
5. Send feedback to **balt.aguilar@outlook.com** with subject: *AlphaPi Beta Feedback*

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

The app opens in a dev window with hot-reload and DevTools enabled.

### Build for Production

```bash
npm run tauri build
```

Output is in `src-tauri/target/release/bundle/`.

### Publishing a Release

Push a version tag to trigger the CI/CD release workflow:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions builds signed macOS binaries (arm64 + x86_64), creates a GitHub Release (draft), and publishes `latest.json` for the in-app auto-updater. Review and publish the draft release on GitHub when ready.

**Required GitHub Secrets** (already configured):
- `TAURI_SIGNING_PRIVATE_KEY` — Tauri updater ed25519 private key
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` — empty string

**Future secrets** (add when Apple Developer account is ready):
- `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`

---

## License

Copyright 2026 baltaguilar-tech. All rights reserved.

Proprietary software. Unauthorized copying, redistribution, or commercial use is prohibited without explicit written permission.

---

## Contact

Questions, partnership inquiries, early access requests: open an issue on GitHub or reach out via [GitHub](https://github.com/baltaguilar-tech/ai-governance-tool).
