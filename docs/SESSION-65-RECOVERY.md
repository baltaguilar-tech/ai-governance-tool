# Session 65 Recovery Doc

*Written end-of-session 64, 2026-03-24. Read this at the start of Session 65.*

---

## Do These First

1. Read this file in full
2. Read last 30 lines of `session-summary.md`
3. Check git status -- commit any pending files before starting new work

---

## What Was Done Session 64

| Task | Status |
|---|---|
| Report title confirmed: "AI Governance Assessment Report" | Done |
| Hook configured: UserPromptSubmit appends standing instruction | Done |
| alphapi_sample_assessment.py created | Done (committed) |
| Page 1, Section 1: Header (logo, brand, report title, separator) | Done, approved |
| Page 1, Section 2: Org metadata row + composite score donut | Done, approved |
| Page 1, Section 3: Hook stat callout box (75%/12%) | Done, approved |
| Page 2, Section 1: Dimension scores with progress bars + risk badges | Done, approved |
| Page 2, Section 2: Blind spots (3 items) | Done, needs ONE fix (see below) |
| Page 3: ROI + recommendations + footer | NOT STARTED |

---

## Outstanding Bug: Blind Spot Bullet Alignment

**File:** `alphapi_sample_assessment.py`, function `draw_blind_spots()`

**Issue:** Gold bullet circles are sitting slightly low relative to their text baselines. The bullet is drawn at `y - 3` but should be at approximately `y - 1` to align with the cap height of 8.5pt text.

**Fix:** Change `c.circle(MARGIN_L + 4, y - 3, 3, fill=1, stroke=0)` to `c.circle(MARGIN_L + 4, y - 1, 3, fill=1, stroke=0)` in `draw_blind_spots()`. Verify at preview.

---

## Page 3 Spec (NOT STARTED)

Build after fixing the bullet alignment bug. One section at a time, preview after each.

### Section 1: ROI Output

**Layout: Stacked vertical (Option B -- confirmed)**

**Gross Benefit Breakdown:**
- Efficiency (curve-adjusted): $94,500
- Revenue uplift (curve-adjusted): $32,000
- Risk mitigation value: $58,000
- Total gross benefits: $184,500

**Total Cost of Ownership (TCO):**
- Annual visible AI spend: $420,000
- Hidden costs: $87,000
- Total TCO: $507,000

**3 Scenarios (side by side or stacked rows):**
- Conservative (0.6x): -$395,300 / -78% ROI
- Realistic (1.0x): -$322,500 / -64% ROI
- Optimistic (1.4x): -$249,700 / -49% ROI

**Investment verdict:** "Investment needs review" -- costs exceed benefits in all scenarios.

**Bridge line:**
"Improving governance maturity is consistently linked to stronger, sustained AI returns.
The gaps identified in this assessment are the most direct path to protecting this investment."

### Section 2: 3 Recommendations

One per top-risk dimension. Each gets dimension name + score + risk badge + 1-2 prescribed actions.

1. **Shadow AI (41/100, High):**
   - Build an AI tool inventory across all departments.
   - Establish a quarterly audit process to identify new unsanctioned tools.

2. **Data Governance (48/100, High):**
   - Define a data handling policy covering all AI inputs.
   - Require vendor data agreements for any tool processing client or internal data.

3. **Vendor Risk (55/100, Medium):**
   - Add an AI disclosure clause to all vendor contracts.
   - Build a third-party AI risk register.

### Section 3: Confidentiality Footer

One-liner, bottom of Page 3:
"Confidential. Prepared by AlphaPi. Not for distribution."

Style: LIGHT_TEXT, Helvetica-Oblique, 7pt, centered. Gold separator line above it.

---

## Design Decisions (confirmed, do not re-ask)

| Decision | Value |
|---|---|
| Report title | "AI Governance Assessment Report" |
| Subtitle color | WHITE |
| Risk colors | High = #D94F4F, Medium = #2B5CFF, Low = #FFCE20 |
| Composite donut color | ACCENT_BLUE (#2B5CFF) |
| "Elevated Risk" label color | RISK_HIGH (#D94F4F) |
| Hook stat callout box style | Dark surface bg + gold left border (Option A) |
| Dimension score display | Progress bar + score number + risk badge (Option A) |
| Page 3 ROI layout | Stacked vertical (Option B) |
| Watermark | Bottom center, 15% opacity |
| Confidentiality footer | One-liner, LIGHT_TEXT, centered |

---

## Current Script State

- **File:** `alphapi_sample_assessment.py` (project root)
- **Output:** `docs/sample-assessment-report.pdf`
- **Pages written:** 1 (approved) + 2 (approved with bug noted above)
- **Page 3:** `draw_page3()` function does not exist yet -- add it

**Build order for Session 65:**
1. Fix bullet alignment bug in `draw_blind_spots()`
2. Preview Page 2 to confirm fix
3. Add `draw_page3()` with Section 1 (ROI), preview, get approval
4. Add Section 2 (recommendations), preview, get approval
5. Add Section 3 (footer), preview, get approval
6. Final full 3-page preview
7. Commit

---

## Other Pending Tasks (after sample assessment is done)

- Update SaaS product plan Section 15 -- add Review Responses feature
- Second-pass review of all 15 SaaS product plan sections (one at a time)

---

## Brand Tokens
- dark-base: `#02093A` | dark-surface: `#0D1B4B` | accent-gold: `#FFCE20` | accent-blue: `#2B5CFF`
- risk-high: `#D94F4F` | light-text: `#B8C4D8` | donut-track: `#1A2F6B`
- Logo: `public/assets/alphapi-logo.png`

## Working Rules (permanent)
- No em dashes
- One section at a time, preview after each, wait for approval
- Always challenge assumptions
- Never read PDFs directly -- use `qlmanage -t -s 1200 -o /tmp <file.pdf>`
- For multi-page PDF previews: `python3 -c "import sys; sys.path.insert(0, '.'); import alphapi_sample_assessment as s; from reportlab.pdfgen import canvas; from reportlab.lib.pagesizes import letter; c = canvas.Canvas('/tmp/pageN_preview.pdf', pagesize=letter); s.draw_pageN(c); c.save()"` then qlmanage
