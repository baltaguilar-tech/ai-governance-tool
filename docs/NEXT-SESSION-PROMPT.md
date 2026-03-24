## Context

I'm Balt, founder of AlphaPi, an AI governance assessment platform. I've been working with Claude across multiple sessions to build a comprehensive SaaS Product Plan and prepare for a validation call with Armanino (a consulting firm).

## What exists

All project files are in my mounted folder. Key files:

- `docs/saas-product-plan.md` -- 14-section product plan (~2100+ lines). Covers assumptions, JTBD, market landscape, business model, product strategy, architecture, risk register, MVP definition, validation plan, and definition of done. This is the master planning document.
- `docs/alphapi-onepager.pdf` -- Branded one-pager for the Armanino call. Dark theme, gold accents, stats block, dimension pills, How It Works steps, consulting firm value block. Final version approved.
- `alphapi_onepager.py` -- Python/reportlab script that generates the one-pager PDF. Located at project root (not in docs/).
- `session-summary.md` -- Running decision log with entries for 2026-03-21, 2026-03-23, 2026-03-23 (review), and 2026-03-24. READ THIS FIRST to understand all decisions made.
- `src/assets/alphapi-logo.png` -- Brand logo (gold geometric "A" + Pi symbol).

## Key product details

- Desktop POC exists: Tauri v2 + React 19 + TypeScript + Vite, SQLite, Zustand, 252 questions, 6 dimensions
- SaaS target stack: Next.js + Supabase + Vercel + Tailwind CSS
- Multi-tenant B2B2B model: AlphaPi -> Consulting Firm -> Client Organization
- 6 governance dimensions: Shadow AI, Vendor Risk, Data Governance, Security & Compliance, AI-Specific Risks, ROI Tracking
- Dimension-selective UX: users choose which dimensions to assess first, can return for the rest
- Assessment timing: under 5 minutes per dimension, under 30 minutes for all six
- Brand colors: dark-base #02093A, dark-surface #0D1B4B, accent-gold #FFCE20, accent-blue #2B5CFF, accent-cyan #0FFFA9

## Outstanding tasks (in priority order)

1. **Armanino call prep deliverables:**
   - Confidentiality slide (for screen share at start of call)
   - Sample assessment PDF export (second leave-behind document alongside the one-pager)

2. **Full second-pass review** of all 14 sections of the product plan

3. **Create `~/.claude/session-index.md`** -- master index of all projects and their session-summary locations

4. **Fix support@getalphapi.com** email routing from Outlook (works from other email services, fails from Outlook)

## Working rules

- Read `session-summary.md` first to understand all prior decisions
- No em dashes anywhere in any document
- Work iteratively: one piece at a time, deliver, wait for review
- Always challenge ideas, provide counter-opinions, ask questions
- When presenting options: 2-3 choices with reasoning and at least one opposing perspective per option
- Maintain the decision log in session-summary.md (append, never overwrite)
- The product plan document is NOT to be shared externally
