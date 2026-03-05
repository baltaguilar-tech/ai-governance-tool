# Remaining Work Plan
*Created session 32 — updated session 33 (2026-03-05)*

---

## Priority 1 — Immediate Actions ✅ COMPLETE
| Item | Status |
|---|---|
| Push commits to GitHub | ✅ Done (session 32) |
| Choose product name | ✅ AlphaPi (session 33) |
| Create logo / icon mark | ✅ Integrated (session 33) |

---

## Priority 2 — User Actions Required (Blockers for Dev)

| Item | Blocks | Status |
|---|---|---|
| Set up Keygen.sh account → get KEYGEN_ACCOUNT_ID, KEYGEN_PRODUCT_ID, KEYGEN_PUBLIC_KEY | GL-2 license wiring | ⏳ Pending |
| Choose payment processor (Paddle vs. LemonSqueezy) | GL-5 payment integration | ⏳ Pending |
| Apply for Apple Developer account (Individual, $99/yr) | GL-3 code signing, GL-4 notarization | ⏳ Pending |
| Register company entity | EV cert, Apple Dev Org, Windows, repo privacy | ⏳ External (weeks) |
| Get D-U-N-S number | Apple Dev Organization upgrade | ⏳ External (weeks) |
| Purchase EV code signing cert | Windows signing | ⏳ External (weeks) |

---

## Priority 3 — Go-Live Gate

| # | Item | File(s) | LOE | Status |
|---|---|---|---|---|
| **GL-1** | Remove Testing Mode (LB-1) | LicensePanel, ResultsDashboard, assessmentStore | XS | ✅ Done (session 33) |
| **GL-2** | Wire Keygen license validation (LB-2) | `src/services/license.ts`, assessmentStore | L — 4–6 hrs | ⏳ Blocked on Keygen keys |
| **GL-3** | macOS code signing (LB-3) | `src-tauri/tauri.conf.json`, CI | M — 2–4 hrs | ⏳ Blocked on Apple Dev |
| **GL-4** | macOS notarization | `src-tauri/tauri.conf.json`, CI | M — 2–3 hrs | ⏳ Blocked on Apple Dev + D-U-N-S |
| **GL-5** | Payment processor integration (LB-4) | `src/services/payment.ts`, Settings UI | M — 3–5 hrs | ⏳ Blocked on payment decision |
| **GL-6** | Auto-updater restoration | `src-tauri/tauri.conf.json`, `src/services/updater.ts` | M — 2–3 hrs | 🔓 Unblocked |
| **GL-7** | Privacy policy + terms of service | Static pages or in-app modal | S — 1–2 hrs | 🔓 Unblocked |

---

## Priority 4 — Security Hardening

| # | Item | File | LOE | Status |
|---|---|---|---|---|
| **SH-1** | CSP connect-src — add R2 domain | `src-tauri/tauri.conf.json` | S | ✅ Done (session 33) |
| **SH-2** | Disable source maps in prod builds | `vite.config.ts` | XS | ✅ Done (session 33) |
| **SH-3** | Schema version check on hydration | `src/services/db.ts` | S | ✅ Done (session 33) |

---

## Priority 5 — Distribution Infrastructure

| # | Item | LOE | Status |
|---|---|---|---|
| **DI-1** | CrabNebula CDN setup | S — 1–2 hrs | ⏳ Blocked on GL-3 signing |
| **DI-2** | GitHub repo → private | XS | ⏳ Blocked on company registration |
| **DI-3** | Windows build pipeline (NSIS + MSI) | L — 4–8 hrs | ⏳ Blocked on EV cert |
| **DI-4** | Windows code signing | M — 2–3 hrs | ⏳ Blocked on EV cert |

---

## Priority 6 — Quality & Compliance

| # | Item | LOE | Status |
|---|---|---|---|
| **QC-1** | Accessibility: ARIA roles + screen reader | M — 3–5 hrs | ⏳ Pre-enterprise |
| **QC-2** | Automated tests (unit + integration) | XL — 8–16 hrs | ⏳ Pre-enterprise |

---

## Backlog — Post-Revenue Only
| Item | Notes |
|---|---|
| Regulatory Intelligence Agent | LLM-assisted hybrid (RSS → Claude → R2). Pro-tier only. Full notes in decisions.md. |
| Assessment history comparison | Score delta view across assessments |
| Team / multi-user mode | Requires auth layer |
| Mac App Store distribution | Requires sandboxing changes |

---

## Summary

| Priority | Description | LOE | Status |
|---|---|---|---|
| P1 — Immediate | Name + logo + push | Done | ✅ Complete |
| P2 — User Actions | Keygen, Apple Dev, company | External | ⏳ In progress |
| P3 — Go-Live Gate | License, signing, payment, updater, legal | ~15–23 hrs dev | 🔓 GL-6, GL-7 unblocked |
| P4 — Security Hardening | CSP, source maps, schema check | Done | ✅ Complete |
| P5 — Distribution | CDN, Windows, repo privacy | ~8–14 hrs | ⏳ Mostly blocked |
| P6 — Quality | Accessibility, tests | ~11–21 hrs | ⏳ Pre-enterprise |

**Dev hours remaining to macOS launch: ~20–40 hrs** (reduced from 30–60)

---

*See also: `docs/decisions.md` | `docs/windows-plan.md`*
*Last updated: 2026-03-05 (session 33)*
