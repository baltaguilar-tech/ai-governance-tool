"""
alphapi_sample_assessment.py
Generates docs/sample-assessment-report.pdf — AlphaPi sample assessment report.
Advisory Inc (fictional, financial services, Builder profile).

Usage:
    python3 alphapi_sample_assessment.py

Output:
    docs/sample-assessment-report.pdf

Dependencies:
    pip install reportlab pillow
"""

import os
import io
import math
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# ---------------------------------------------------------------------------
# Brand tokens
# ---------------------------------------------------------------------------
DARK_BASE    = HexColor("#02093A")
DARK_SURFACE = HexColor("#0D1B4B")
ACCENT_GOLD  = HexColor("#FFCE20")
ACCENT_BLUE  = HexColor("#2B5CFF")
RISK_HIGH    = HexColor("#D94F4F")
WHITE        = HexColor("#FFFFFF")
LIGHT_TEXT   = HexColor("#B8C4D8")

RISK_COLORS = {
    "High":   RISK_HIGH,
    "Medium": ACCENT_BLUE,
    "Low":    ACCENT_GOLD,
}

# ---------------------------------------------------------------------------
# Page geometry
# ---------------------------------------------------------------------------
PAGE_W, PAGE_H = letter   # 612 x 792 pt
MARGIN_L  = 40
MARGIN_R  = PAGE_W - 40
CONTENT_W = MARGIN_R - MARGIN_L

LOGO_PATH   = os.path.join(os.path.dirname(__file__), "public", "assets", "alphapi-logo.png")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "docs", "sample-assessment-report.pdf")

# ---------------------------------------------------------------------------
# Report data
# ---------------------------------------------------------------------------
ORG_NAME     = "Advisory Inc"
ORG_INDUSTRY = "Financial Services"
ORG_PROFILE  = "Builder"
REPORT_DATE  = "March 24, 2026"
REPORT_TITLE = "AI Governance Assessment Report"

COMPOSITE_SCORE = 53
COMPOSITE_LABEL = "Elevated Risk"

DIMENSIONS = [
    ("Shadow AI",             41, "High",   0.25),
    ("Vendor Risk",           55, "Medium", 0.25),
    ("Data Governance",       48, "High",   0.20),
    ("Security & Compliance", 67, "Medium", 0.15),
    ("AI-Specific Risks",     59, "Medium", 0.10),
    ("ROI Tracking",          74, "Low",    0.05),
]

BLIND_SPOTS = [
    "Untracked employee use of ChatGPT and other consumer AI tools (Shadow AI)",
    "No AI disclosure requirements in vendor contracts (Vendor Risk)",
    "Sensitive financial data feeding AI tools without data handling agreements (Data Governance)",
]

HOOK_STAT = {
    "stat1": "75%",
    "desc1": "of financial services firms are actively using or exploring AI.",
    "stat2": "12%",
    "desc2": "have adopted an AI risk management framework.",
    "source": "ACA Global, 2024 AI Benchmarking Survey",
}

ROI_DATA = {
    "gross_benefits": [
        ("Efficiency (curve-adjusted)",        94500),
        ("Revenue uplift (curve-adjusted)",    32000),
        ("Risk mitigation value",              58000),
    ],
    "gross_total": 184500,
    "tco": [
        ("Annual visible AI spend", 420000),
        ("Hidden costs",             87000),
    ],
    "tco_total": 507000,
    "scenarios": [
        ("Conservative (0.6x)", -395300, -78),
        ("Realistic (1.0x)",    -322500, -64),
        ("Optimistic (1.4x)",   -249700, -49),
    ],
    "verdict": "Investment needs review",
    "bridge": (
        "Improving governance maturity is consistently linked to stronger, sustained AI returns. "
        "The gaps identified in this assessment are the most direct path to protecting this investment."
    ),
}

RECOMMENDATIONS = [
    {
        "dimension": "Shadow AI",
        "score": 41,
        "risk": "High",
        "actions": [
            "Build an AI tool inventory across all departments.",
            "Establish a quarterly audit process to identify new unsanctioned tools.",
        ],
    },
    {
        "dimension": "Data Governance",
        "score": 48,
        "risk": "High",
        "actions": [
            "Define a data handling policy covering all AI inputs.",
            "Require vendor data agreements for any tool processing client or internal data.",
        ],
    },
    {
        "dimension": "Vendor Risk",
        "score": 55,
        "risk": "Medium",
        "actions": [
            "Add an AI disclosure clause to all vendor contracts.",
            "Build a third-party AI risk register.",
        ],
    },
]

CONFIDENTIALITY_FOOTER = "Confidential. Prepared by AlphaPi. Not for distribution."

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def draw_page_background(c):
    """Full-page dark navy background + top gold accent bar."""
    c.setFillColor(DARK_BASE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(ACCENT_GOLD)
    c.rect(0, PAGE_H - 5, PAGE_W, 5, fill=1, stroke=0)


def draw_watermark(c):
    """AlphaPi logo at bottom center, ~15% opacity."""
    if not os.path.exists(LOGO_PATH):
        return
    img = Image.open(LOGO_PATH).convert("RGBA")
    r, g, b, a = img.split()
    a = a.point(lambda x: int(x * 0.15))
    img = Image.merge("RGBA", (r, g, b, a))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    wm_w, wm_h = 32, 32
    x = (PAGE_W - wm_w) / 2
    c.drawImage(ImageReader(buf), x, 14, width=wm_w, height=wm_h,
                preserveAspectRatio=True, mask="auto")


def draw_wrapped_text(c, text, x, y, width, font_name, font_size, color, line_height=None):
    """Left-aligned wrapped text. Returns y after last line."""
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


def draw_section_heading(c, x, y, text, font_size=9):
    """Short gold bar + uppercase section label."""
    c.setFillColor(ACCENT_GOLD)
    c.rect(x, y + 1, 22, 3, fill=1, stroke=0)
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", font_size)
    c.drawString(x + 28, y, text)
    return y


DONUT_TRACK = HexColor("#1A2F6B")   # visible ring track against dark navy


def draw_org_metadata(c, start_y):
    """
    Section 2: Horizontal metadata row + composite score donut.
    Returns y below this section.
    """
    y = start_y - 16

    # 4 metadata columns
    col_w = CONTENT_W / 4
    fields = [
        ("ORGANIZATION", ORG_NAME),
        ("INDUSTRY",     ORG_INDUSTRY),
        ("PROFILE",      ORG_PROFILE),
        ("DATE",         REPORT_DATE),
    ]
    for i, (label, value) in enumerate(fields):
        x = MARGIN_L + i * col_w
        c.setFillColor(LIGHT_TEXT)
        c.setFont("Helvetica-Oblique", 7)
        c.drawString(x, y, label)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(x, y - 13, value)

    y -= 34

    # Thin divider
    c.setStrokeColor(DONUT_TRACK)
    c.setLineWidth(0.5)
    c.line(MARGIN_L, y, MARGIN_R, y)

    y -= 10

    # Donut (composite score), centered
    r  = 36
    cx = PAGE_W / 2
    cy = y - r - 6

    # Track ring
    c.setStrokeColor(DONUT_TRACK)
    c.setLineWidth(13)
    c.circle(cx, cy, r, fill=0, stroke=1)

    # Progress arc (ACCENT_BLUE, clockwise from 12 o'clock)
    extent = -(COMPOSITE_SCORE / 100) * 360
    c.setLineCap(1)          # round caps
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(13)
    c.arc(cx - r, cy - r, cx + r, cy + r, startAng=90, extent=extent)
    c.setLineCap(0)          # reset to butt

    # Score number
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    score_str = str(COMPOSITE_SCORE)
    c.drawString(cx - c.stringWidth(score_str, "Helvetica-Bold", 22) / 2, cy + 5, score_str)

    # "/100"
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 8)
    sub = "/100"
    c.drawString(cx - c.stringWidth(sub, "Helvetica", 8) / 2, cy - 10, sub)

    # "Elevated Risk" label below donut
    c.setFillColor(RISK_HIGH)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(cx - c.stringWidth(COMPOSITE_LABEL, "Helvetica-Bold", 8.5) / 2,
                 cy - r - 15, COMPOSITE_LABEL)

    return cy - r - 30


def draw_hook_stat_box(c, start_y):
    """
    Section 3: Hook stat callout box.
    Dark surface background, gold left border, two-column stats.
    Returns y below the box.
    """
    y = start_y - 18

    box_pad_x = 16
    box_pad_y = 14
    box_h     = 104
    box_x     = MARGIN_L
    box_y     = y - box_h

    # Background
    c.setFillColor(DARK_SURFACE)
    c.rect(box_x, box_y, CONTENT_W, box_h, fill=1, stroke=0)

    # Gold left border
    c.setFillColor(ACCENT_GOLD)
    c.rect(box_x, box_y, 4, box_h, fill=1, stroke=0)

    content_x = box_x + 4 + box_pad_x
    col_w     = (CONTENT_W - 4 - box_pad_x * 2) / 2
    text_y    = y - box_pad_y

    # Stat 1
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(content_x, text_y - 26, HOOK_STAT["stat1"])

    draw_wrapped_text(c, HOOK_STAT["desc1"], content_x, text_y - 46,
                      col_w - 8, "Helvetica", 8.5, WHITE, line_height=12)

    # Stat 2
    col2_x = content_x + col_w
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(col2_x, text_y - 26, HOOK_STAT["stat2"])

    draw_wrapped_text(c, HOOK_STAT["desc2"], col2_x, text_y - 46,
                      col_w - 8, "Helvetica", 8.5, WHITE, line_height=12)

    # Source
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(content_x, box_y + box_pad_y - 2,
                 f"Source: {HOOK_STAT['source']}")

    return box_y - 10


def draw_header(c):
    """
    Page header: AlphaPi logo + ALPHAPI brand + report title + gold separator.
    Returns y position just below the separator line.
    """
    header_y = PAGE_H - 10
    logo_h = 36
    logo_w = 36

    if os.path.exists(LOGO_PATH):
        c.drawImage(
            LOGO_PATH, MARGIN_L, header_y - logo_h,
            width=logo_w, height=logo_h,
            preserveAspectRatio=True, mask="auto"
        )

    # Brand name
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(MARGIN_L + logo_w + 10, header_y - 22, "ALPHAPI")

    # Report title (subtitle)
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN_L + logo_w + 10, header_y - 36, REPORT_TITLE)

    # Gold separator
    sep_y = header_y - logo_h - 8
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(1.0)
    c.line(MARGIN_L, sep_y, MARGIN_R, sep_y)

    return sep_y


# ---------------------------------------------------------------------------
# Page 2
# ---------------------------------------------------------------------------

def draw_dimension_scores(c, start_y):
    """
    Page 2, Section 1: Six dimension scores with progress bars + risk badges.
    Returns y below this section.
    """
    y = start_y - 14
    draw_section_heading(c, MARGIN_L, y, "GOVERNANCE DIMENSION SCORES")
    y -= 18

    bar_h      = 8
    bar_track_w = 200
    row_h      = 32
    badge_w    = 52
    badge_h    = 13

    for name, score, risk, weight in DIMENSIONS:
        risk_color = RISK_COLORS[risk]

        # Dimension name
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(MARGIN_L, y, name)

        # Weight label
        c.setFillColor(LIGHT_TEXT)
        c.setFont("Helvetica", 7)
        c.drawString(MARGIN_L, y - 11, f"Weight: {int(weight * 100)}%")

        # Progress bar track
        bar_x = MARGIN_L + 140
        bar_y = y - 5
        c.setFillColor(DARK_SURFACE)
        c.roundRect(bar_x, bar_y, bar_track_w, bar_h, 3, fill=1, stroke=0)

        # Progress bar fill
        fill_w = (score / 100) * bar_track_w
        c.setFillColor(risk_color)
        c.roundRect(bar_x, bar_y, fill_w, bar_h, 3, fill=1, stroke=0)

        # Score number
        score_x = bar_x + bar_track_w + 10
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(score_x, y - 4, f"{score}/100")

        # Risk badge
        badge_x = score_x + 40
        c.setFillColor(risk_color)
        c.roundRect(badge_x, bar_y - 1, badge_w, badge_h, 3, fill=1, stroke=0)
        c.setFillColor(DARK_BASE)
        c.setFont("Helvetica-Bold", 7)
        label_w = c.stringWidth(risk, "Helvetica-Bold", 7)
        c.drawString(badge_x + (badge_w - label_w) / 2, bar_y + 3, risk)

        # Thin row separator
        sep_y = y - row_h + 4
        c.setStrokeColor(DONUT_TRACK)
        c.setLineWidth(0.4)
        c.line(MARGIN_L, sep_y, MARGIN_R, sep_y)

        y -= row_h

    return y - 6


def draw_blind_spots(c, start_y):
    """
    Page 2, Section 2: Blind spots summary.
    Returns y below this section.
    """
    y = start_y - 16
    draw_section_heading(c, MARGIN_L, y, "KEY BLIND SPOTS")
    y -= 16

    for spot in BLIND_SPOTS:
        # Gold bullet
        c.setFillColor(ACCENT_GOLD)
        c.circle(MARGIN_L + 4, y - 3, 3, fill=1, stroke=0)

        y = draw_wrapped_text(
            c, spot, MARGIN_L + 14, y,
            CONTENT_W - 14, "Helvetica", 8.5, WHITE, line_height=12
        )
        y -= 6

    return y


def draw_page2(c):
    draw_page_background(c)
    draw_watermark(c)

    sep_y = draw_header(c)
    cur_y = draw_dimension_scores(c, sep_y)
    cur_y = draw_blind_spots(c, cur_y)

    c.showPage()


# ---------------------------------------------------------------------------
# Page 1
# ---------------------------------------------------------------------------

def draw_page1(c):
    draw_page_background(c)
    draw_watermark(c)

    sep_y = draw_header(c)
    cur_y = draw_org_metadata(c, sep_y)
    cur_y = draw_hook_stat_box(c, cur_y)

    # ---- Page 2 will be added after approval ----

    c.showPage()


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build(output_path=OUTPUT_PATH):
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setTitle(REPORT_TITLE)

    draw_page1(c)
    draw_page2(c)

    c.save()
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    build()
