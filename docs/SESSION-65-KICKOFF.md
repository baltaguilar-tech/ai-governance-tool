# Session 65 Kickoff Prompt

*Paste this verbatim at the start of Session 65.*

---

Read `docs/SESSION-65-RECOVERY.md` in full, the last 30 lines of `session-summary.md`, and check git status. Then brief me.

We are building `docs/sample-assessment-report.pdf` via `alphapi_sample_assessment.py`. Pages 1 and 2 are done and committed (d49bdb3). Page 3 is not started.

Start with the bug fix before anything else: the gold bullet circles in `draw_blind_spots()` are sitting slightly low relative to their text baselines. Fix it, preview Page 2 only using the standalone method in the recovery doc, confirm the fix visually, then move to Page 3.

Page 3 build order -- one section at a time, preview after each, wait for my approval before the next:
1. Section 1: ROI output (gross benefits, TCO, 3 scenarios, verdict, bridge line) -- stacked vertical layout
2. Section 2: 3 recommendations (Shadow AI, Data Governance, Vendor Risk) -- each with dimension name, score, risk badge, and 1-2 prescribed actions
3. Section 3: Confidentiality footer -- one-liner, centered, gold separator above

All design decisions are locked in the recovery doc. Do not re-ask confirmed questions. Ask only if something is genuinely unspecified.

Build rules: base everything on `alphapi_onepager.py` canvas patterns. No em dashes. One section at a time.
