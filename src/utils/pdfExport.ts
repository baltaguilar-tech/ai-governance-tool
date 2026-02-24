import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RiskLevel, DimensionScore, BlindSpot, Recommendation, QuestionResponse, AssessmentQuestion, OrganizationProfile, MaturityLevel, Region } from '@/types/assessment';
import { DIMENSION_MAP, DIMENSIONS } from '@/data/dimensions';
import { getRiskColor, getImmediateAction } from './scoring';
import { generateExecutiveSummary } from './executiveSummary';

// ── Save helper ──────────────────────────────────────────────────────────────
// Tries the Tauri native save dialog first; falls back to browser blob download
// when running in a dev/browser context where Tauri IPC is unavailable.
async function savePdf(doc: jsPDF, defaultName: string): Promise<void> {
  const pdfBytes = doc.output('arraybuffer');
  const inTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  if (inTauri) {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeFile } = await import('@tauri-apps/plugin-fs');
    const filePath = await save({
      defaultPath: defaultName,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (filePath) {
      await writeFile(filePath, new Uint8Array(pdfBytes));
      alert(`PDF saved to:\n${filePath}`);
    }
    return;
  }

  // Browser fallback — triggers a normal file download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Graph / narrative helpers ─────────────────────────────────────────────────

const DIM_SHORT: Record<string, string> = {
  shadowAI: 'Shadow AI',
  vendorRisk: 'Vendor Risk',
  dataGovernance: 'Data Gov.',
  securityCompliance: 'Security',
  aiSpecificRisks: 'AI Risks',
  roiTracking: 'ROI',
};

function deriveJurisdiction(regions: Region[]) {
  if (regions.includes(Region.Europe)) return 'eu' as const;
  if (regions.includes(Region.NorthAmerica)) return 'us' as const;
  if (regions.includes(Region.AsiaPacific)) return 'ap' as const;
  if (regions.includes(Region.LatinAmerica)) return 'latam' as const;
  if (regions.includes(Region.MiddleEast)) return 'mea' as const;
  return 'all' as const;
}

function drawRiskBars(
  doc: jsPDF,
  dimensionScores: DimensionScore[],
  x: number,
  startY: number,
  availWidth: number,
  darkMode = false
): number {
  const labelW = 52;
  const scoreW = 16;
  const barW = availWidth - labelW - scoreW - 4;
  const barH = 6;
  const rowH = 9;

  doc.setFontSize(7.5);
  doc.setTextColor(darkMode ? 155 : 16, darkMode ? 179 : 42, darkMode ? 200 : 67);
  doc.text('Dimension Risk Overview', x, startY);

  let y = startY + 6;
  for (const ds of dimensionScores) {
    const label = DIM_SHORT[ds.key] ?? ds.key;
    const fillW = Math.max(1, (ds.score / 100) * barW);

    doc.setFontSize(6.5);
    doc.setTextColor(darkMode ? 155 : 98, darkMode ? 179 : 125, darkMode ? 200 : 152);
    doc.text(label, x, y + barH * 0.75);

    doc.setFillColor(darkMode ? 30 : 208, darkMode ? 55 : 220, darkMode ? 90 : 240);
    doc.roundedRect(x + labelW, y, barW, barH, 1, 1, 'F');

    doc.setFillColor(getRiskColor(ds.riskLevel));
    doc.roundedRect(x + labelW, y, fillW, barH, 1, 1, 'F');

    doc.setFontSize(6.5);
    doc.setTextColor(darkMode ? 155 : 98, darkMode ? 179 : 125, darkMode ? 200 : 152);
    doc.text(`${ds.score}`, x + labelW + barW + 2, y + barH * 0.75);

    y += rowH;
  }
  return y; // returns final Y after last bar
}

function drawMaturityScale(
  doc: jsPDF,
  maturityLevel: MaturityLevel,
  x: number,
  startY: number,
  availWidth: number,
  darkMode = false
): void {
  const levels = [MaturityLevel.Experimenter, MaturityLevel.Builder, MaturityLevel.Innovator, MaturityLevel.Achiever];
  const labels = ['Experimenter', 'Builder', 'Innovator', 'Achiever'];
  const activeIdx = levels.indexOf(maturityLevel);
  const stepW = availWidth / 4;
  const lineY = startY + 8;

  doc.setFontSize(7.5);
  doc.setTextColor(darkMode ? 155 : 16, darkMode ? 179 : 42, darkMode ? 200 : 67);
  doc.text('AI Maturity Position', x, startY);

  doc.setDrawColor(darkMode ? 60 : 180, darkMode ? 90 : 200, darkMode ? 130 : 220);
  doc.setLineWidth(0.5);
  doc.line(x, lineY, x + availWidth, lineY);

  labels.forEach((label, i) => {
    const cx = x + stepW * i + stepW / 2;
    const isActive = i === activeIdx;
    if (isActive) {
      doc.setFillColor(37, 99, 235);
      doc.circle(cx, lineY, 4, 'F');
    } else {
      doc.setFillColor(darkMode ? 30 : 200, darkMode ? 55 : 215, darkMode ? 90 : 235);
      doc.circle(cx, lineY, 3, 'F');
    }
    doc.setFontSize(6.5);
    doc.setTextColor(darkMode ? 155 : 98, darkMode ? 179 : 125, darkMode ? 200 : 152);
    doc.text(label, cx, lineY + 8, { align: 'center' });
  });
}

function drawExecSummaryText(
  doc: jsPDF,
  para1: string,
  para2: string,
  para3: string,
  startY: number,
  pageWidth: number,
  margin: number,
  darkMode = false
): number {
  const textW = pageWidth - margin * 2;
  let y = startY;
  const lineH = 5;
  const paraGap = 6;
  const bodyColor: [number, number, number] = darkMode ? [155, 179, 200] : [51, 78, 104];

  for (const para of [para1, para2, para3]) {
    doc.setFontSize(8.5);
    doc.setTextColor(...bodyColor);
    const lines = doc.splitTextToSize(para, textW);
    doc.text(lines, margin, y);
    y += lines.length * lineH + paraGap;
  }
  return y;
}

export async function generateFreePDF(
  dimensionScores: DimensionScore[],
  overallScore: number,
  riskLevel: RiskLevel,
  achieverScore: number,
  orgName: string,
  blindSpots: { title: string; severity: RiskLevel; score: number }[],
  profile: OrganizationProfile
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== TITLE PAGE =====
  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, 100, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('AI Governance Assessment', pageWidth / 2, 40, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Summary Report', pageWidth / 2, 52, { align: 'center' });

  doc.setFontSize(16);
  doc.text(orgName, pageWidth / 2, 70, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(155, 179, 200);
  doc.text(
    `Generated ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`,
    pageWidth / 2,
    82,
    { align: 'center' }
  );

  // ===== OVERALL SCORE =====
  doc.setTextColor(16, 42, 67);
  doc.setFontSize(18);
  doc.text('Governance Score', 20, 120);

  const riskColor = getRiskColor(riskLevel);
  doc.setFillColor(riskColor);
  doc.circle(50, 150, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(String(overallScore), 50, 150, { align: 'center', baseline: 'middle' });

  doc.setTextColor(16, 42, 67);
  doc.setFontSize(12);
  doc.text(`Risk Level: ${riskLevel}`, 80, 145);
  doc.text(`Achiever Score: ${achieverScore}/100`, 80, 155);
  doc.setFontSize(9);
  doc.setTextColor(98, 125, 152);
  doc.text('Higher score = stronger governance (0-100 scale)', 80, 165);

  // ===== PAGE 1 GRAPHS =====
  drawRiskBars(doc, dimensionScores, 20, 178, pageWidth - 40);
  drawMaturityScale(doc, profile.aiMaturityLevel ?? MaturityLevel.Experimenter, 20, 250, pageWidth - 40);

  // ===== PAGE 2: EXEC SUMMARY + DIMENSION TABLE + BLIND SPOTS =====
  doc.addPage();

  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Executive Summary', 20, 20);

  const jurisdiction = deriveJurisdiction(profile.operatingRegions ?? []);
  const { para1, para2, para3 } = generateExecutiveSummary({
    profile,
    overallScore,
    riskLevel,
    dimensionScores,
    jurisdiction,
  });
  let execY = drawExecSummaryText(doc, para1, para2, para3, 38, pageWidth, 20);

  // Dimension scores table on page 2
  execY += 4;
  doc.setFontSize(11);
  doc.setTextColor(16, 42, 67);
  doc.text('Dimension Scores', 20, execY);

  const tableData = dimensionScores.map((ds) => [
    DIMENSION_MAP[ds.key]?.label || ds.key,
    `${ds.score}/100`,
    ds.riskLevel,
    `${DIMENSION_MAP[ds.key]?.weight ? DIMENSION_MAP[ds.key].weight * 100 : 0}%`,
  ]);

  autoTable(doc, {
    startY: execY + 4,
    head: [['Dimension', 'Score', 'Risk Level', 'Weight']],
    body: tableData,
    headStyles: { fillColor: [16, 42, 67], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [51, 78, 104] },
    alternateRowStyles: { fillColor: [240, 244, 248] },
    margin: { left: 20, right: 20 },
  });

  // ===== BLIND SPOTS (top 3) =====

  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Top Blind Spots', 20, 20);

  let yPos = 45;
  const topSpots = blindSpots.slice(0, 3);
  for (const spot of topSpots) {
    doc.setTextColor(16, 42, 67);
    doc.setFontSize(11);
    doc.text(`${spot.severity} (${spot.score}/100)`, 20, yPos);

    doc.setFontSize(10);
    doc.setTextColor(51, 78, 104);
    const lines = doc.splitTextToSize(spot.title, pageWidth - 40);
    doc.text(lines, 20, yPos + 8);

    yPos += 8 + lines.length * 6 + 10;
  }

  // ===== UPGRADE CTA =====
  yPos += 10;
  doc.setFillColor(240, 244, 248);
  doc.roundedRect(20, yPos, pageWidth - 40, 50, 3, 3, 'F');
  doc.setTextColor(16, 42, 67);
  doc.setFontSize(12);
  doc.text('Unlock the Full Report', pageWidth / 2, yPos + 15, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(98, 125, 152);
  const ctaLines = doc.splitTextToSize(
    'Upgrade to Pro for: all blind spots with detailed actions, customized vendor questionnaire (30 questions), industry-specific playbooks, multi-dimensional ROI framework, regulatory compliance checklists, and detailed implementation roadmap.',
    pageWidth - 60
  );
  doc.text(ctaLines, pageWidth / 2, yPos + 25, { align: 'center' });

  // ===== FOOTER =====
  doc.setTextColor(155, 179, 200);
  doc.setFontSize(8);
  doc.text(
    'Generated by AI Governance & ROI Assessment Tool | baltaguilar-tech | Data processed locally',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  // ===== SAVE =====
  const defaultName = `AI-Governance-Assessment-${orgName.replace(/\s+/g, '-')}.pdf`;
  await savePdf(doc, defaultName);
}

// ============================================================
// PRO REPORT: Full assessment with selected answers + all recs
// ============================================================
export async function generateProPDF(
  dimensionScores: DimensionScore[],
  overallScore: number,
  riskLevel: RiskLevel,
  achieverScore: number,
  orgName: string,
  blindSpots: BlindSpot[],
  recommendations: Recommendation[],
  responses: QuestionResponse[],
  questions: AssessmentQuestion[],
  profile: OrganizationProfile
): Promise<void> {
  const doc = new jsPDF({ format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  const addFooter = (label = '') => {
    doc.setFontSize(7);
    doc.setTextColor(155, 179, 200);
    doc.text(
      'AI Governance & ROI Assessment Tool | Pro Report | Confidential',
      margin,
      pageHeight - 8
    );
    if (label) {
      doc.text(label, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  };

  // ============================================================
  // PAGE 1: COVER
  // ============================================================
  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // PRO badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth / 2 - 22, 28, 44, 13, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PRO REPORT', pageWidth / 2, 37, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('AI Governance &', pageWidth / 2, 78, { align: 'center' });
  doc.text('ROI Assessment', pageWidth / 2, 93, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(155, 179, 200);
  doc.text('Full Assessment Report', pageWidth / 2, 108, { align: 'center' });

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(margin, 120, pageWidth - margin, 120);

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(orgName, pageWidth / 2, 138, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(155, 179, 200);
  doc.text(
    `Generated ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`,
    pageWidth / 2,
    150,
    { align: 'center' }
  );

  // Score summary on cover
  doc.setFillColor(30, 60, 100);
  doc.roundedRect(margin, 168, pageWidth - margin * 2, 55, 4, 4, 'F');

  doc.setFontSize(10);
  doc.setTextColor(155, 179, 200);
  doc.text('OVERALL GOVERNANCE SCORE', pageWidth / 2, 183, { align: 'center' });

  const riskColor = getRiskColor(riskLevel);
  doc.setFillColor(riskColor);
  doc.circle(pageWidth / 2, 202, 11, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(String(overallScore), pageWidth / 2, 202, { align: 'center', baseline: 'middle' });

  doc.setFontSize(9);
  doc.setTextColor(155, 179, 200);
  doc.text(
    `Risk Level: ${riskLevel}   |   Achiever Score: ${achieverScore}/100`,
    pageWidth / 2,
    218,
    { align: 'center' }
  );

  // ===== COVER PAGE GRAPHS (dark mode) =====
  drawRiskBars(doc, dimensionScores, margin, 232, pageWidth - margin * 2, true);

  addFooter();

  // ============================================================
  // PAGE 2: EXECUTIVE SUMMARY — Narrative + Scores + Blind Spots
  // ============================================================
  doc.addPage();

  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Executive Summary', margin, 17);

  // Narrative paragraphs
  const proJurisdiction = deriveJurisdiction(profile.operatingRegions ?? []);
  const proSummary = generateExecutiveSummary({
    profile,
    overallScore,
    riskLevel,
    dimensionScores,
    jurisdiction: proJurisdiction,
  });
  let proExecY = drawExecSummaryText(doc, proSummary.para1, proSummary.para2, proSummary.para3, 32, pageWidth, margin);

  proExecY += 4;

  const scoreTableData = dimensionScores.map((ds) => [
    DIMENSION_MAP[ds.key]?.label || ds.key,
    `${Math.round((DIMENSION_MAP[ds.key]?.weight || 0) * 100)}%`,
    `${ds.score}/100`,
    ds.riskLevel,
  ]);

  autoTable(doc, {
    startY: proExecY,
    head: [['Dimension', 'Weight', 'Score', 'Risk Level']],
    body: scoreTableData,
    headStyles: { fillColor: [16, 42, 67], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [51, 78, 104] },
    alternateRowStyles: { fillColor: [240, 244, 248] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
    },
  });

  let yPos = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setTextColor(16, 42, 67);
  doc.text(`Blind Spots Identified (${blindSpots.length})`, margin, yPos);
  yPos += 5;

  if (blindSpots.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(98, 125, 152);
    doc.text('No critical blind spots identified.', margin, yPos + 6);
  } else {
    const blindSpotData = blindSpots.map((bs) => [
      bs.severity,
      `${bs.score}/100`,
      bs.title,
      bs.immediateAction,
    ]);

    autoTable(doc, {
      startY: yPos + 3,
      head: [['Severity', 'Score', 'Blind Spot', 'Immediate Action']],
      body: blindSpotData,
      headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [51, 78, 104] },
      alternateRowStyles: { fillColor: [255, 245, 245] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 16, halign: 'center' },
        2: { cellWidth: 65 },
        3: { cellWidth: 68 },
      },
    });
  }

  addFooter('Executive Summary');

  // ============================================================
  // PAGES 3+: ONE SECTION PER DIMENSION (all questions + answers)
  // ============================================================
  for (const dimension of DIMENSIONS) {
    doc.addPage();

    const dimScore = dimensionScores.find((ds) => ds.key === dimension.key);
    const dimQuestions = questions.filter((q) => q.dimension === dimension.key);

    // Dimension header band
    doc.setFillColor(16, 42, 67);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(dimension.label, margin, 13);
    doc.setFontSize(8);
    doc.setTextColor(155, 179, 200);
    doc.text(
      `Score: ${dimScore?.score ?? 'N/A'}/100  |  Risk: ${dimScore?.riskLevel ?? 'N/A'}  |  Weight: ${Math.round(dimension.weight * 100)}%`,
      margin,
      22
    );

    yPos = 35;

    for (let qi = 0; qi < dimQuestions.length; qi++) {
      const question = dimQuestions[qi];
      const response = responses.find((r) => r.questionId === question.id);
      const selectedIndex =
        response !== undefined
          ? (question.options ?? []).findIndex((opt) => opt.value === response.value)
          : -1;

      // Use ASCII-safe selected marker (jsPDF default font doesn't support Unicode symbols)
      const optionRows = (question.options ?? []).map((opt, i) => [
        i === selectedIndex ? '[X]' : '',
        opt.label,
      ]);

      // Estimate space needed for page-break check
      const neededHeight = 10 + optionRows.length * 8 + 16;
      if (yPos + neededHeight > pageHeight - 18) {
        addFooter(dimension.shortLabel);
        doc.addPage();

        // Continuation banner
        doc.setFillColor(240, 244, 248);
        doc.rect(0, 0, pageWidth, 12, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(98, 125, 152);
        doc.text(`${dimension.label} (continued)`, margin, 9);
        yPos = 18;
      }

      autoTable(doc, {
        startY: yPos,
        head: [[{ content: `Q${qi + 1}. ${question.text}`, colSpan: 2 }]],
        body: optionRows,
        headStyles: {
          fillColor: [30, 58, 95],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 8, textColor: [60, 85, 110] },
        columnStyles: {
          0: { cellWidth: 18, halign: 'center' },
          1: { cellWidth: pageWidth - margin * 2 - 18 },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.row.index === selectedIndex) {
            data.cell.styles.fillColor = [209, 250, 229]; // light emerald
            data.cell.styles.textColor = [6, 78, 59];     // dark green
            data.cell.styles.fontStyle = 'bold';
          }
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // Immediate action note (only if not scored best — value 0 = best)
      // Use autoTable for the action box so text wraps correctly
      if (selectedIndex !== 0 || response === undefined) {
        const actionScore = response !== undefined ? 100 - response.value : 100;
        const action = getImmediateAction(question.id, actionScore);

        autoTable(doc, {
          startY: yPos,
          body: [[`Action: ${action}`]],
          bodyStyles: {
            fontSize: 7,
            textColor: [120, 80, 0],
            fillColor: [255, 251, 235],
            cellPadding: { top: 2.5, right: 4, bottom: 2.5, left: 4 },
          },
          columnStyles: {
            0: { cellWidth: pageWidth - margin * 2 },
          },
          margin: { left: margin, right: margin },
        });

        yPos = (doc as any).lastAutoTable.finalY;
      }

      yPos += 4; // gap between questions
    }

    addFooter(dimension.shortLabel);
  }

  // ============================================================
  // FINAL PAGE: RECOMMENDATIONS
  // ============================================================
  doc.addPage();

  doc.setFillColor(16, 42, 67);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Action Recommendations', margin, 17);

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedRecs = [...recommendations].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  const recData = sortedRecs.map((rec) => [
    rec.priority.toUpperCase(),
    rec.isPaid ? 'PRO' : 'FREE',
    rec.title,
    rec.description,
    rec.timeline.replace('this-', '').replace('-', ' '),
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Priority', 'Tier', 'Recommendation', 'Description', 'Timeline']],
    body: recData,
    headStyles: { fillColor: [16, 42, 67], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [51, 78, 104] },
    alternateRowStyles: { fillColor: [240, 244, 248] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center' },
      1: { cellWidth: 14, halign: 'center' },
      2: { cellWidth: 48 },
      3: { cellWidth: 78 },
      4: { cellWidth: 18, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        if (data.column.index === 0) {
          const p = String(data.cell.raw);
          if (p === 'CRITICAL') data.cell.styles.textColor = [185, 28, 28];
          else if (p === 'HIGH') data.cell.styles.textColor = [194, 65, 12];
          else if (p === 'MEDIUM') data.cell.styles.textColor = [146, 64, 14];
        }
        if (data.column.index === 1 && data.cell.raw === 'PRO') {
          data.cell.styles.textColor = [6, 95, 70];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  addFooter('Recommendations');

  // ============================================================
  // SAVE
  // ============================================================
  const defaultName = `AI-Governance-PRO-Report-${orgName.replace(/\s+/g, '-')}.pdf`;
  await savePdf(doc, defaultName);
}
