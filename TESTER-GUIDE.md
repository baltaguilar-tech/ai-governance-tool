# AlphaPi Beta — Tester Guide

Thank you for helping test AlphaPi before launch. This guide covers installation, what to test, and how to send feedback.

---

## Before You Start

**What you need:**
- A Mac running macOS 12 (Monterey) or later
- About 5 minutes to install and 20–30 minutes to run through the assessment

**What this is:**
AlphaPi is a desktop app that guides your organization through an AI governance and ROI assessment. It asks 63 questions across 6 risk areas, scores your maturity, and produces a personalized report with recommended actions.

---

## Installation

### Step 1 — Download and open the disk image

Download the `.dmg` from [GitHub Releases](https://github.com/baltaguilar-tech/ai-governance-tool/releases) (or use the file sent to you directly). Double-click the `.dmg` to mount it. A new window opens showing two items:
- `AlphaPi.app`
- `Install AlphaPi.command`

### Step 2 — Run the installer

Double-click **`Install AlphaPi.command`**.

A Terminal window will open and run for a few seconds. If macOS asks *"Are you sure you want to open this?"* — click **Open**.

The installer will:
- Remove the macOS security restriction from the app (required for unsigned beta builds)
- Copy AlphaPi to your Applications folder
- Launch the app automatically

### Step 3 — First launch

AlphaPi will open. You will be asked to accept the Terms of Service and Privacy Policy before starting.

> **Note:** Because this is an unsigned beta build, macOS may show a security warning. The installer handles this automatically via `xattr -cr`. If you ever launch the app directly from your Applications folder and see a warning:
> - **macOS 12–13:** Right-click the app icon → **Open** → click **Open** in the dialog
> - **macOS 14+ (Sonoma/Sequoia):** Go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway**

---

## What to Test

### Test 1 — Free tier (default)

Run through the full assessment as a Free user:

1. Accept the legal terms
2. Complete the **Org Profile** (fill in all fields, including Expected AI Spend)
3. Complete all **6 assessment dimensions** (10 questions each, except AI-Specific Risks which has 13) — you can answer quickly, accuracy isn't the goal here
4. Reach the **Results Dashboard**
5. Try to export a **PDF** — you should get a 1-page summary
6. Check the **Track Progress** tab
7. Open **Settings** and look at all the panels (License, Email, Notifications, Updates, My Data, About)

### Test 2 — Pro tier (beta access)

To unlock the full Pro experience:

1. Go to **Settings → License Key**
2. In the key field, enter exactly: `BETA-TESTER-2026`
3. Click **Activate Key**
4. You should see *"Beta tester access — Professional tier active"* and the badge should change to **Professional**

Now re-run the assessment (or use your existing results) and check:

- Full dimension breakdown in the Results Dashboard
- All blind spots visible (not just top 3)
- Full recommendations with implementation roadmap
- Full PDF export (multi-page, with all dimensions and action plan)
- Assessment history in Track Progress

---

## Things That Are Intentionally Disabled

These are known limitations in the beta — not bugs:

| Feature | Status |
|---------|--------|
| Real license key purchase | Not available yet — use `BETA-TESTER-2026` |
| Auto-updater | Wired but no signed release yet |
| QR code license activation | UI present, coming in a future release |
| DOCX export | Planned for launch |

---

## How to Send Feedback

Email your findings to **balt.aguilar@outlook.com** with the subject line: **AlphaPi Beta Feedback**

To help make the feedback useful, please include:

- **Your Mac model** (e.g. MacBook Pro M2, iMac Intel)
- **macOS version** (Apple menu → About This Mac)
- **What you were doing** when the issue occurred
- **What happened** vs. what you expected
- **Screenshot** if possible (Shift+Command+4 to capture a selection)

If something worked well or felt confusing, that's equally useful to hear.

---

## Uninstalling

To remove AlphaPi from your Mac:

1. Drag `AlphaPi.app` from your Applications folder to the Trash
2. To also remove saved assessment data: open **Settings → My Data → Delete All Data** before uninstalling

---

*AlphaPi Beta — confidential. Please do not share this build or this guide.*
