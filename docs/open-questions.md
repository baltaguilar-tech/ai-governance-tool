# Open Questions

Unresolved decisions to revisit. Remove items when resolved; add date resolved and decision made.

---

## Priority / Sequencing

- [x] **What's next?** RESOLVED 2026-02-18: Currently implementing Option B (maturity-adaptive question banks). After that, priority to be confirmed.
  - Next candidates: Dynamic scoring engine, SQLite persistence, PDF/DOCX export, Licensing

---

## Question System (Option B — In Progress)

- [ ] **Achiever Pro tier design** — Achiever-tier governance features are a separate Pro feature. What specifically is included? (E.g., automated AI control tower, continuous compliance dashboard, board reporting templates?)
- [ ] **Dashboard progress tracking mechanics** — User marks completed items, score goes up naturally. Where does this live? As a sidebar on the results page? As a separate "Your Action Plan" page? Do completed items persist (requires SQLite)?
- [ ] **Score disclaimer wording** — "Your score is relative to your maturity level" — what exact copy? Does UI show a label like "Experimenter Benchmark" next to the score?
- [ ] **Critical flag at wrong level** — If an Achiever answers basic questions as "not done," should the tool flag this more severely than for an Experimenter? Or treat the same way?

---

## Licensing

- [ ] **Keygen.sh account setup** — Has the user created a Keygen.sh account? What's the plan for pricing/payment integration (Stripe, LemonSqueezy, etc.)?
- [ ] **Offline grace period** — How many days offline before license check fails? (Keygen supports configurable grace periods)
- [ ] **License tier enforcement** — Currently `licenseTier` is hardcoded to `"professional"` in the Zustand store. Need to wire this to actual license validation before any real release.

---

## PDF/DOCX Export

- [ ] **Export scope for free tier** — Confirmed: 1-page PDF summary. What exactly goes on that 1 page? (Score gauge + top 3 blind spots + CTA?)
- [ ] **Pro PDF layout** — Multi-page? Table of contents? Brand colors?
- [ ] **DOCX** — Is docx.js the confirmed library, or is an alternative acceptable?

---

## Database / Persistence

- [ ] **SQLite schema** — What tables are needed? At minimum: `assessments` (full result JSON), `profiles` (org profile). Should responses be normalized or stored as JSON blob?
- [ ] **Assessment history UI** — Where does it live? Settings page? Separate route?

---

## Distribution & Signing

- [ ] **Apple Developer account** — Code signing for macOS requires an Apple Developer account ($99/yr). Does the user have one?
- [ ] **Windows code signing** — Requires EV certificate or Microsoft Partner Network. Plan?
- [ ] **CrabNebula** — Account created? Or using GitHub Releases only for now?

---

## Content Updates

- [ ] **Dynamic content server** — Architecture doc mentions custom HTTP fetch for updating questions/regulations/scoring weights. Has this been designed? Where would the server live?
- [ ] **Regulatory tracking** — EU AI Act deadline tracker — is this a live data feature or static content?

---

## Business / Go-to-Market

- [ ] **Pricing** — $500–$3K range noted. One-time purchase or annual? Tiered by org size?
- [ ] **Payment processor** — Stripe, LemonSqueezy, or Paddle? (Affects how licenses are generated)
- [ ] **Target launch date** — Before EU AI Act enforcement (Aug 2, 2026)?
