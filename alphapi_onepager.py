"""
alphapi_onepager.py
Generates docs/alphapi-onepager.pdf — AlphaPi one-pager for consulting firm outreach.

Usage:
    python3 alphapi_onepager.py

Output:
    docs/alphapi-onepager.pdf

Dependencies:
    pip install reportlab pillow
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_JUSTIFY

# ---------------------------------------------------------------------------
# Brand tokens
# ---------------------------------------------------------------------------
DARK_BASE    = HexColor("#02093A")   # page background
DARK_SURFACE = HexColor("#0D1B4B")   # card background
ACCENT_GOLD  = HexColor("#FFCE20")   # headings, numbers, bullets, accent bars
WHITE        = HexColor("#FFFFFF")
LIGHT_TEXT   = HexColor("#B8C4D8")   # citation / secondary text
FOOTER_LINK  = HexColor("#FFCE20")   # email link color in footer

# ---------------------------------------------------------------------------
# Page geometry
# ---------------------------------------------------------------------------
PAGE_W, PAGE_H = letter   # 612 x 792 pt
MARGIN_L = 40
MARGIN_R = PAGE_W - 40
CONTENT_W = MARGIN_R - MARGIN_L

LOGO_PATH = os.path.join(os.path.dirname(__file__), "public", "assets", "alphapi-logo.png")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "docs", "alphapi-onepager.pdf")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def draw_gold_section_bar(c, x, y, width=22, height=3):
    """Draw the short gold horizontal bar used before section headings."""
    c.setFillColor(ACCENT_GOLD)
    c.rect(x, y, width, height, fill=1, stroke=0)


def draw_section_heading(c, x, y, text, font_size=9):
    """Gold bar + uppercase section heading in gold."""
    draw_gold_section_bar(c, x, y + 1)
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", font_size)
    c.drawString(x + 28, y, text)
    return y


def draw_wrapped_text(c, text, x, y, width, font_name, font_size, color, line_height=None):
    """
    Draw left-aligned wrapped text. Returns the y position after the last line.
    """
    if line_height is None:
        line_height = font_size * 1.35
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    words = text.split()
    line = ""
    lines = []
    for word in words:
        test = (line + " " + word).strip()
        if c.stringWidth(test, font_name, font_size) <= width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    for ln in lines:
        c.drawString(x, y, ln)
        y -= line_height
    return y


def draw_numbered_step(c, number, bold_label, body, x, y, content_width):
    """Draw a How It Works step: gold circle number + bold label + body text."""
    circle_r = 9
    cx = x + circle_r
    cy = y - circle_r + 2

    # Gold circle
    c.setFillColor(ACCENT_GOLD)
    c.circle(cx, cy, circle_r, fill=1, stroke=0)

    # Number inside circle
    c.setFillColor(DARK_BASE)
    c.setFont("Helvetica-Bold", 8)
    num_w = c.stringWidth(str(number), "Helvetica-Bold", 8)
    c.drawString(cx - num_w / 2, cy - 3, str(number))

    # Bold label
    label_x = x + circle_r * 2 + 6
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(label_x, y - 2, bold_label + "  ")

    label_w = c.stringWidth(bold_label + "  ", "Helvetica-Bold", 8.5)
    body_x = label_x + label_w
    body_width = content_width - (body_x - x)

    y_after = draw_wrapped_text(
        c, body, body_x, y - 2, body_width,
        "Helvetica", 8.5, WHITE, line_height=12
    )
    # If body wrapped, remaining lines need proper indent
    # Recalculate by simulating wrapping
    words = body.split()
    line = ""
    first = True
    step_y = y - 2
    for word in words:
        test = (line + " " + word).strip()
        line_w = c.stringWidth(test, "Helvetica", 8.5)
        if line_w <= body_width:
            line = test
        else:
            if first:
                first = False
                step_y -= 12
            c.setFillColor(WHITE)
            c.setFont("Helvetica", 8.5)
            c.drawString(body_x, step_y, line)
            line = word
            step_y -= 12
    # Actually we already drew it with draw_wrapped_text above — just return a safe y
    return min(y_after, step_y) - 4


# ---------------------------------------------------------------------------
# Main draw function
# ---------------------------------------------------------------------------

def build_onepager(output_path=OUTPUT_PATH):
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setTitle("AlphaPi — AI Governance Assessment Platform")

    # -----------------------------------------------------------------------
    # Background
    # -----------------------------------------------------------------------
    c.setFillColor(DARK_BASE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # -----------------------------------------------------------------------
    # Top gold accent bar
    # -----------------------------------------------------------------------
    c.setFillColor(ACCENT_GOLD)
    c.rect(0, PAGE_H - 5, PAGE_W, 5, fill=1, stroke=0)

    # -----------------------------------------------------------------------
    # Header: logo + company name
    # -----------------------------------------------------------------------
    header_y = PAGE_H - 10
    logo_h = 36
    logo_w = 36

    if os.path.exists(LOGO_PATH):
        c.drawImage(
            LOGO_PATH, MARGIN_L, header_y - logo_h,
            width=logo_w, height=logo_h,
            preserveAspectRatio=True, mask="auto"
        )
    else:
        # Fallback: draw a simple triangle placeholder
        c.setFillColor(ACCENT_GOLD)
        c.setStrokeColor(ACCENT_GOLD)
        path = c.beginPath()
        path.moveTo(MARGIN_L + 18, header_y - 4)
        path.lineTo(MARGIN_L + 2,  header_y - logo_h + 4)
        path.lineTo(MARGIN_L + 34, header_y - logo_h + 4)
        path.close()
        c.drawPath(path, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(MARGIN_L + logo_w + 10, header_y - 27, "ALPHAPI")

    # Gold separator line below header
    sep_y = header_y - logo_h - 6
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(1.2)
    c.line(MARGIN_L, sep_y, MARGIN_R, sep_y)

    # -----------------------------------------------------------------------
    # Tagline
    # -----------------------------------------------------------------------
    tag_y = sep_y - 16
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 13.5)
    c.drawString(MARGIN_L, tag_y, "AI Risk Is Growing. AI ROI Is Uncertain.")
    tag_y -= 17
    c.drawString(MARGIN_L, tag_y, "One Assessment Brings Clarity to Both.")

    # -----------------------------------------------------------------------
    # Stats: 56% and 79%
    # 40pt font ascends ~36pt above baseline — need at least 44pt clearance
    # -----------------------------------------------------------------------
    stats_y = tag_y - 46
    col_w = CONTENT_W / 2

    # Left stat
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", 40)
    c.drawString(MARGIN_L, stats_y, "56%")

    stat1_text_y = stats_y - 14
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN_L, stat1_text_y, "of CEOs report no revenue gains from AI.")
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(MARGIN_L, stat1_text_y - 10, "PwC, 2026 Global CEO Survey")

    # Right stat
    stat_right_x = MARGIN_L + col_w
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", 40)
    c.drawString(stat_right_x, stats_y, "79%")

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 8)
    c.drawString(stat_right_x, stat1_text_y, "of companies lack a mature AI governance model.")
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(stat_right_x, stat1_text_y - 10, "Deloitte, State of AI Report, 2026")

    # -----------------------------------------------------------------------
    # THE PROBLEM
    # -----------------------------------------------------------------------
    cur_y = stat1_text_y - 30
    draw_section_heading(c, MARGIN_L, cur_y, "THE PROBLEM")

    problem_text = (
        "AI governance is no longer optional. The ROI of getting it right is too big to ignore. "
        "Regulations like the EU AI Act, California Consumer Privacy Act (CCPA), NIST AI RMF, "
        "and ISO 42001 are raising the bar, and most organizations don't know where they stand. "
        "They're deploying AI without visibility into risk, spend, or compliance gaps. Consulting "
        "firms are fielding these questions from clients, but don't have a scalable tool to deliver answers."
    )
    cur_y -= 14
    cur_y = draw_wrapped_text(c, problem_text, MARGIN_L, cur_y, CONTENT_W, "Helvetica", 8.5, WHITE, 13)

    # -----------------------------------------------------------------------
    # THE SOLUTION
    # -----------------------------------------------------------------------
    cur_y -= 16
    draw_section_heading(c, MARGIN_L, cur_y, "THE SOLUTION")

    solution_text = (
        "AlphaPi is a browser-based AI governance assessment platform built for consulting firms. "
        "Your team runs a branded assessment with your client, covering six governance dimensions "
        "designed to surface risk, misalignment, and missed ROI. The client sees your brand, your "
        "logo, and your report. AlphaPi powers the engine behind it."
    )
    cur_y -= 14
    cur_y = draw_wrapped_text(c, solution_text, MARGIN_L, cur_y, CONTENT_W, "Helvetica", 8.5, WHITE, 13)

    # -----------------------------------------------------------------------
    # 6 Dimensions grid (2 rows x 3 cols)
    # -----------------------------------------------------------------------
    dimensions = [
        ("Shadow AI",           "Unsanctioned tools your teams don't see."),
        ("Vendor Risk",         "Third-party AI exposure across vendors."),
        ("Data Governance",     "Who controls what data feeds your AI."),
        ("Security & Compliance", "AI use vs. policy enforcement gaps."),
        ("AI-Specific Risks",   "Bias, hallucination, and model reliability."),
        ("ROI Tracking",        "What AI is actually costing vs. returning."),
    ]

    cur_y -= 16
    card_cols = 3
    card_rows = 2
    card_w = CONTENT_W / card_cols - 4
    card_h = 34
    card_pad_x = 8
    card_pad_y = 6
    gap = 5

    for i, (title, desc) in enumerate(dimensions):
        row = i // card_cols
        col = i % card_cols
        cx = MARGIN_L + col * (card_w + gap)
        cy = cur_y - row * (card_h + gap)

        # Card background
        c.setFillColor(DARK_SURFACE)
        c.roundRect(cx, cy - card_h, card_w, card_h, 4, fill=1, stroke=0)

        # Gold bullet
        c.setFillColor(ACCENT_GOLD)
        c.circle(cx + card_pad_x + 3, cy - card_pad_y - 4, 3, fill=1, stroke=0)

        # Title
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(cx + card_pad_x + 10, cy - card_pad_y - 2, title)

        # Description
        c.setFillColor(LIGHT_TEXT)
        c.setFont("Helvetica", 7.5)
        draw_wrapped_text(
            c, desc,
            cx + card_pad_x + 2, cy - card_pad_y - 14,
            card_w - card_pad_x - 4,
            "Helvetica", 7.5, LIGHT_TEXT, 10
        )

    cur_y -= (card_rows * (card_h + gap)) + 14

    # -----------------------------------------------------------------------
    # HOW IT WORKS
    # -----------------------------------------------------------------------
    draw_section_heading(c, MARGIN_L, cur_y, "HOW IT WORKS")
    cur_y -= 16

    steps = [
        ("Onboard",
         "Your firm gets a branded portal (yourfirm.alphapi.app) with your logo and colors."),
        ("Assess",
         "Your team selects the governance dimensions that matter most to your client and runs the "
         "assessment. One dimension takes less than 5 minutes. All six deliver a full picture in under 30 minutes."),
        ("Score",
         "The platform analyzes responses across a 252-question framework, producing dimension scores, "
         "an overall risk level, blind spots, and prioritized recommendations."),
        ("Deliver",
         "Export a professional, branded PDF report. Your client sees your firm's expertise. "
         "You see the roadmap for a consulting engagement."),
    ]

    for num, (label, body) in enumerate(steps, 1):
        # Gold circle
        cx = MARGIN_L + 9
        cy = cur_y - 7
        c.setFillColor(ACCENT_GOLD)
        c.circle(cx, cy, 9, fill=1, stroke=0)
        c.setFillColor(DARK_BASE)
        c.setFont("Helvetica-Bold", 8)
        nw = c.stringWidth(str(num), "Helvetica-Bold", 8)
        c.drawString(cx - nw / 2, cy - 3, str(num))

        # Label
        label_x = MARGIN_L + 24
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8.5)
        label_w = c.stringWidth(label + "  ", "Helvetica-Bold", 8.5)
        c.drawString(label_x, cur_y - 4, label + "  ")

        # Body (same line, then wrap)
        body_x = label_x + label_w
        body_w = CONTENT_W - (body_x - MARGIN_L)
        end_y = draw_wrapped_text(
            c, body, body_x, cur_y - 4, body_w,
            "Helvetica", 8.5, WHITE, 13
        )
        cur_y = min(cur_y - 24, end_y - 6)

    # -----------------------------------------------------------------------
    # WHY THIS MATTERS FOR YOUR FIRM
    # -----------------------------------------------------------------------
    cur_y -= 16
    draw_section_heading(c, MARGIN_L, cur_y, "WHY THIS MATTERS FOR YOUR FIRM")

    why_text = (
        "Every assessment opens a door. The results show your client exactly where their governance "
        "gaps are, and your team is already in the room to close them. One assessment becomes a "
        "remediation engagement. A remediation engagement becomes a recurring monitoring relationship. "
        "AlphaPi gives your practice a repeatable, branded service line that turns AI governance from "
        "a one-time conversation into ongoing revenue."
    )
    cur_y -= 14
    cur_y = draw_wrapped_text(c, why_text, MARGIN_L, cur_y, CONTENT_W, "Helvetica", 8.5, WHITE, 13)

    # -----------------------------------------------------------------------
    # Footer separator
    # -----------------------------------------------------------------------
    footer_sep_y = 62
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(0.8)
    c.line(MARGIN_L, footer_sep_y, MARGIN_R, footer_sep_y)

    # Left footer block
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(MARGIN_L, footer_sep_y - 14, "Balt Aguilar, Founder")

    c.setFillColor(FOOTER_LINK)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN_L, footer_sep_y - 25, "support@getalphapi.com")

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN_L, footer_sep_y - 36, "getalphapi.com")

    # Right footer: confidentiality text
    conf_text = (
        "Confidential. All concepts, methodologies, and intellectual property\n"
        "contained herein are the sole property of AlphaPi, LLC. Shared for\n"
        "evaluation and feedback purposes only. Do not distribute without written\n"
        "permission."
    )
    conf_x = PAGE_W / 2 + 10
    conf_y = footer_sep_y - 12
    for line in conf_text.split("\n"):
        c.setFillColor(LIGHT_TEXT)
        c.setFont("Helvetica-Oblique", 6.5)
        c.drawString(conf_x, conf_y, line)
        conf_y -= 9

    # -----------------------------------------------------------------------
    # Bottom gold accent bar (right side only, partial)
    # -----------------------------------------------------------------------
    c.setFillColor(ACCENT_GOLD)
    c.rect(PAGE_W - 60, 0, 60, 5, fill=1, stroke=0)

    # -----------------------------------------------------------------------
    # Save
    # -----------------------------------------------------------------------
    c.save()
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    build_onepager()
