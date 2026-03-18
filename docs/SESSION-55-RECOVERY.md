# Session 55 Recovery Doc

*Written end-of-session 54 (2026-03-18). Read this at the start of Session 55.*

---

## Git State
- Branch: main
- Last commit: 36d1b46 — "Session 53: Termly PP progress, session recovery doc"
- **Uncommitted at session end:** CURRENT-SESSION.md (Session 54 entries) + SESSION-55-RECOVERY.md (this file)
- Commit these first thing Session 55.

---

## Session 54 Summary

### What happened:
1. **Termly Privacy Policy** — confirmed published (was done before session started)
2. **Termly Terms of Service** — built wizard end-to-end and published
   - Upgraded to Termly Starter ($0.30/day billed annually) to publish 2nd policy
   - Key settings: Idaho governing law, Ada County arbitration, informal negotiations then arbitration, 30-day mediation period, liability limited to amount paid, 6-month liability window, annual subscription auto-renews, Paddle payment processor
   - Custom clause added: Offline Data Processing
   - Privacy Policy URL entered as: https://www.getalphapi.com/privacy (future Carrd URL)
3. **Policy URL strategy confirmed**: Use Carrd pages at /privacy and /terms with Termly HTML embeds — NOT Termly-hosted URLs (URL option is PRO+)

---

## Immediate Next Actions (Session 55)

### Step 1: Git commit (2 min)
```bash
cd ~/Projects/ai-governance-tool
git add docs/CURRENT-SESSION.md docs/SESSION-55-RECOVERY.md
git commit -m "Session 54: Termly ToS published, Starter plan upgraded"
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_alphapi" git push origin main
```

### Step 2: Build Carrd Landing Page (~3-4 hrs)

**Before starting Carrd:**
1. Get Termly HTML embed codes for BOTH policies (need these for Carrd /privacy and /terms pages)
   - Termly → Privacy Policy → Add to Website → HTML Format → Copy to Clipboard → save somewhere
   - Termly → Terms and Conditions → Add to Website → HTML Format → Copy to Clipboard → save somewhere

**Carrd setup:**
1. Go to carrd.co → sign up for Pro Lite ($19/yr) — needed for custom domain + more than 1 page
2. Create new site → blank canvas
3. Build sections per content brief below
4. Add two additional pages: /privacy and /terms (paste Termly HTML embed into each)
5. Connect custom domain: getalphapi.com

**Carrd DNS (Cloudflare):**
- Carrd → site settings → Custom Domain → enter getalphapi.com → Carrd gives CNAME records
- Cloudflare → getalphapi.com → DNS → add CNAME records
- Wait 5-15 min propagation

---

## Carrd Landing Page — Content Brief

**Hero:**
> Headline: "AI Governance for Orgs That Don't Have an AI Governance Team"
> Subhead: "AlphaPi assesses your AI governance posture, surfaces your biggest blind spots, and tells you exactly what to fix — before the EU AI Act enforcement deadline."
> CTA: [Join the Waitlist] button → email form

**Problem (3 bullets):**
- 86% of organizations are blind to where AI is being used and what data it touches
- The average enterprise has 1,200+ unauthorized AI apps in use right now
- EU AI Act enforcement begins August 2, 2026 — penalties up to €35M or 7% of revenue

**Solution:**
> AlphaPi is a downloadable desktop assessment tool. Answer 60 guided questions across 6 governance dimensions and get a personalized action plan in under an hour — no consultants, no $50K enterprise contracts.

**Features (4 items):**
- Full governance assessment across 6 dimensions (Shadow AI, Vendor Risk, Data Governance, Security/Compliance, AI-Specific Risks, ROI Tracking)
- Personalized playbooks with prioritized remediation steps
- Multi-dimensional ROI framework — quantify the value of your AI investments
- 100% offline — your data never leaves your device

**Pricing:**
> $79/month billed annually ($790/yr)
> Free tier included — run a full assessment, see your overall score and top 3 blind spots at no cost.

**Waitlist CTA:**
> "Be first to know when AlphaPi launches."
> [Email input] [Join Waitlist] → sends to support@getalphapi.com

**Footer:**
- © 2026 AlphaPi, LLC
- [Privacy Policy] → /privacy
- [Terms of Service] → /terms
- [support@getalphapi.com]

---

## Pre-Launch Critical Path (updated)
1. ✅ Trademark search (AlphaPi clear)
2. ✅ Domain registered (getalphapi.com)
3. ✅ Email routing (support@getalphapi.com)
4. ✅ Delaware LLC filed (AlphaPi, LLC — Stripe Atlas, 2026-03-18)
5. ✅ Termly Privacy Policy published
6. ✅ Termly Terms of Service published
7. 🔲 Build Carrd landing page ← **DO FIRST in Session 55**
8. 🔲 Await incorporation email → Idaho foreign entity
9. 🔲 Await EIN email → D-U-N-S same day ($230, 8 biz days)
10. 🔲 Apple Developer Organization (after D-U-N-S)
11. 🔲 Keygen account + keys
12. 🔲 Paddle payment processor

---

## Environment
- Node: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node`
- Dev server: `cd ~/Projects/ai-governance-tool && npm run tauri dev`
- Git SSH: `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_alphapi" git push origin main`
- gh CLI: `~/bin/gh`
- Termly: app.termly.io (logged in, Starter plan)
- Stripe Atlas: dashboard.stripe.com (AlphaPi, LLC — incorporation pending)
