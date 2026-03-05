# Session 32 Coding — Phase 5 Wizard UI (ProfileStep + DimensionStep)

We're continuing the AI Governance Tool project (Tauri v2 + React + TypeScript).
Project directory: ~/Projects/ai-governance-tool/

## Model usage rule (PERMANENT)
Use **Haiku** for ALL low-level work: file reads, exploration, grep/glob searches, memory reads, session-log appends.
Use **Sonnet** only for code generation and multi-file edits.

## Before doing anything else
1. `git status` — confirm no unexpected changes
2. Read last 10 lines of `docs/session-log.md`
3. Read `src/components/wizard/ProfileStep.tsx` (full)
4. Read `src/components/wizard/DimensionStep.tsx` (full)

## Git state at session start
- origin/main = d1fb45b (Tier 3)
- Local: 3 commits ahead (b3a1017 P4-3, 2d7b6a4 P4-2, 411f466 P4-1) — NOT pushed
- Do NOT push until user says so

## Session goal
Redesign ProfileStep.tsx and DimensionStep.tsx (visual/UX only — NO logic, scoring, or store changes).

---

## Change 1 — ProfileStep.tsx: Section Headers + Required Badges

### Two labeled sections (same scroll, no sub-steps)

**Section 1 header: "About Your Organization"**
Fields (in order): Org Name, Industry, Organization Size, Annual Revenue, Primary Location

**Section 2 header: "Your AI Program"**
Note directly under header: `"Optional — these fields improve your personalized recommendations."`
Fields (in order): Operating Regions, AI Maturity Level, AI Use Cases, Deployment Timeline, Expected Annual AI Spend

### Section header style
```
text-xs font-semibold uppercase tracking-widest text-light-muted
border-b border-navy-100 pb-2 mb-6 mt-10
```
First section (About Your Organization): mt-0, not mt-10.

### Required badge style
Small inline chip next to the field label text (not an asterisk):
```tsx
<span className="ml-2 text-xs font-medium text-accent-blue bg-blue-50 rounded px-1.5 py-0.5">Required</span>
```
Apply to: Org Name, Industry, Organization Size only.

### DO NOT change
- Field logic, validation, canProceed() — zero behavior changes
- Sticky nav buttons
- Any store or type references
- Field order within each section

---

## Change 2 — DimensionStep.tsx: Three visual upgrades

### 2a. Dimension header — Lucide icon per dimension

Add a Lucide icon left of the dimension label. Icon map (exact DimensionKey values):

```typescript
import { EyeOff, Link2, Database, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const DIMENSION_ICONS: Record<DimensionKey, React.ElementType> = {
  shadowAI:            EyeOff,
  vendorRisk:          Link2,
  dataGovernance:      Database,
  securityCompliance:  ShieldCheck,
  aiSpecificRisks:     Zap,
  roiTracking:         TrendingUp,
};
```

Icon display: w-7 h-7, color text-accent-blue, rendered left of the dimension label on one line (flex items-center gap-2).
Keep: weight % badge, description text — unchanged below.

### 2b. Progress track — 10 numbered dots (replaces text-only count)

Replace the text "X/Y questions answered..." with a dot row + secondary text below.

**Dot states:**
- **Answered**: bg-accent-green text-white — filled green circle, shows number
- **Current** (first unanswered question): bg-accent-blue text-white — filled blue circle, shows number
- **Unanswered**: bg-white border border-navy-200 text-light-muted — empty circle, shows number

Each dot: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer`

Clicking a dot scrolls to that question card:
- Add `id={"question-" + index}` to each question card div
- onClick: `document.getElementById("question-" + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' })`

Keep secondary text below the dot row (text-xs text-light-muted):
`"5 of 10 answered · answer at least 5 to continue"`

### 2c. Answer options — Full pill buttons (replaces radio dot)

Replace the radio-dot + text pattern with full-width pill rows.

**Default state:**
```
bg-white border border-navy-200 rounded-lg px-4 py-3 w-full text-left cursor-pointer
hover:border-accent-blue/50 transition-colors
```

**Selected state:**
```
bg-accent-blue/10 border-accent-blue text-accent-blue font-medium
```

Add indicator dot on the left inside each pill (flex items-start gap-3):
- Selected: `w-3 h-3 rounded-full bg-accent-blue flex-shrink-0 mt-0.5`
- Unselected: `w-3 h-3 rounded-full border-2 border-navy-300 flex-shrink-0 mt-0.5`

Preserve: same onClick handler, same option values, same vertical stacking. No changes to question card layout.

### DO NOT change
- canContinue threshold (Math.ceil(questions.length / 2)) — intentional
- Question text, IDs, dimensions, scoring values
- Sticky nav buttons
- Any store references or props

---

## After coding
1. Run tsc: `/Users/baltmac/.nvm/versions/node/v24.13.1/bin/node ./node_modules/.bin/tsc -b tsconfig.app.json --noEmit`
2. Fix any errors before proceeding
3. Report results — do NOT commit until user approves
4. Append to docs/session-log.md (Haiku subagent, single Bash echo, no Read/Edit)
5. Ask user before pushing

## Key env / design facts
- Tailwind v4 (no tailwind.config.js — theme defined in src/index.css)
- lucide-react already installed (v0.564.0) — do NOT install anything new
- Target window: 800px+
- WelcomeStep: off-limits this session
- Pre-wiring intentional (do not treat as bugs): LB-1 testing mode, LB-2 Keygen, LB-3 signing, LB-4 payment
