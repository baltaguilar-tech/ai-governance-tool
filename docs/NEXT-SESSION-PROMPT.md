# Session 36 — SSH Keys, Reset Data, Tester Build, Executive Summary

We're continuing the AlphaPi AI Governance Tool project (Tauri v2 + React + TypeScript).
Project directory: ~/Projects/ai-governance-tool/

## Model usage rule (PERMANENT)
Use **Haiku** for ALL low-level work: file reads, exploration, grep/glob searches, memory reads, session-log appends.
Use **Sonnet** only for code generation and multi-file edits.

## Before doing anything else
1. `git log --oneline -5` — confirm local state
2. `git status` — confirm no unexpected changes
3. Read last 10 lines of `docs/session-log.md`

## Git state at session start
- origin/main = 78f0a84
- Local main = 68f97aa (README update) — 1 commit ahead, NOT yet pushed
- Pending push requires SSH auth (item 1 below)

---

## Item 1 — SSH Key Setup (10 min) — DO FIRST
Permanent fix for git push auth. No more PAT tokens.

```bash
# Step 1 — Generate key (run in Terminal)
ssh-keygen -t ed25519 -C "baltaguilar-tech" -f ~/.ssh/github_alphapi
# Press Enter twice (no passphrase)

# Step 2 — Show public key to add to GitHub
cat ~/.ssh/github_alphapi.pub
```

Then: github.com → Settings → SSH and GPG keys → New SSH key → paste pub key → title "AlphaPi MacBook"

```bash
# Step 3 — Switch remote to SSH and push
cd ~/Projects/ai-governance-tool
git remote set-url origin git@github.com:baltaguilar-tech/ai-governance-tool.git
git push
# Should push 68f97aa (README) cleanly
```

---

## Item 2 — Reset All Data Button (30 min)
Add a "Reset All Data" button to Settings → My Data panel.
- Purpose: lets non-developer testers wipe all assessment data without needing the terminal
- Behavior: clears SQLite database (assessments) + resets legalAccepted in settings.json
- UX: confirmation dialog before action ("This will permanently delete all assessment data.")
- After reset: app reloads (or redirects to Welcome step)
- Key files: `src/components/settings/panels/MyDataPanel.tsx`, `src/services/db.ts`

---

## Item 3 — Unsigned .app Build for Tester (30 min)
Build an unsigned .app for the friend/developer tester (Mac only).
- Run: `npm run tauri build` (unsigned)
- Output: `src-tauri/target/release/bundle/macos/*.dmg`
- Create tester handoff doc with Gatekeeper bypass instructions
- Gatekeeper bypass: right-click → Open (first time) OR System Settings → Privacy & Security → Open Anyway

---

## Item 4 — Executive Summary Feature Design (45 min)
Design + begin implementation of AI-personalized Executive Summary.

**Architecture decided (session 35):**
- BYOK model: user provides their own Anthropic API key (Option A)
- API key stored in tauri-plugin-store
- Direct device → Anthropic API call (no intermediary)
- Pro feature with 2-3 sentence free teaser as upgrade hook
- One-time internet connection disclosed upfront (consent flow)
- Privacy Policy update needed: adds exception to offline-first policy

**Where it appears:**
1. Results Dashboard — below overall score
2. Free PDF summary — teaser paragraph + "Upgrade for full narrative"
3. Pro PDF full report — full Executive Summary section

**Session 36 scope:** API key settings panel + consent flow design. Actual generation code in later session.

---

## After each item
1. Run tsc: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit`
2. Fix errors before moving on
3. Commit each item separately
4. Append to docs/session-log.md (Haiku subagent, single Bash echo)
5. Ask before pushing each commit

## Key env facts
- Tailwind v4 (no tailwind.config.js — theme defined in src/index.css)
- lucide-react installed (v0.564.0)
- Anthropic SDK: NOT installed yet (add in Item 4 if needed)
- Node: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node`
