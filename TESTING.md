# Beta Testing Guide — AI Governance Assessment Tool

Thank you for helping test this app. This guide walks you through installation, the main features, and how to share feedback.

---

## What This App Does

The AI Governance Assessment Tool helps organizations understand their exposure to AI governance risks — things like unauthorized AI tool usage, vendor liability, data governance gaps, and regulatory compliance. It asks up to 60 questions across 6 dimensions, scores your organization, and produces a detailed PDF report with action items.

---

## System Requirements

- macOS (Apple Silicon or Intel)
- Internet connection recommended on first launch (loads industry-specific regulatory guidance)

---

## Installation

1. **Download** `AI Governance Tool_0.1.0_aarch64.dmg` from the [Releases page](https://github.com/baltaguilar-tech/ai-governance-tool/releases)
2. **Open the .dmg** and drag **AI Governance Tool** to your Applications folder
3. **First launch:** macOS will block the app because it is not yet notarized. To open it:
   - Go to **Applications**, find **AI Governance Tool**
   - **Right-click → Open** (do not double-click)
   - Click **Open** in the security dialog
   - You only need to do this once

---

## First Launch

The app takes a few seconds to initialize on first open — you will see a loading screen while it sets up its local database and fetches regulatory content. This is normal.

---

## Running an Assessment

1. **Welcome screen** — Click **Start Assessment**
2. **Organization Profile** — Fill in your org name, industry, size, location, and AI maturity level. The app tailors questions to your profile.
3. **Assessment dimensions** — Six sections, up to 10 questions each:
   - Shadow AI (unauthorized tool usage)
   - Vendor Risk (third-party AI liability)
   - Data Governance
   - Security & Compliance
   - AI-Specific Risks (model drift, bias, explainability)
   - ROI Tracking
4. **Results** — Overall score, dimension breakdown, blind spots, and recommendations
5. **Export** — Generate a PDF report (see Pro Features below)

> **Tip:** Try different answer combinations to see how the scoring and recommendations change. The app saves your progress locally between sessions.

---

## Accessing Pro Features (Testing Mode)

The app has a free tier and a professional tier. For testing purposes, you can switch between them using **Testing Mode**:

1. Click the **hamburger menu** (≡) in the top-right corner
2. Go to **Settings → License Key**
3. Scroll to the bottom of that panel and toggle **Testing Mode**
4. Select **Professional** to unlock all Pro features

**Pro features include:**
- Full dimension score breakdown
- All blind spots (free tier shows top 3 only)
- Customized action playbooks
- Full PDF/DOCX export with per-question action items
- Track Progress & ROI dashboard with charts and PDF export

> **Note:** Testing Mode is a development feature that will be removed before commercial launch. Please do not share the app with others for this reason.

---

## Track Progress & ROI Tab

After completing an assessment, explore the **Track Progress** tab in the results dashboard:
- Log AI spend items (tools, compute, vendors)
- Record an adoption snapshot (active users, productivity gains)
- Track governance action item status
- Generate a **Track Progress PDF** (Pro) with spend summary, ROI snapshot, and action plan

---

## Industry-Specific Regulatory Guidance

If you select **Energy & Utilities** or **Healthcare** as your industry and **United States** as your primary location, the app will display industry-specific regulatory citations (NERC CIP, HIPAA, ONC HTI-1, etc.) alongside relevant blind spots and PDF action items.

---

## Known Limitations

- **Unsigned app** — macOS Gatekeeper requires the right-click → Open workaround on first launch. This will be resolved with Apple notarization before commercial release.
- **No auto-update** — This beta does not auto-update. If a new build is released, you will need to reinstall.
- **macOS only** — Windows support is in progress.
- **Testing Mode must be toggled manually** — There is no real license activation in this build.

---

## How to Provide Feedback

Choose whichever method is easiest for you:

### Option A — GitHub Issues (Recommended)
1. Go to [github.com/baltaguilar-tech/ai-governance-tool/issues](https://github.com/baltaguilar-tech/ai-governance-tool/issues)
2. Click **New Issue**
3. Use the title format: `[Beta] Brief description of issue or suggestion`
4. Include: what you were doing, what you expected, what happened instead, and your macOS version

### Option B — Direct Message
Send feedback directly to the developer. Include the app version (`v0.9.0-beta`) in your message so it can be tracked.

---

## Optional: Formal Test Plan

A structured test plan covering 24 specific test cases is available at [`docs/test-plan.md`](docs/test-plan.md) in this repository if you prefer a guided approach.

---

*Version: v0.9.0-beta | Build: f7da10a*
