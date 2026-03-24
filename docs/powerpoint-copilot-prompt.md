# AlphaPi — PowerPoint Copilot Prompt Guide

*Saved 2026-03-24. Reusable prompt set for generating the AlphaPi 3-slide Beta presentation in MS PowerPoint using Copilot.*

Audience: Seasoned Program Manager
Purpose: Recognition of the AI governance gap and that AlphaPi fills it
Format: 3 slides, dark navy + gold brand style

---

## Step 1 — Generate the Presentation

Paste this into the Copilot prompt box in PowerPoint ("Create presentation from prompt"):

---

Create a 3-slide executive presentation for a seasoned Program Manager audience. Use a dark navy background with gold accent text and white body text. Keep each slide clean, minimal, and visually bold. No clip art. No stock photos. Use simple geometric shapes or icons only.

Slide 1 — Title: The Governance Gap
Subtitle: Most organizations are flying blind on AI.
Body bullets:
- 56% of CEOs report no measurable revenue gains from AI investments (PwC, 2026)
- 79% of companies lack a mature AI governance model (Deloitte, 2026)
- EU AI Act enforcement begins August 2026 — penalties up to 7% of global turnover
- No affordable, structured tool exists to assess AI governance for mid-market organizations

Slide 2 — Title: AlphaPi Fills the Gap
Subtitle: A guided assessment that scores governance and measures ROI in under 30 minutes.
Body bullets:
- 6-dimension assessment: Shadow AI, Vendor Risk, Data Governance, Security and Compliance, AI-Specific Risks, ROI Tracking
- Dimension-selective: complete one dimension in under 5 minutes or all six in under 30
- Built-in ROI framework that measures the financial return on AI investments, not just risk exposure
- Output: scored results, blind spots, prioritized recommendations, exportable PDF report

Slide 3 — Title: What Organizations Get
Subtitle: A clear picture of where they stand and what to do next.
Body bullets:
- Overall governance score with dimension-level breakdown
- Top blind spots ranked by risk exposure
- Customized action playbook with next steps
- ROI dashboard showing AI investment value vs. hidden costs
- Exportable PDF report for stakeholder communication
Footer text on slide 3: AlphaPi Beta. For evaluation purposes only. Confidential.

---

## Step 2 — Fix Brand Colors

After Copilot generates the deck, use this prompt to correct the colors:

---

Update the color scheme across all slides. Change the background color on every slide to dark navy (#02093A). Change all headline and accent text to gold (#FFCE20). Change all body text and bullet points to white (#FFFFFF). Remove any blue, teal, or gray color choices Copilot applied automatically. Keep the layout and content exactly as is.

---

## Step 3 — Fix Typography and Hierarchy

Use this prompt if the fonts feel inconsistent or the hierarchy is off:

---

Standardize the typography across all slides. Headlines should be bold and large (40pt or above). Subtitles should be medium weight, slightly smaller than headlines (24-28pt). Bullet points should be regular weight, easy to scan (18-20pt). Increase line spacing between bullets so the slide breathes. Do not change any text content.

---

## Step 4 — Tighten the Layout

Use this prompt if slides feel cluttered or unbalanced:

---

Tighten the layout on all three slides. Increase the top and left margin so content does not crowd the edges. Reduce the number of elements on each slide if needed by removing decorative shapes that Copilot added. The goal is one focal point per slide: the headline. Everything else supports it. Do not change any text content or colors.

---

## Step 5 — Add a Confidentiality Footer to All Slides

Use this prompt to add a consistent footer across all slides:

---

Add a small footer line to the bottom of every slide with this text: "AlphaPi Beta. For evaluation purposes only. Confidential." Use a small font size (10-12pt) in white or light gray. Align it to the bottom center of each slide. Do not change any other content.

---

## Step 6 — Final Polish Pass

Use this as a final check prompt before saving:

---

Review all three slides and make these final adjustments: Remove any auto-generated decorative elements that feel generic or clip-art-like. Ensure the gold headline color is consistent on every slide. Confirm bullet points are left-aligned and evenly spaced. Make sure no text is cut off or overlapping any other element. The deck should feel modern, bold, and minimal. Do not change any text content.

---

## Manual Adjustments Copilot Cannot Do (Do These by Hand)

These items require manual edits after Copilot finishes:

1. **Logo** — Insert the AlphaPi logo (`src/assets/alphapi-logo.png`) on slide 1 or as a watermark on all slides. Copilot cannot place a custom logo.
2. **Exact hex colors** — Copilot interprets color descriptions, not hex codes. After running Step 2, manually verify the background, headline, and body colors using Format > Theme Colors or the eyedropper tool.
3. **Slide transitions** — If you want a subtle fade between slides, set this manually under Transitions. Keep it simple: Fade or None only.
4. **Source citations** — The PwC and Deloitte stats on slide 1 should have a small superscript or footnote if you intend to share the deck externally. Add manually as a text box at the slide bottom.

---

## Notes

- This prompt set was written for MS Copilot inside PowerPoint (desktop or web version).
- Copilot generates a starting point. Expect 1-2 rounds of refinement using the prompts above.
- The one-pager PDF (`docs/alphapi-onepager.pdf`) uses the same stats and dimensions. Keep both documents consistent if either is updated.
- Do not share this prompt document externally. It reveals product positioning and brand strategy.
