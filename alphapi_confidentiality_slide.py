"""
alphapi_confidentiality_slide.py
Generates docs/alphapi-confidentiality-slide.pdf — full-screen slide for Armanino demo screen share.

Usage:
    python3 alphapi_confidentiality_slide.py

Output:
    docs/alphapi-confidentiality-slide.pdf

Dependencies:
    pip install reportlab pillow
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

# ---------------------------------------------------------------------------
# Brand tokens
# ---------------------------------------------------------------------------
DARK_BASE   = HexColor("#02093A")
ACCENT_GOLD = HexColor("#FFCE20")
WHITE       = HexColor("#FFFFFF")
LIGHT_TEXT  = HexColor("#B8C4D8")

PAGE_W, PAGE_H = letter  # 612 x 792 pt

LOGO_PATH   = os.path.join(os.path.dirname(__file__), "public", "assets", "alphapi-logo.png")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "docs", "alphapi-confidentiality-slide.pdf")


def build_slide(output_path=OUTPUT_PATH):
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setTitle("AlphaPi — Confidential")

    # Background
    c.setFillColor(DARK_BASE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top gold bar
    c.setFillColor(ACCENT_GOLD)
    c.rect(0, PAGE_H - 5, PAGE_W, 5, fill=1, stroke=0)

    # Bottom gold bar
    c.setFillColor(ACCENT_GOLD)
    c.rect(0, 0, PAGE_W, 5, fill=1, stroke=0)

    # Logo centered, above vertical center
    logo_size = 64
    logo_x = (PAGE_W - logo_size) / 2
    logo_y = PAGE_H / 2 + 90

    if os.path.exists(LOGO_PATH):
        c.drawImage(
            LOGO_PATH, logo_x, logo_y,
            width=logo_size, height=logo_size,
            preserveAspectRatio=True, mask="auto"
        )

    # "ALPHAPI" centered below logo
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 20)
    name = "ALPHAPI"
    name_w = c.stringWidth(name, "Helvetica-Bold", 20)
    c.drawString((PAGE_W - name_w) / 2, logo_y - 22, name)

    # Gold separator line
    sep_w = 140
    sep_y = logo_y - 44
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(1.5)
    c.line((PAGE_W - sep_w) / 2, sep_y, (PAGE_W + sep_w) / 2, sep_y)

    # Main message: conversational, gold, centered, bold
    lines = [
        "Everything you're about to see is confidential.",
        "We're sharing it in good faith for your feedback.",
        "Please keep it between us.",
    ]

    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Bold", 18)
    line_h = 32
    text_start_y = sep_y - 44

    for i, line in enumerate(lines):
        lw = c.stringWidth(line, "Helvetica-Bold", 18)
        c.drawString((PAGE_W - lw) / 2, text_start_y - i * line_h, line)

    # Secondary line: company + domain
    secondary = "AlphaPi, LLC  |  getalphapi.com"
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 9)
    sw = c.stringWidth(secondary, "Helvetica", 9)
    c.drawString((PAGE_W - sw) / 2, text_start_y - len(lines) * line_h - 24, secondary)

    c.save()
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    build_slide()
