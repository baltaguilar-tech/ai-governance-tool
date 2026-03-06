# Session 36 Recovery File
# Created: session 35 end (2026-03-05)
# ============================================================
# HOW TO USE THIS FILE:
# Start a new Claude Code session, then say:
#   "Read docs/SESSION-36-RECOVERY.md and brief me, then we'll begin."
# ============================================================

## Project Identity
- **Product name**: AlphaPi
- **What it is**: Commercial desktop app (Tauri v2 + React + TypeScript) for AI governance assessment + ROI measurement
- **Project directory**: `~/Projects/ai-governance-tool/`
- **GitHub**: `https://github.com/baltaguilar-tech/ai-governance-tool` (user: baltaguilar-tech)
- **gh CLI location**: `~/bin/gh`

## Model Usage Rule (PERMANENT)
Use **Haiku** for: file reads, grep/glob searches, exploration, memory reads, log appends.
Use **Sonnet** only for: code generation, multi-file edits, architectural decisions.

---

## Git State (as of session 35 end)

| Location | Commit | What |
|---|---|---|
| origin/main (GitHub) | `78f0a84` | Icon fix in FirstRunGate |
| Local main | `f3f2bbf` | Docs: session 35 log + session 36 agenda |
| Local (unpushed) | `68f97aa` | README rewrite (AlphaPi branding) |
| Local (unpushed) | `f3f2bbf` | Docs update |

**Local is 2 commits ahead of GitHub.** Both will push once SSH is set up in Item 1 below.

### Verify on session start:
```bash
cd ~/Projects/ai-governance-tool
git log --oneline -5
git status
```

---

## What Was Completed in Session 35

| Item | Status | Commits |
|---|---|---|
| GL-7: Privacy Policy + Terms of Service in-app modal | ✅ Done | c26dfb0 |
| GL-7: First-run acceptance gate (stores legalAccepted in tauri-plugin-store) | ✅ Done | c26dfb0 |
| Fix: FirstRunGate logo (was placeholder SVG → real AlphaPi icon) | ✅ Done | 78f0a84 |
| GL-6: Auto-updater restored (tauri-plugin-updater, ed25519 keypair, GitHub Releases endpoint) | ✅ Done | 8bc9d37 |
| GL-6: GitHub Actions CI/CD release workflow (.github/workflows/release.yml) | ✅ Done | 8bc9d37 |
| GL-6: Settings → Updates panel (full state machine UI) | ✅ Done | 8bc9d37 |
| README: Major rewrite with AlphaPi branding and accurate status | ✅ Done | 68f97aa |
| GitHub Secrets: TAURI_SIGNING_PRIVATE_KEY + TAURI_SIGNING_PRIVATE_KEY_PASSWORD | ✅ Done | (GitHub UI) |

---

## Updater Private Key Location
The ed25519 keypair for the auto-updater is saved locally at:
```
.claude/updater-private-key.txt
```
- **First line** = private key (already added to GitHub Secret `TAURI_SIGNING_PRIVATE_KEY`)
- **Second line** = public key (already in `src-tauri/tauri.conf.json`)
- **Password**: empty string (already in GitHub Secret `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`)
- This file is gitignored — stays local only.

---

## Session 36 — Priority Order

### Item 1 — SSH Key Setup (10 min) — DO THIS FIRST
Permanent fix for git push. No more PAT tokens that expire.

**Step 1 — In Terminal:**
```bash
ssh-keygen -t ed25519 -C "baltaguilar-tech" -f ~/.ssh/github_alphapi
# Press Enter twice when asked for passphrase (leave empty)
cat ~/.ssh/github_alphapi.pub
# Copy the entire output
```

**Step 2 — On GitHub:**
- Go to: github.com → click profile photo → Settings → SSH and GPG keys → New SSH key
- Title: `AlphaPi MacBook`
- Key type: Authentication Key
- Paste the public key → Add SSH key

**Step 3 — Back in Terminal:**
```bash
cd ~/Projects/ai-governance-tool
git remote set-url origin git@github.com:baltaguilar-tech/ai-governance-tool.git
git push
# This pushes both unpushed commits (README + docs)
git log --oneline -5  # confirm origin is now at f3f2bbf
```

---

### Item 2 — Reset All Data Button (30 min)
Add a "Reset All Data" button to Settings → My Data panel.

- **Why**: External tester (developer friend) needs to wipe data without using Terminal
- **Behavior**: Deletes all SQLite assessment data + clears legalAccepted flag in settings.json
- **UX**: Confirmation dialog required ("This will permanently delete all assessment data. This cannot be undone.")
- **After reset**: App should redirect to Welcome step or reload
- **Key files to read first**:
  - `src/components/settings/panels/MyDataPanel.tsx`
  - `src/services/db.ts`
  - `src/App.tsx`

---

### Item 3 — Unsigned .app Build for Tester (30 min)
Build a .dmg for the friend/developer tester. macOS only. Unsigned (they'll get a Gatekeeper warning).

**Build command:**
```bash
PATH="/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH" npm run tauri build
```

Output: `src-tauri/target/release/bundle/macos/AlphaPi_*.dmg`

**Tester context:**
- Friend is a Mac developer
- Scope: UX review + bug finding
- Does NOT need Terminal access — that's why Item 2 (Reset button) comes first
- Gatekeeper bypass: right-click the .app → Open → Open Anyway (first launch only)
  OR: System Settings → Privacy & Security → "Open Anyway" button appears after blocked launch

---

### Item 4 — Executive Summary Feature Design (45 min)
Design the AI-generated Executive Summary. **Do not build the generation code yet** — just the API key settings panel + consent flow.

**Architecture decided (session 35):**
- User provides their own Anthropic API key (BYOK — Bring Your Own Key)
- API key stored in `tauri-plugin-store` (settings.json)
- Direct call: device → Anthropic API (no intermediary server)
- Pro feature with 2–3 sentence free teaser as upgrade hook
- One-time internet connection (disclosed via consent before first generation)
- Privacy Policy needs update: adds exception to offline-first policy

**Where Executive Summary appears:**
1. Results Dashboard — below overall score section
2. Free PDF — teaser paragraph + "Upgrade for full narrative"
3. Pro PDF — full Executive Summary section (personalized narrative)

**Session 36 scope — design only:**
- Settings panel: API Key input field (masked), test connection button, clear button
- Consent flow: dialog on first use explaining internet requirement
- Do NOT build the Claude API call or generation logic yet

**Key consideration**: The summary must be personalized per user answers (not generic). The prompt will need to include dimension scores, blind spots, org profile, and jurisdiction.

---

## Remaining Go-Live Gates (for context)

| Gate | Status | Blocked on |
|---|---|---|
| GL-2: Keygen license validation | ⏳ Pending | Keygen.sh account setup |
| GL-3: macOS code signing | ⏳ Pending | Apple Developer account |
| GL-4: macOS notarization | ⏳ Pending | Apple Dev + D-U-N-S number |
| GL-5: Payment processor | ⏳ Pending | Company registration |
| GL-6: Auto-updater | ✅ Done | — |
| GL-7: Privacy Policy + ToS | ✅ Done | — |

---

## Key Technical Facts

- **Tailwind v4** — no tailwind.config.js; theme defined in `src/index.css`
- **TypeScript check command**: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit`
- **Build command**: `PATH="/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH" npm run tauri build`
- **lucide-react** is installed (v0.564.0) — do not reinstall
- **Anthropic SDK**: NOT yet installed — add in Item 4 if needed (`npm install @anthropic-ai/sdk`)
- **SQLite stale lock recovery**: kill all processes + delete `.db` + `.db-shm` + `.db-wal` from `~/Library/Application Support/com.baltaguilar-tech.ai-governance-tool/`

## Key File Locations
- Design system / colors: `src/index.css`
- Assessment store: `src/store/assessmentStore.ts`
- Scoring engine: `src/services/scoring.ts`
- PDF export: `src/services/pdfExport.ts`
- License service: `src/services/license.ts`
- Settings page: `src/components/settings/Settings.tsx`
- My Data panel: `src/components/settings/panels/MyDataPanel.tsx`
- Database service: `src/services/db.ts`
- Legal modal: `src/components/legal/LegalModal.tsx`
- First-run gate: `src/components/legal/FirstRunGate.tsx`
- Auto-updater service: `src/services/updater.ts`
- Updates panel: `src/components/settings/panels/UpdatesPanel.tsx`
- CI/CD workflow: `.github/workflows/release.yml`
- Session log: `docs/session-log.md`
- Decisions log: `docs/decisions.md`
- Remaining work: `docs/remaining-work-plan.md`

---

## After Each Item
1. Run TypeScript check (command above) — fix any errors before continuing
2. Commit with a clear message
3. Ask user before pushing
4. Append one line to `docs/session-log.md` (use Bash echo, not Edit/Read)

---

## Resume Phrase for Session 36
Paste this to start the session:

> "Session 36 — AlphaPi. Read docs/SESSION-36-RECOVERY.md first, brief me on current state, then we start with Item 1 (SSH keys). Model rule: Haiku for research/reads, Sonnet for code generation."
