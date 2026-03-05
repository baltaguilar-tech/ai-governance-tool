# Remaining Work Plan
*Created session 32 — 2026-03-05. All 16 items from project-plan.md confirmed complete.*

---

## Priority 1 — Immediate Actions (No Dev Work)

These have zero dependencies and can be done in minutes. Do these first.

| Item | Owner | LOE |
|---|---|---|
| Push 4 local commits to GitHub | Dev | 5 min |
| Choose product name (try namelix.com) | User | — |
| Create logo / icon mark (try looka.com) | User | — |

**Why now:** Pushing unblocks collaboration. Brand name is needed on the payment page, privacy policy, app icon, and marketing copy — everything downstream depends on it.

---

## Priority 2 — User Actions Required (Blockers for Dev)

These are not coding tasks — they require the user to complete external processes. They block large swaths of P3 and P4 work. Start them in parallel with P3 coding.

| Item | Blocks | LOE |
|---|---|---|
| Set up Keygen.sh account → get KEYGEN_ACCOUNT_ID, KEYGEN_PRODUCT_ID, KEYGEN_PUBLIC_KEY | LB-2 (license wiring) | 1–2 hrs |
| Choose payment processor (Paddle vs. LemonSqueezy) | LB-4 (payment integration) | Decision only |
| Register company entity | EV cert, Apple Dev Org, Windows build, repo privacy | Weeks (external) |
| Get D-U-N-S number (follow-on from company registration) | Apple Dev Organization account | 1–4 weeks (external) |
| Apply for Apple Developer account (Individual = $99/yr, no D-U-N-S needed) | LB-3 macOS code signing, notarization | Days (external) |
| Upgrade to Apple Developer Organization (after D-U-N-S) | Full notarization, enterprise sales | Weeks (external) |
| Purchase EV code signing certificate (after company registration) | Windows build, Windows signing | Days–weeks (external) |

**Note:** Apple Developer Individual account is enough to start macOS code signing and initial launch. Notarization also works with Individual. Organization account is only required when you want to publish under a company name on the Mac App Store or need enterprise MDM trust. Get Individual first; upgrade later.

---

## Priority 3 — Go-Live Gate (Must Complete Before Charging Money)

Ordered by dependency. LB-1 through LB-4 are the four intentionally pre-wired items from the code review.

| # | Item | File(s) | LOE | Blocked By |
|---|---|---|---|---|
| **GL-1** | Remove / disable Testing Mode (LB-1) | `src/utils/testing.ts` or wherever the toggle lives | XS — 30 min | Nothing |
| **GL-2** | Wire Keygen license validation (LB-2) | `src/services/license.ts`, `src/store/assessmentStore.ts` | L — 4–6 hrs | Keygen account keys in `.env.local` (P2) |
| **GL-3** | macOS code signing (LB-3) | `src-tauri/tauri.conf.json`, GitHub Actions CI | M — 2–4 hrs | Apple Dev account (P2) |
| **GL-4** | macOS notarization | `src-tauri/tauri.conf.json`, CI secrets | M — 2–3 hrs | Apple Dev account + D-U-N-S (P2) |
| **GL-5** | Payment processor integration (LB-4) | New: `src/services/payment.ts`, Settings UI | M — 3–5 hrs | Payment provider decision (P2) |
| **GL-6** | Auto-updater restoration | `src-tauri/tauri.conf.json`, `src/services/updater.ts` | M — 2–3 hrs | Nothing |
| **GL-7** | Privacy policy + terms of service | Static pages or in-app modal | S — 1–2 hrs | Product name (P1) |

**Total GL LOE: ~15–23 hours of dev time** (some blocked on external actions)

---

## Priority 4 — Pre-Launch Security Hardening

Small items, low effort, high trust signal. Do these before first public beta.

| # | Item | File | LOE |
|---|---|---|---|
| **SH-1** | CSP `connect-src` — add R2 domain explicitly | `src-tauri/capabilities/default.json` or CSP headers | S — 1 hr |
| **SH-2** | Source map exposure in production builds | `vite.config.ts` — disable source maps in `build` mode | XS — 30 min |
| **SH-3** | Draft hydration schema version check | `src/services/db.ts` — validate `schemaVersion` on load | S — 1 hr |

**Total SH LOE: ~2.5 hours**

---

## Priority 5 — Distribution Infrastructure

Unlocks wider distribution beyond "download from GitHub."

| # | Item | LOE | Blocked By |
|---|---|---|---|
| **DI-1** | CrabNebula CDN setup for binary delivery | S — 1–2 hrs | GL-3 code signing |
| **DI-2** | GitHub repo → private | XS — 5 min | Company registered (P2) |
| **DI-3** | Windows build pipeline (NSIS + MSI) | L — 4–8 hrs | Company + EV cert (P2) |
| **DI-4** | Windows code signing | M — 2–3 hrs | EV cert (P2) |

**Total DI LOE: ~8–14 hours** (DI-3/4 blocked on external registrations)

---

## Priority 6 — Quality & Compliance

Required before selling into enterprise or public sector accounts.

| # | Item | File(s) | LOE |
|---|---|---|---|
| **QC-1** | Accessibility: ARIA roles + screen reader support | `DimensionStep.tsx`, all wizard forms | M — 3–5 hrs |
| **QC-2** | Automated tests (unit + integration) | `src/__tests__/` — new directory | XL — 8–16 hrs |

**Total QC LOE: ~11–21 hours**

---

## Backlog — Post-Revenue Only

Do not build before first paying customer.

| Item | Notes |
|---|---|
| Regulatory Intelligence Agent | Architecture documented in `decisions.md`. LLM-assisted hybrid (RSS → Claude → R2 CDN). Pro-tier only. UX for existing users unsolved. |
| Assessment history comparison view | Show score delta between assessments over time |
| Team / multi-user mode | Shared assessments across org — requires auth layer |
| Mac App Store distribution | Requires sandboxing changes + App Store review |

---

## Summary by Priority

| Priority | Description | LOE | Hard Blockers |
|---|---|---|---|
| P1 — Immediate | Push + name + logo | Hours (user) | None |
| P2 — User Actions | Keygen, Apple Dev, company, EV cert | Weeks (external) | None |
| P3 — Go-Live Gate | License, signing, payment, updater, legal | ~15–23 hrs dev | P2 keys/accounts |
| P4 — Security Hardening | CSP, source maps, schema check | ~2.5 hrs | None |
| P5 — Distribution | CDN, Windows, repo privacy | ~8–14 hrs | P2 registrations |
| P6 — Quality | Accessibility, tests | ~11–21 hrs | None |
| Backlog | Regulatory agent, history, teams | TBD | First revenue |

**Total dev hours remaining to launch (macOS only): ~30–60 hours**
**Total dev hours remaining to full launch (macOS + Windows): ~40–75 hours**

---

*See also: `docs/decisions.md` for architectural context | `docs/windows-plan.md` for Windows-specific plan*
*Last updated: 2026-03-05 (session 32)*
