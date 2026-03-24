# Armanino Demo Prep Checklist

*Created 2026-03-24. Tracks all pre-demo tasks for the Armanino call and any similar presentations.*

---

## Status Key
- [ ] Not started
- [~] In progress
- [x] Done

---

## Contact & Outreach

- [x] Identify primary contact: Narpat Singh, Senior TPM, Armanino
- [x] Draft LinkedIn DM outreach message
- [x] Send one-pager PDF via LinkedIn DM (2026-03-24)
- [ ] Armanino call scheduled

---

## Leave-Behind Documents

- [x] One-pager PDF (`docs/alphapi-onepager.pdf`) — final/approved
- [ ] Reconstruct `alphapi_onepager.py` (generator script missing from disk — needed before any PDF changes)
- [ ] Confidentiality slide (full-screen PDF, dark navy + gold, for screen share at call start)
- [ ] Sample assessment PDF export (branded, representative client report output)

---

## Demo Environment

- [ ] Fix DMG auto-eject on reinstall (`Install AlphaPi.command`) — prevent duplicate volume mount when updating
- [ ] End-to-end demo run: Welcome → Shadow AI dimension → skip to pre-completed results → export PDF
- [ ] Confirm app launches cleanly from /Applications with no terminal interaction post-install
- [ ] Verify Back button works correctly across all dimensions (code exists, needs test)

---

## Supporting Materials

- [ ] `.cursorrules` file — context package for Cursor + Claude SaaS build
- [ ] PowerPoint Copilot prompt — 3-slide deck for Beta product presentation to program managers

---

## Demo Script (agreed approach)

1. Display confidentiality slide via screen share
2. Verbal confidentiality statement
3. Walk Shadow AI dimension live (~10 min)
4. Skip to pre-completed results dashboard (~5 min)
5. Export PDF and show leave-behind format (~5 min)
6. Transition to interview: "I'd love your honest reaction..." (~30 min)

**Key interview questions (from Section 13.1 of product plan):**
- "A user can complete one dimension in under 5 minutes or all six in under 30. How would your team use that flexibility?"
- "What would make this a must-have vs. a nice-to-have for a firm like Armanino?"
- "Do you see concerns or risks with the product as it stands?"
- "Would companies you work with see ROI measurement as a missing piece?"

---

## Carry-Over Features (Desktop → SaaS)

These items are tracked here for Armanino demo context and in `docs/saas-product-plan.md` Section 9 as SaaS carry-over requirements.

| Feature | Desktop Status | SaaS Priority |
|---|---|---|
| Responses tab (review + edit answers, live re-scoring) | Not yet built | High — core UX pattern |
| Back navigation across dimensions | Already works (Zustand prevStep) | Carry over as-is |
| Seamless update/reinstall (no duplicate mounts) | Fix pending | Medium — ops quality |

---

## Notes

- Product plan (`docs/saas-product-plan.md`) is NOT to be shared externally
- One-pager and sample assessment PDF are safe to share
- Formal NDA deferred to pilot stage — verbal framing + document notices for now
- All shared documents must include confidentiality footer
