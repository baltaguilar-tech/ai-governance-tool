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
- **252 calibrated assessment questions** — 63 questions per maturity profile (Experimenter, Builder, Innovator, Achiever), dynamically selected based on org profile
- **6 governance dimensions** — Shadow AI (25%), Vendor Risk (25%), Data Governance (20%), Security & Compliance (15%), AI-Specific Risks (10%), ROI Tracking (5%)
- **Jurisdiction-aware** — Questions and recommendations adapt to EU, UK, US, APAC, LatAm, MEA; covers EU AI Act, GDPR, CCPA, ISO 42001, NIST AI RMF
- **Weighted risk scoring** — Overall governance score + per-dimension scores + blind spots ranked by severity
- **Personalized recommendations** — Immediate actions + 90-day playbooks + vendor questionnaires
- **ROI framework** — Financial + operational + innovation + customer + strategic value against direct + hidden + opportunity + risk costs
- **Draft persistence** — Auto-saves to local SQLite, no account required, no cloud
- **Executive Summary** — Board-framed 3-section summary (How governed / Exposure / ROI) in every PDF export; Pro + Anthropic API key unlocks AI-generated narrative (Claude Haiku/Sonnet, one-time consent)
- **PDF export** — Free multi-page summary (cover + exec summary + scores + gaps) + Pro full report with dimension detail, recommendations, and implementation roadmap
- **Auto-updater** — In-app update check and install via GitHub Releases (cryptographically signed)
- **Privacy-first** — All data stays on device; no telemetry, no cloud sync

---

## Freemium Model

| Feature | Free | Pro |
|---------|------|-----|
| Full 252-question assessment | ✓ | ✓ |
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

**Pro pricing:** $79 one-time per organization.

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

*Last updated: 2026-03-19 (v0.9.2-beta). See [CHANGELOG.md](CHANGELOG.md) for full version history.*

### V1 Feature Set ✅ COMPLETE

All planned V1 features are built and shipping in v0.9.1-beta.

| Area | Status |
|------|--------|
| 9-step guided wizard | ✅ Done |
| 252 questions across 4 maturity profiles | ✅ Done |
| Weighted scoring engine + blind spots + recommendations | ✅ Done |
| SQLite draft + assessment history persistence | ✅ Done |
| Free PDF export (cover + exec summary + scores + gaps) | ✅ Done |
| Pro PDF export (full report + dimension detail + roadmap + AI narrative) | ✅ Done |
| Freemium gates throughout | ✅ Done |
| Settings (Account, License, Email, Notifications, Updates, My Data) | ✅ Done |
| Track Progress (delta banner, charts, mitigation tracker, spend tracker) | ✅ Done |
| ROI Calculator + ROI Model Builder (6-step, Pro-gated) | ✅ Done |
| AI-generated Executive Summary (ES-3) — BYOK Anthropic API | ✅ Done |
| Industry personalization in exec summary | ✅ Done |
| Energy & Utilities remote regulatory content | ✅ Done |
| GitHub Actions CI/CD (arm64 + x86_64) | ✅ Done |
| Auto-updater (ed25519 signed, GitHub Releases) | ✅ Done |
| Deep links (`aigov://activate`, `aigov://track`) | ✅ Done |
| Privacy Policy + Terms of Service (first-run gate) | ✅ Done |

### Remaining Pre-Launch Gates (Business / Infrastructure)

These are not code items — they are blocked on external business steps.

| Item | Status | Blocked on |
|------|--------|-----------|
| Landing page (getalphapi.com) | ✅ Live | — |
| Privacy Policy + Terms of Service | ✅ Published | — |
| Company registration (AlphaPi, LLC) | 🔄 Filed | Awaiting incorporation confirmation |
| GL-2: Keygen license activation | ⏳ Pending | Keygen.sh account setup |
| GL-3: macOS code signing | ⏳ Pending | Apple Developer Organization + D-U-N-S number |
| GL-4: macOS notarization | ⏳ Pending | Apple Developer + D-U-N-S number |
| GL-5: Payment processor (Paddle) | ⏳ Pending | Company registration |
| DI-1: CrabNebula CDN | ⏳ Pending | GL-3 signing |
| DI-2: Repo → private | ⏳ Pending | Company registration |
| DI-3/4: Windows build + signing | ⏳ Pending | EV code signing cert |

### Known Limitations (Beta)
- macOS builds are unsigned — Gatekeeper warning expected (use `Install AlphaPi.command`)
- License purchase not yet live — use `BETA-TESTER-2026` for Pro access
- DOCX export planned for V2
- No automated test suite yet (planned pre-enterprise)

---

## For Beta Testers

Download the latest `.dmg` from [GitHub Releases](https://github.com/baltaguilar-tech/ai-governance-tool/releases) or request a copy from the AlphaPi team. See **[TESTER-GUIDE.md](TESTER-GUIDE.md)** for full installation steps, what to test, and how to send feedback.

**Quick summary:**
1. Mount the `.dmg` and double-click `Install AlphaPi.command`
2. Click **Open** if macOS asks for confirmation — this is expected for unsigned builds
3. The app installs to `/Applications` and launches automatically
4. To test Pro features: **Settings → License Key** → enter `BETA-TESTER-2026` → **Activate Key**
5. Send feedback to **balt.aguilar@outlook.com** with subject: *AlphaPi Beta Feedback*

---

## Launching the App

### After installation via DMG (recommended)

Run `Install AlphaPi.command` from the mounted DMG — it installs to `/Applications`, strips the Gatekeeper quarantine flag automatically, and launches the app.

### If you dragged the app manually (or it won't open)

macOS Gatekeeper blocks unsigned apps launched by double-click. Run this once in Terminal:

```bash
xattr -cr /Applications/AlphaPi.app && open /Applications/AlphaPi.app
```

### Blank screen on launch?

If the app header shows but the main content is blank, stale SQLite lock files from a previous session may be blocking startup. Run:

```bash
pkill -f "AlphaPi"
rm -f ~/Library/Application\ Support/com.baltaguilar-tech.ai-governance-tool/*.db \
      ~/Library/Application\ Support/com.baltaguilar-tech.ai-governance-tool/*.db-shm \
      ~/Library/Application\ Support/com.baltaguilar-tech.ai-governance-tool/*.db-wal
open /Applications/AlphaPi.app
```

The app recreates a fresh database on next launch.

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

### Testing Free vs Pro Features (Dev Toggle)

The app includes a built-in tier override for testing freemium gates without a license key.

1. Launch the app (dev or production build)
2. Open **Settings → License Key**
3. Scroll to the bottom of the panel
4. Under **⚠️ Dev Testing Mode**, click **Free** or **Professional** to switch tiers instantly
5. Navigate to the Results Dashboard to see gated features respond

This override is session-only (resets on restart) and has no side effects. It must be removed from `src/components/settings/panels/LicensePanel.tsx` (lines ~154–187) before the production launch.

**Beta testers** (using the installed app, not dev mode): use license key `BETA-TESTER-2026` in Settings → License Key → Activate Key instead.

### Build for Production

```bash
npm run tauri build
```

Output is in `src-tauri/target/release/bundle/`.

### Publishing a Release

Push a version tag to trigger the CI/CD release workflow:

```bash
git tag v0.9.1-beta
git push origin v0.9.1-beta
```

GitHub Actions builds macOS binaries (arm64 + x86_64), creates a GitHub Release (pre-release), and publishes `latest.json` for the in-app auto-updater. Builds are unsigned until Apple Developer account is configured (GL-3).

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

Questions, partnership inquiries, early access requests:

- **Website:** [getalphapi.com](https://getalphapi.com)
- **Email:** support@getalphapi.com
- **GitHub:** [baltaguilar-tech/ai-governance-tool](https://github.com/baltaguilar-tech/ai-governance-tool)
