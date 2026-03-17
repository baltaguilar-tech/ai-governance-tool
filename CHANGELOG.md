# Changelog

All notable changes to AlphaPi are documented here.
Format: version → date → what changed.

---

## v0.9.1-beta — 2026-03-16

### Added
- **ROI Model Builder** — Pro-gated 6-step financial model wizard (Task Baseline, Efficiency, Revenue, Risk Mitigation, Hidden Costs, 3-scenario Results). Saves to SQLite. Accessible from Track Progress tab.
- **AI-generated Executive Summary (ES-3)** — Claude Haiku/Sonnet narrative via user-supplied Anthropic API key (BYOK). One-time consent modal. Opening + closing paragraphs bookend the structured exec summary. Free teaser (truncated) + Pro full narrative.
- **Industry personalization** — Exec summary opening and dimension insights adapt to org industry (Healthcare, Financial Services, Technology, Manufacturing, Government, Legal Services, and 8 more).
- **Energy & Utilities regulatory content** — Remote CDN-delivered gap guidance for Energy & Utilities organizations.
- **Pro PDF — Executive AI Narrative page** — AI-generated narrative now included in Pro PDF export when an AI summary has been generated.
- **Track Progress enhancements** — Delta banner (score change vs. last assessment), adoption snapshot charts, spend tracker, ROI calculator, mitigation tracker with custom items.
- **Assessment history** — Completed assessments saved to SQLite; Track Progress shows trend charts across multiple assessments.
- **Deep link handler** — `aigov://activate` and `aigov://track` URL scheme support.
- **Email capture modal** — Post-assessment email opt-in for product updates.

### Changed
- App renamed from "AI Governance Tool" to **AlphaPi**
- Wizard UI redesigned — ProfileStep 2-section layout, DimensionStep pill buttons with numbered progress dots and Lucide icons per dimension
- Question banks split by maturity profile — 252 questions total (63 per profile × 4 levels: Experimenter, Builder, Innovator, Achiever)
- 38 question improvements across all profiles (clarity, calibration, option wording)
- US regulatory coverage added (CCPA, NIST AI RMF, state privacy laws)
- Non-EU/UK jurisdiction gaps filled (APAC, LatAm, MEA)
- Scoring engine fully dynamic — no hardcoded question counts
- PDF export expanded — Free report includes cover + exec summary + scores + gaps; Pro adds dimension detail, recommendations, roadmap, AI narrative, and ROI data
- Settings page expanded — Account (Anthropic API key), License, Email, Notifications, Updates, My Data, About panels

### Fixed
- `operatingRegions` reference equality bug causing unnecessary re-renders
- TrackProgress data corruption on rapid tab switching
- SQLite stale lock file recovery (`.db-shm` / `.db-wal` cleanup)
- React Strict Mode double-invoke hang (`aliveRef` pattern)
- Pro PDF Executive AI Narrative page blank when narrative existed in SQLite

### Known Limitations
- App is unsigned — macOS Gatekeeper warning on first launch (use `Install AlphaPi.command` or `xattr -cr`)
- License purchase not yet available — use `BETA-TESTER-2026` for Pro access
- DOCX export not yet available
- Keygen.sh license validation UI present but inactive (pending account setup)
- Windows build not yet available

---

## v0.9.0-beta — 2026-03-01

Initial beta release.

- Full 9-step wizard (Welcome → Org Profile → 6 Dimensions → Results → Export)
- 60 questions (single question bank, pre-maturity-profile split)
- Weighted scoring engine + blind spots + recommendations
- SQLite draft persistence
- Free PDF export (1-page summary)
- Pro PDF export (multi-page full report)
- Settings: License Key, Email, Notifications, Updates, My Data
- GitHub Actions CI/CD release workflow
- Auto-updater wired (ed25519 signed, GitHub Releases endpoint)

---

*AlphaPi is proprietary software. This changelog is for internal and beta tester reference only.*
