# Remaining Work Plan
*Created session 32 — updated session 35 (2026-03-05)*

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

## Business Setup — Correct Order & Phase Plan
*Documented session 34. Full details in `memory/business-setup.md`.*

### Dependency Chain
```
Legal Entity (LLC/Corp)
    ├── EIN → Business bank account
    ├── D-U-N-S ──────────────► Apple Developer (Organization) → GL-3, GL-4, GL-6
    ├── Domain + Website ──────► EV Code Signing Cert (Windows) → DI-3, DI-4
    │                            Payment Processor → GL-5
    └── EV Cert ───────────────► Windows distribution, Repo → private
```

### Phase 1 — Day 1 (parallel)
- **1a. Register domain** (`alphapi.com` or similar) — Do TODAY, ~$12/yr, no company required
- **1b. Form legal entity** — LLC (home state, ~$50–300) or Delaware C-Corp via Stripe Atlas ($500 incl. EIN + Mercury bank)

### Phase 2 — Days 2–5 (after company filed)
- **2a. Get EIN** — Free, instant via IRS.gov
- **2b. Request D-U-N-S** — Via Apple's enrollment portal (free; D&B direct = $229). Takes **5–30 business days** — START IMMEDIATELY. This is the longest gate.
- **2c. Build website** — While waiting for D-U-N-S. Must include Privacy Policy + ToS. Required for EV cert CA verification and payment processor.
- **2d. Open business bank account** — After EIN. Mercury or Brex.

### Phase 3 — After D-U-N-S (~2–5 weeks)
- **3a. Apple Developer Program (Organization)** — $99/yr. Requires D-U-N-S + legal entity. Unblocks GL-3, GL-4, GL-6 end-to-end.
- **3b. EV Code Signing Cert (Windows)** — DigiCert or Sectigo, ~$300–500/yr. Requires legal entity + domain. Takes 1–5 days. Unblocks DI-3, DI-4.

### Phase 4 — After Apple Dev + EV Cert
- **4a. Payment processor** — Paddle or LemonSqueezy. Requires website + legal entity + bank.
- **4b. CI/CD code signing** — GitHub Actions secrets (Apple cert + Windows EV cert)
- **4c. GitHub repo → private**

### ⚠️ Flagged — Do Before Spending on Company Formation
- **Trademark search for "AlphaPi"** — Check USPTO TESS (Class 42), EU EUIPO, UK IPO BEFORE filing company or buying domain. If name is taken, know now.
- **Privacy Policy + Terms of Service** — Must exist before website goes live AND before first paid sale. Draft in GL-7 (in-app); also needed for website. Have a lawyer review — AlphaPi is a compliance product.
- **Business Insurance** — E&O / Professional Liability + Cyber liability. ~$500–2,000/yr. Providers: Embroker, Vouch, Hiscox. Obtain before first paid sale. Critical for a compliance assessment tool.

---

## Priority 3 — Go-Live Gate

| # | Item | File(s) | LOE | Status |
|---|---|---|---|---|
| **GL-1** | Remove Testing Mode (LB-1) | LicensePanel, ResultsDashboard, assessmentStore | XS | ✅ Done (session 33) |
| **GL-2** | Wire Keygen license validation (LB-2) | `src/services/license.ts`, assessmentStore | L — 4–6 hrs | ⏳ Blocked on Keygen keys |
| **GL-3** | macOS code signing (LB-3) | `src-tauri/tauri.conf.json`, CI | M — 2–4 hrs | ⏳ Blocked on Apple Dev |
| **GL-4** | macOS notarization | `src-tauri/tauri.conf.json`, CI | M — 2–3 hrs | ⏳ Blocked on Apple Dev + D-U-N-S |
| **GL-8** | Beta tester bypass (BETA-TESTER-2026 key) | `src/services/license.ts`, LicensePanel, App.tsx | — | ✅ Done (session 37) |
| **GL-5** | Payment processor integration (LB-4) | `src/services/payment.ts`, Settings UI | M — 3–5 hrs | ⏳ Blocked on payment decision |
| **GL-6** | Auto-updater restoration | `src-tauri/tauri.conf.json`, `src/services/updater.ts` | M — 2–3 hrs | ✅ Done (session 35) |
| **GL-7** | Privacy policy + terms of service | Static pages or in-app modal | S — 1–2 hrs | ✅ Done (session 35) |

---

## Priority 3B — Beta Tester Readiness (session 37)

| # | Item | Status |
|---|---|---|
| **BT-1** | SSH key setup (github_alphapi ed25519), remote switched to SSH | ✅ Done |
| **BT-2** | Install AlphaPi.command — DMG installer script | ✅ Done |
| **BT-3** | TESTER-GUIDE.md — step-by-step guide + feedback template | ✅ Done |
| **BT-4** | README For Beta Testers section + NOTE banners | ✅ Done |
| **BT-5** | expectedAISpend → ROI Tracking feature | ⏳ Session 37 in progress |
| **BT-6** | Reset All Data button in Settings | ⏳ Session 37 in progress |
| **BT-7** | Unsigned .app build for tester | ⏳ Session 37 in progress |
| **BT-8** | Executive Summary API key settings panel + consent flow | ⏳ Session 37 in progress |

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
| P3 — Go-Live Gate | License, signing, payment, updater, legal | ~15–23 hrs dev | 🔓 GL-6, GL-7 done (session 35) |
| P4 — Security Hardening | CSP, source maps, schema check | Done | ✅ Complete |
| P5 — Distribution | CDN, Windows, repo privacy | ~8–14 hrs | ⏳ Mostly blocked |
| P6 — Quality | Accessibility, tests | ~11–21 hrs | ⏳ Pre-enterprise |

**Dev hours remaining to macOS launch: ~20–40 hrs** (reduced from 30–60)

---

*See also: `docs/decisions.md` | `docs/windows-plan.md`*
*Last updated: 2026-03-06 (session 37)*
