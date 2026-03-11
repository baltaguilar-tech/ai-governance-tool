# Session 42 Recovery Doc

## Git State
- Branch: main
- Last commit: 2e50483 (session 40 PDF fixes)
- **UNCOMMITTED changes (4 files)**:
  - `README.md` — question counts (252), Phase 4 block, Beta Testers section (session 41)
  - `TESTER-GUIDE.md` — question counts, GitHub Releases link, Gatekeeper split macOS 12–13 vs 14+ (session 41)
  - `src/utils/pdfExport.ts` — PDF-1/2/3 bugs fixed (session 41)
  - `src/components/settings/panels/LicensePanel.tsx` — Dev Testing Mode toggle added (session 42)

## Session 41 Summary (all done)
- BT-7: Unsigned `.app` + `.dmg` built (`AlphaPi_0.1.0_aarch64.dmg` — arm64)
- README.md: 240→252 question counts, Phase 4 block added, Beta Testers section points to GitHub Releases
- TESTER-GUIDE.md: 60→63 questions, GitHub Releases download link, macOS 12–13 vs 14+ Gatekeeper split, AI-Specific Risks = 13 note
- pdfExport.ts PDF-1: Null guard on section2Gaps loop
- pdfExport.ts PDF-2: parseBoldSegments handles unbalanced `**` markers
- pdfExport.ts PDF-3: Score clamped to 0–100 at bar render

## Session 42 Summary (done so far)
- All .md files written/updated (CURRENT-SESSION.md, SESSION-42-RECOVERY.md, MEMORY.md)
- LicensePanel.tsx: Dev Testing Mode toggle at bottom of Settings → License Key
  - Two buttons: Free / Professional — call `setLicenseTier()` directly, no key needed
  - Session-only (resets on restart) — intentional for testing
  - Labeled ⚠️ DEV ONLY — MUST REMOVE before launch (lines ~154–187)
- TypeScript check: clean
- Production build: exit 0, new `AlphaPi_0.1.0_aarch64.dmg` produced

## Still Pending (session 43 first steps)
1. **Commit + push** all 4 uncommitted files
   - Suggested message: "Add dev tier toggle; fix PDF bugs; update README and tester guide"
2. **Verify app launch** — user installed by manual drag last session; fix: `xattr -cr /Applications/AlphaPi.app && open /Applications/AlphaPi.app`
3. **Test the toggle end-to-end**: Settings → License Key → click Professional → go to Results → confirm Pro PDF button is enabled

## Architecture Notes
- `licenseTier` lives in `src/store/assessmentStore.ts` — starts as `'free'`
- `setLicenseTier(tier)` is a direct Zustand setter — no side effects, no persistence
- Pro PDF gated at `ResultsDashboard.tsx` line ~336: `licenseTier === 'professional'`
- GL-2 (Keygen) wiring is NOT done — commented TODO in assessmentStore.ts
- `BETA-TESTER-2026` key still works via `activateLicense()` in `src/services/license.ts` (persists to tauri-plugin-store)

## Key File Paths
- Dev toggle: `src/components/settings/panels/LicensePanel.tsx` (lines ~154–187)
- License service: `src/services/license.ts`
- Store: `src/store/assessmentStore.ts`
- Results + PDF gate: `src/components/dashboard/ResultsDashboard.tsx` (~line 336)
- PDF export: `src/utils/pdfExport.ts`

## Environment
- Node: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node`
- tsc: `node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit`
- Build: `cd ~/Projects/ai-governance-tool && PATH=/Users/baltmac/.nvm/versions/node/v24.13.1/bin:$PATH npm run tauri build`
- gh CLI: `~/bin/gh`
- Git remote: `git@github.com:baltaguilar-tech/ai-governance-tool.git` (SSH — github_alphapi key)
