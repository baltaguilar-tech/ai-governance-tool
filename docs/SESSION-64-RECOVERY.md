# Session 64 Recovery Doc

*Written end-of-session 63, 2026-03-24. Read this at the start of Session 64.*

---

## Do These First

1. Read this file in full
2. Read last 30 lines of `session-summary.md`
3. Check git status -- commit any pending files before starting new work

---

## What Was Done Session 63

| Task | Status |
|---|---|
| Committed session 62 version string fixes | Done (8b60233) |
| Built confidentiality slide | Done (286eec6) |
| Researched Armanino website | Done |
| Researched financial services AI governance hook stat | Done |
| Specced sample assessment PDF in full | Done |
| Started building sample assessment PDF | NOT STARTED -- begin in session 64 |

---

## Git State

- Branch: main
- All session 63 work pushed to origin
- Latest commit: 286eec6 (confidentiality slide)
- Nothing uncommitted at session end (check with `git status` to confirm)

---

## Priority Task for Session 64: Sample Assessment PDF

Build `docs/sample-assessment-report.pdf` via `alphapi_sample_assessment.py` (new script).

### Build Rules (confirmed by user)
- One page at a time. One section at a time. Show output after every section. Wait for approval before next section.
- Use `qlmanage -t -s 1200 -o /tmp <file.pdf>` to preview -- never read PDF directly.
- Base on `alphapi_onepager.py` patterns (canvas, brand tokens, helpers).

---

## Sample Assessment PDF: Full Spec

### Meta
- Script: `alphapi_sample_assessment.py`
- Output: `docs/sample-assessment-report.pdf`
- Assessed org: Advisory Inc (fictional, financial services, Builder profile)
- Branding: AlphaPi throughout -- no white-label in this version
- Voice: Addresses Advisory Inc as "your organization"
- Watermark: AlphaPi logo, subtle, on EVERY page
- No "sample" label -- clean and professional
- Report title: **NOT YET CONFIRMED** -- ask user at session start before building

### Dimension Scores (confirmed)
| Dimension | Score | Risk Level | Weight |
|---|---|---|---|
| Shadow AI | 41/100 | High | 25% |
| Vendor Risk | 55/100 | Medium | 25% |
| Data Governance | 48/100 | High | 20% |
| Security & Compliance | 67/100 | Medium | 15% |
| AI-Specific Risks | 59/100 | Medium | 10% |
| ROI Tracking | 74/100 | Low | 5% |
| **Composite** | **53/100** | **Elevated Risk** | -- |

### Blind Spots (2-3 for Advisory Inc, financial services)
- Untracked employee use of ChatGPT and other consumer AI tools (Shadow AI)
- No AI disclosure requirements in vendor contracts (Vendor Risk)
- Sensitive financial data feeding AI tools without data handling agreements (Data Governance)

### Hook Stat (confirmed, Page 1 callout box)
"75% of financial services firms are actively using or exploring AI.
Only 12% have adopted an AI risk management framework."
Source: ACA Global, 2024 AI Benchmarking Survey

### ROI Sample Data (confirmed -- negative ROI to create urgency)
Gross Benefit Breakdown:
- Pillar 1: Efficiency (curve-adjusted): $94,500
- Pillar 2: Revenue uplift (curve-adjusted): $32,000
- Pillar 3: Risk mitigation value: $58,000
- Total gross benefits: $184,500

Total Cost of Ownership (TCO):
- Annual visible AI spend: $420,000
- Hidden costs: $87,000
- Total TCO: $507,000

3-Scenario Results:
- Conservative (0.6x): -$395,300 / -78% ROI
- Realistic (1.0x): -$322,500 / -64% ROI
- Optimistic (1.4x): -$249,700 / -49% ROI

Investment verdict: "Investment needs review" -- costs exceed benefits in all scenarios.

Bridge line (softened from app version):
"Improving governance maturity is consistently linked to stronger, sustained AI returns.
The gaps identified in this assessment are the most direct path to protecting this investment."

### Recommendations (3, not 5 -- confirmed)
One per top-risk dimension. Each gets 1-2 specific prescribed actions.
1. Shadow AI (41/100): AI tool inventory + quarterly audit process
2. Data Governance (48/100): Data handling policy for AI inputs + vendor data agreements
3. Vendor Risk (55/100): AI disclosure clause in all vendor contracts + third-party AI risk register

### 3-Page Structure (confirmed: Option A)

**Page 1:**
- Section 1: Header (AlphaPi logo, brand, report title, gold separator)
- Section 2: Org metadata block (Advisory Inc, Financial Services, Builder, date, composite score)
- Section 3: Hook stat callout box (75%/12%, ACA Global 2024)

**Page 2:**
- Section 1: Six dimension scores with risk level indicators
- Section 2: Blind spots summary (2-3 items)

**Page 3:**
- Section 1: ROI output (Gross Benefit Breakdown + TCO + 3 scenarios + investment verdict + bridge line)
- Section 2: 3 recommendations with prescribed actions
- Section 3: Confidentiality footer

---

## Armanino Context (for framing the report)

- They sell to financial services: Risk Assurance, Vendor Risk Management, SOC Audit, Cybersecurity, Internal Audit
- Their language: "regulatory compliance", "operational resilience", "stakeholder confidence", "data-driven decisions"
- Their AI tagline: "Make AI Your Unfair Advantage"
- Narpat Singh is Senior TPM -- he is evaluating whether Armanino would buy/use a tool like this with their clients
- The sample report is what Armanino would hand THEIR financial services clients
- Demo flow: Balt presents dimensions + reasoning, then presents this PDF as the output, hands it to Narpat for feedback

---

## Other Pending Tasks (after sample assessment is done)

4. Update SaaS product plan Section 15 -- add Review Responses feature
5. Second-pass review of all 15 SaaS product plan sections (one at a time, wait for approval)

---

## Brand Tokens
- dark-base: `#02093A` | dark-surface: `#0D1B4B` | accent-gold: `#FFCE20` | accent-blue: `#2B5CFF`
- Logo: `public/assets/alphapi-logo.png`
- Light text: `#B8C4D8`

## Working Rules (permanent)
- No em dashes
- One piece at a time
- Always challenge assumptions
- Ask before building
- Never read PDFs directly -- use `qlmanage -t -s 1200 -o /tmp <file.pdf>`
