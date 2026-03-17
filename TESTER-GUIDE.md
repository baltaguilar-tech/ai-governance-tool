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

### Step 1 — Download the right file for your Mac

Go to the [AlphaPi GitHub Releases page](https://github.com/baltaguilar-tech/ai-governance-tool/releases). Click **Assets** to expand the download list.

Pick the file that matches your Mac:

| Your Mac | File to download |
|----------|-----------------|
| M1, M2, M3, M4 (MacBook/iMac/Mac Mini from late 2020 onward) | `AlphaPi_0.9.1_aarch64.dmg` |
| Intel (older Mac, pre-2020) | `AlphaPi_0.9.1_x64.dmg` |

> **Not sure which you have?** Click **Apple menu → About This Mac**. If Chip says "Apple M..." you have an M-series Mac. If it says "Intel Core" you have an Intel Mac.

### Step 2 — Open the disk image

Double-click the downloaded `.dmg` file to mount it. A window opens showing `AlphaPi.app` and a shortcut to your Applications folder.

### Step 3 — Drag to Applications

Drag **`AlphaPi.app`** onto the **Applications** folder shortcut in the window. Then eject the disk image (drag it to Trash, or right-click the mounted volume on your Desktop and choose Eject).

### Step 4 — Remove the security restriction

Because this is an unsigned beta build, macOS will block the app from opening until you remove the quarantine flag. Open **Terminal** (search for it in Spotlight) and paste this command:

```
xattr -cr /Applications/AlphaPi.app && open /Applications/AlphaPi.app
```

Press Enter. The app will launch automatically.

> **If you see a security warning when opening the app directly (without the Terminal command):**
> - **macOS 12–13:** Right-click the app icon → **Open** → click **Open** in the dialog
> - **macOS 14+ (Sonoma/Sequoia):** Go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway**

### Step 5 — First launch

AlphaPi will open. You will be asked to accept the Terms of Service and Privacy Policy before starting.

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

### Test 3 — AI-generated Executive Summary (Pro + API key required)

1. Go to **Settings → Account**
2. Enter a valid Anthropic API key (starts with `sk-ant-api03-`) and click **Save**
3. Go to **Track Progress**
4. Scroll to the **Executive Summary** card and click **Generate AI Summary**
5. Accept the one-time consent notice
6. You should see a Claude-generated narrative appear within 10–20 seconds
7. Try switching the model (Haiku vs. Sonnet) and regenerating
8. After generating, export the **Full PDF Report** from the Results tab — the PDF should include an **Executive AI Narrative** page near the front with the opening and closing paragraphs you just generated

### Test 4 — ROI Model Builder (Pro)

The ROI Model Builder is a 6-step wizard that calculates the financial return on your AI investment.

1. Go to **Track Progress**, scroll to the **ROI Model Builder** section (near the bottom)
2. Click **Build ROI Model**
3. **Step 0 — Task Baseline:** Add 1–2 tasks (e.g., "Email drafting" — 30 min before, 8 min after, 60% of workforce). Click Next.
4. **Step 1 — Efficiency:** Review the pre-filled headcount from your org profile. Adjust adoption % and blended hourly rate if desired. Click Next.
5. **Step 2 — Revenue:** Enter your annual revenue and estimated AI uplift %. Click Next.
6. **Step 3 — Risk Mitigation:** Select 1–2 risk categories, enter an exposure amount and probability. Click Next.
7. **Step 4 — Hidden Costs:** Review the 5 TCO categories and adjust as needed. Click Next.
8. **Step 5 — Results:** You should see a benefit breakdown, total cost, 3-scenario cards (Conservative / Expected / Optimistic), and a qualitative summary. Click **Save Model**.
9. Close the wizard and verify the saved model appears when you reopen the ROI Model Builder.

### Test 5 — Data reset

1. Go to **Settings → My Data**
2. Click **Delete All Data**
3. Confirm — the app should return to the welcome screen with no saved assessment data

---

## Things That Are Intentionally Disabled

These are known limitations in the beta — not bugs:

| Feature | Status |
|---------|--------|
| Real license key purchase | Not available yet — use `BETA-TESTER-2026` |
| Auto-updater | Wired but no signed release yet |
| QR code license activation | UI present, coming in a future release |
| DOCX export | Planned for a future release |
| AI Executive Summary | Works — requires your own Anthropic API key (see Test 3) |
| Dev tier toggle in Settings → License | Intentional — allows switching Free/Pro during testing. Will be removed before public launch. |

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
