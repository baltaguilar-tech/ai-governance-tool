# Manual Test Plan — AI Governance Assessment Tool
# Run before each release. Session 17 baseline: fab4ee4
# ================================================================

## HOW TO RUN THIS PLAN

1. Build and launch the app in DEV mode: `npm run tauri dev`
2. Work through each test case in order
3. Mark each as PASS / FAIL / NOTE
4. For FAILs, note the exact step and what you observed
5. Keep a separate note of anything that "works but feels off" — UX issues

---

## MODULE 1 — App Launch & Navigation

### TC001 — App launches without errors
Steps:
1. Run `npm run tauri dev`
2. Observe the initial screen

Expected:
- Welcome/Home screen appears
- No console errors visible in dev tools
- Navigation (hamburger) is visible
- No loading spinner stuck

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC002 — Settings opens and closes
Steps:
1. Click the hamburger menu (☰)
2. Verify settings sidebar appears (push layout — content shifts right)
3. Click each of the 5 sections: License Key, Email, Notifications, About, My Data
4. Click outside settings or click (☰) again to close

Expected:
- Sidebar appears without breaking layout
- Each section loads without error
- Closing returns layout to normal
- No content is hidden behind the sidebar

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 2 — Organization Profile (Step 1)

### TC003 — Profile form completes correctly
Steps:
1. Enter organization name: "Acme Corp"
2. Select Industry: Healthcare
3. Select AI Maturity Level: Builder
4. Select Operating Regions: North America, Europe (multi-select)
5. Select Primary Location: United States
6. Click Next / Continue

Expected:
- All fields accept input
- Maturity level tooltip/description appears if applicable
- Multi-select regions work correctly
- Form advances to Shadow AI step

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC004 — Profile with special characters in org name
Steps:
1. Enter org name: "Acme & Co. — Test #1"
2. Complete rest of profile normally
3. Export a PDF after completing assessment

Expected:
- Org name displays correctly throughout the app
- PDF title uses a sanitized filename (spaces → dashes) but org name in PDF header is intact

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC005 — Profile change clears responses (regression)
Steps:
1. Complete all 10 Shadow AI questions for the current profile
2. Navigate BACK to the Profile step
3. Change AI Maturity Level from Builder to Innovator
4. Navigate forward to Shadow AI

Expected:
- WARNING: All previously entered responses are CLEARED
- Dimension shows blank (no pre-filled answers from the previous maturity level)
- This is CORRECT behavior — questions change per maturity level

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 3 — Assessment Dimensions (6 total)

Run TC006 for EACH dimension. Note any questions that feel confusing or have wrong answer order.

### TC006 — Dimension completes and scores correctly

Run for: [ ] Shadow AI  [ ] Vendor Risk  [ ] Data Governance
         [ ] Security   [ ] AI-Specific Risks  [ ] ROI Tracking

Steps (run once per dimension):
1. Answer ALL questions in the dimension with the WORST option (most risk)
2. Note the dimension score shown on the Results screen
3. Go back and answer ALL questions with the BEST option (least risk)
4. Note the dimension score — it should be significantly higher

Expected:
- All worst options → dimension score should be LOW (0–40 range)
- All best options → dimension score should be HIGH (70–100 range)
- No "undefined" or NaN in score display
- Progress indicator shows correct position in wizard

RESULT per dimension:
- Shadow AI: [ ] PASS  [ ] FAIL  Worst score: ___ Best score: ___
- Vendor Risk: [ ] PASS  [ ] FAIL  Worst: ___ Best: ___
- Data Governance: [ ] PASS  [ ] FAIL  Worst: ___ Best: ___
- Security: [ ] PASS  [ ] FAIL  Worst: ___ Best: ___
- AI-Specific Risks: [ ] PASS  [ ] FAIL  Worst: ___ Best: ___
- ROI Tracking: [ ] PASS  [ ] FAIL  Worst: ___ Best: ___


### TC007 — Partial completion guard
Steps:
1. Start a fresh assessment
2. Answer only 5 of 10 questions in Shadow AI
3. Try to navigate to the next dimension

Expected:
- If a guard exists: user is warned that not all questions are answered
- If no guard: the app advances but unanswered questions should not produce incorrect scores
- Note: partial dimension scores default to 50 (neutral) per current logic

RESULT: [ ] PASS  [ ] FAIL  [ ] NO GUARD EXISTS  Notes: _______________

---

## MODULE 4 — Results Dashboard

### TC008 — Overall score and risk level display
Steps:
1. Complete a full assessment (all 6 dimensions, mix of best/worst answers)
2. Observe the Results Dashboard

Expected:
- Overall score shown (0–100)
- Risk level badge visible: CRITICAL / HIGH / MEDIUM / LOW
- 6 dimension scores shown individually
- Achiever score shown
- Score disclaimer visible ("indicative only" footnote)

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC009 — Blind spots display correctly
Steps:
1. Complete assessment with mostly poor answers on 2–3 dimensions
2. View blind spots section on Results Dashboard

Expected:
- Up to 10 blind spots shown, capped at 2 per dimension
- Each blind spot has: title, severity badge, score, immediate action
- Blind spots with score > 40 are NOT shown (correct threshold)
- No duplicate blind spots from the same question

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC010 — Freemium gating (FREE tier)
Steps:
1. Confirm app is running in PRODUCTION mode (not DEV) OR manually set tier to 'free'
   In DEV: open assessmentStore.ts and temporarily change 'professional' to 'free'
2. View Results Dashboard

Expected:
- Only top 3 blind spots shown (not all)
- Full dimension breakdown hidden behind upgrade prompt OR shown only top-level
- "Download Pro Report" button shows upgrade tooltip, not download
- Basic ROI section shows; full ROI dashboard is locked

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC011 — Freemium gating (PRO tier in DEV)
Steps:
1. Confirm DEV mode is running (licenseTier = 'professional' automatically)
2. View Results Dashboard

Expected:
- All blind spots shown
- Full dimension breakdown visible
- Pro PDF download button is active (no lock)
- Full ROI dashboard accessible

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 5 — PDF Export

### TC012 — Free PDF: structure and layout

Generate a Free PDF with a completed assessment.

Page 1 — Cover:
[ ] Organization name appears correctly
[ ] Score circle is centered with score value inside
[ ] Risk level label is correct
[ ] Risk bars (6 dimensions) appear and are proportional
[ ] Maturity scale shows correct position highlighted

Page 2 — Executive Summary:
[ ] Para 1 starts with org name, lists 6 dimensions (no double maturity framing)
[ ] Para 2 names the LOWEST scoring dimensions as "greatest concern" (not highest)
[ ] Para 3 ends with a specific dimension name, not generic text
[ ] Dimension scores table shows all 6 dimensions
[ ] Score interpretation: higher = better governance is noted somewhere

Page 3 — Gap Areas:
[ ] Section opens on a NEW page (not overlapping exec summary)
[ ] Header says "Top Gap Areas" (not "Top Blind Spots")
[ ] Gap titles are formatted as findings ("No formal X", "Not yet: Y")
[ ] NOT raw question text ("Do you have...?")
[ ] Recommended Actions section appears below the table
[ ] Actions are readable (not crammed into a table cell)
[ ] Each action is numbered and has specific text (not repeated across gaps)

Upgrade CTA:
[ ] Upgrade box appears at the bottom
[ ] Copy is compelling and specific about what Pro includes

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC013 — Pro PDF: structure and content

Generate a Pro PDF with a completed assessment (DEV mode, pro tier).

Cover page:
[ ] PRO REPORT badge visible
[ ] Org name correct
[ ] Score circle on dark background — value readable
[ ] Risk bars on dark background

Page 2 — Executive Summary:
[ ] Same para quality checks as TC012 page 2
[ ] Blind spots table: Severity | Score | Gap Area (no Immediate Action column)
[ ] Gap Area shows formatted title (not raw question text)
[ ] Action blocks printed BELOW the table as numbered list
[ ] No "PRO" or "FREE" tier column visible anywhere on this page

Dimension pages (6 total, check at least 2):
[ ] Each dimension gets its own page with navy header
[ ] Questions are numbered Q1, Q2...
[ ] Selected answer is highlighted in green
[ ] Unselected options appear normally
[ ] For each flagged answer: action box appears BELOW the question table
[ ] Action text is DIFFERENT for different questions (not the same block repeating)
[ ] Action text is specific to the question topic

Recommendations page:
[ ] "Do these first — this week:" box appears at top (orange tint)
[ ] Top 3 CRITICAL/HIGH free items listed in box
[ ] Financial risk note appears below the box (cites dollar figures)
[ ] Recommendations table has 4 columns: Priority | Recommendation | Description | Timeline
[ ] NO "PRO" or "FREE" column
[ ] Priority colors: CRITICAL = red, HIGH = orange, MEDIUM = amber
[ ] Timeline values are readable (not "this-week" — should be "week" or "this week")

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC014 — PDF filename is correct
Steps:
1. Generate both Free and Pro PDFs for org named "Acme & Co."

Expected:
- Free PDF: `AI-Governance-Assessment-Acme-&-Co..pdf` (spaces → dashes)
- Pro PDF: `AI-Governance-PRO-Report-Acme-&-Co..pdf`
- Tauri save dialog opens (no OS alert box appears after saving)

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 6 — Track Progress Tab

### TC015 — Track Progress tab is accessible
Steps:
1. Complete an assessment
2. On Results Dashboard, click "Track Progress" tab

Expected:
- Tab switches without error
- DeltaBanner section visible (may show "Complete first assessment to see trends")
- MitigationTracker section visible
- SpendTracker section visible
- ROICalculator section visible

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC016 — ROI Calculator inputs and outputs
Steps:
1. Navigate to Track Progress → ROI Calculator
2. Enter sample values in each input field
3. Observe calculated output

Expected:
- No NaN or undefined in output
- Negative ROI is possible and displayed correctly
- Values update reactively as inputs change

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 7 — Settings Panels

### TC017 — License Panel
Steps:
1. Open Settings → License Key

Expected:
- Key input field is present
- Activate button is DISABLED (Keygen not yet installed)
- No error thrown
- QR code or manual entry instructions visible

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC018 — Email Panel
Steps:
1. Open Settings → Email
2. Enter a valid email: test@example.com
3. Click Save
4. Reopen settings — email should be persisted

Expected:
- Email saves to SQLite without error
- After reopen, field still shows the saved email
- Invalid email format shows validation error (if implemented)

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC019 — Notifications Panel
Steps:
1. Open Settings → Notifications
2. Toggle notifications ON
3. Close settings, reopen
4. Verify toggle state persists (stored in tauri-plugin-store)

Expected:
- Toggle state persists across settings open/close
- No error thrown

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC020 — Data Panel
Steps:
1. Complete an assessment
2. Open Settings → My Data
3. View the data displayed

Expected:
- Organization profile from Zustand store is shown
- Data is read-only (no edits from here)
- "Export My Data" or "Clear Data" option exists (if implemented)

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 8 — Data Persistence

### TC021 — Assessment survives app restart
Steps:
1. Complete a full assessment
2. Note the overall score
3. Quit and relaunch the app (Tauri desktop — not browser)
4. Navigate to results

Expected:
- Previous assessment is restored from SQLite
- Score matches what was shown before restart
- Track Progress data is also restored

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## MODULE 9 — Edge Cases & Stress Tests

### TC022 — Very long organization name
Steps:
1. Enter org name: "The International Association for Advanced AI Governance Research and Regulatory Compliance"
2. Complete and export both PDFs

Expected:
- PDF cover page: name wraps or truncates gracefully (does not overflow off page)
- PDF filename: spaces → dashes, file opens without error

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC023 — Score disclaimer is visible
Steps:
1. Navigate to Results Dashboard

Expected:
- Footnote text indicating scores are "indicative only" is visible somewhere
- Does not require scrolling past a fold to find

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________


### TC024 — No answers in a dimension
Steps:
1. Skip all questions in one dimension (if the UI allows)
2. Submit and view results

Expected:
- Skipped dimension defaults to score 50 (neutral) per current logic
- No crash or NaN in the score display
- Blind spots do not surface questions from the skipped dimension

RESULT: [ ] PASS  [ ] FAIL  Notes: _______________

---

## OBSERVATIONS LOG

Use this section to capture anything that "works but feels wrong":

| # | Where | What Felt Off | Severity (UX/Bug/Copy) |
|---|-------|---------------|------------------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## SUMMARY

- Total test cases: 24
- Passed: ___
- Failed: ___
- Notes requiring follow-up: ___

Share your FAIL items and Observations Log with Claude to prioritize fixes.
