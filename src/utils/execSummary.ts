/**
 * execSummary.ts
 *
 * Generates a templated Executive Summary from assessment results.
 * No API calls — assembled from assessment data + embedded KB insights.
 * AI-generated (Pro) version is a future session build.
 */

import type {
  OrganizationProfile,
  DimensionScore,
  DimensionKey,
  RiskScore,
  BlindSpot,
  LicenseTier,
  Region,
} from '@/types/assessment';
import {
  INDUSTRY_INTRO,
  INDUSTRY_REGULATORY,
  INDUSTRY_GAP_INSIGHTS,
} from './industryContent';

// ─── Output Types ─────────────────────────────────────────────────────────────

export interface ExecSummarySection {
  heading: string;
  body: string;
}

// AI-generated narrative sections (opening + closing).
// Stored alongside the templated summary; displayed as bookends around the structured sections.
export interface AiNarrativeData {
  opening: string;
  closing: string;
  model: string;
  generatedAt: string;
}

export interface ExecSummaryGap {
  dimension: string;
  score: number;
  insight: string;
}

export interface ExecSummaryData {
  orgName: string;
  completedAt: string;
  maturityLevel: string;
  overallScore: number;
  riskLevel: string;
  section1: ExecSummarySection; // "How is AI governed?"
  section2: ExecSummarySection; // "What is the exposure?"
  section2Gaps: ExecSummaryGap[];
  regulatoryExposure: string;
  section3: ExecSummarySection; // "Where is the ROI?"
  upgradePrompt: string;
  isTemplated: true;
}

// ─── Dimension Labels ─────────────────────────────────────────────────────────

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  shadowAI: 'Shadow AI Control',
  vendorRisk: 'Vendor Risk Management',
  dataGovernance: 'Data Governance',
  securityCompliance: 'Security & Compliance',
  aiSpecificRisks: 'AI-Specific Risk Controls',
  roiTracking: 'ROI Accountability',
};

// ─── Knowledge Base Insights (per dimension) ─────────────────────────────────
// Sourced from AlphaPi_AI_Governance_Synthesis.md — executive register.

const DIMENSION_INSIGHTS: Record<DimensionKey, string> = {
  shadowAI:
    'Nearly half of all AI users operate outside official organizational systems — not out of ' +
    'defiance, but because the organization has not made the sanctioned path easier than the ' +
    'unsanctioned one. The consequence is threefold: proprietary data entering unmanaged systems, ' +
    'AI outputs influencing operations without oversight, and experimentation that never compounds ' +
    'into institutional knowledge.',

  vendorRisk:
    'Federal courts have established that employers cannot hide behind the automated nature of ' +
    'their AI tools. A vendor that scraped data on over one billion workers and filtered candidates ' +
    'before a human saw the application created litigation exposure for every client on its list — ' +
    'not just for the vendor. Third-party AI risk is now a board-level fiduciary issue.',

  dataGovernance:
    'AI governance is the direct expression of data governance maturity. Fragmented, poorly ' +
    'classified, or lineage-invisible data produces AI outputs that are difficult to explain, ' +
    'impossible to audit, and risky to scale. The three foundational questions that determine AI ' +
    'accountability: Who owns the data? Who defines quality thresholds? Who approves usage rights?',

  securityCompliance:
    'Enterprise AI faces ten documented active threat categories — from prompt injection and data ' +
    'poisoning to excessive autonomy and supply chain compromise. Security architecture bolted on ' +
    'after deployment fails at scale. The seven-layer agentic security model (identity, agent ' +
    'control, tool security, MCP, governance, monitoring, and compliance) must be embedded from ' +
    'the first deployment, not retrofitted after an incident.',

  aiSpecificRisks:
    'Risk in AI systems attaches at execution, not reasoning. Permissions are not authority. ' +
    'Logs are not enforcement. The structural gap between decision → authority → execution is ' +
    'the primary unaddressed risk in current AI governance frameworks — organizations assume ' +
    'authorization because a workflow ran successfully and a log captured the decision. Neither ' +
    'constitutes validated authority at the execution boundary.',

  roiTracking:
    'Boards have converged on three questions as the AI accountability frame: "How is AI ' +
    'governed? What is the exposure? Where is the ROI?" Without structured ROI measurement, ' +
    'your organization cannot credibly answer the third. The 46% gap between organizations ' +
    'investing in AI and those able to report returns is not an AI capability problem — it is ' +
    'a governance and measurement infrastructure problem.',
};

// ─── Maturity-Level Narratives ────────────────────────────────────────────────

const MATURITY_NARRATIVES: Record<string, string> = {
  Experimenter:
    'At the Experimenter stage, AI deployment is fragmented — teams run isolated tools and ' +
    'ad-hoc use cases without defined business outcomes, governance is periodic at best, and ' +
    'success metrics remain undefined. AI outputs are already influencing customers and ' +
    'operations; the oversight infrastructure to manage that influence has not yet been built. ' +
    'The primary risk is not a technology failure — it is the absence of the organizational ' +
    'structure that would detect one.',

  Builder:
    'At the Builder stage, governance frameworks are being established — but they remain ' +
    'documentation-heavy and policy-centric rather than execution-embedded. The critical gap: ' +
    'policy cannot keep pace with AI deployment velocity. Authority validation is absent at ' +
    'the execution boundary, meaning the organization can explain what happened after the fact, ' +
    'but lacks the infrastructure to prevent it from happening again.',

  Innovator:
    'At the Innovator stage, AI agents are beginning to connect with enterprise systems, and ' +
    'governance is becoming a multi-team function. The primary risk at this stage is that the ' +
    'execution control plane is not yet hardened — risk remains visible at the model layer ' +
    'but is not yet governed at the system layer, where real exposure accumulates as AI ' +
    'gains autonomy across consequential workflows.',

  Achiever:
    'At the Achiever stage — the highest maturity tier — governance operates as organizational ' +
    'infrastructure, not periodic oversight. A dedicated AI Governance Leader function is in ' +
    'place with formal authority across agentic governance, regulatory compliance, security and ' +
    'resilience, data accountability, and business enablement. Continuous monitoring replaces ' +
    'periodic snapshots. The organization can answer the board question that matters most: ' +
    '"If this drifts tomorrow, will we know?"',
};

// ─── Region → Regulatory Framework Mapping ───────────────────────────────────

const REGION_REGULATORY_MAP: Record<Region, string[]> = {
  'Europe': ['EU AI Act (enforcement: August 2, 2026)', 'GDPR'],
  'North America': ['NIST AI Risk Management Framework', 'CCPA (for California operations)'],
  'Asia-Pacific': ['Singapore Model AI Governance Framework', 'Australia Privacy Act (December 2026)'],
  'Middle East & Africa': ['ISO 42001 AI Management System Standard'],
  'Latin America': ['Brazil LGPD (Lei Geral de Proteção de Dados)'],
};

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateTemplatedSummary(
  profile: OrganizationProfile,
  riskScore: RiskScore,
  dimensionScores: DimensionScore[],
  _blindSpots: BlindSpot[],
  licenseTier: LicenseTier,
  completedAt: string
): ExecSummaryData {
  const orgName = profile.organizationName || 'Your organization';
  const maturity = riskScore.currentMaturity;
  const overallScore = Math.round(riskScore.overallRisk);
  const riskLevel = riskScore.riskLevel;

  // ── Section 1: "How is AI governed?" ──────────────────────────────────────

  const maturityNarrative = MATURITY_NARRATIVES[maturity] ?? MATURITY_NARRATIVES['Experimenter'];
  const industryIntro = profile.industry ? INDUSTRY_INTRO[profile.industry] : undefined;

  let s1Body =
    (industryIntro ? `${industryIntro}\n\n` : '') +
    `${orgName} is currently operating at the **${maturity}** stage of AI governance maturity.\n\n` +
    maturityNarrative +
    `\n\nOverall governance score: **${overallScore}/100** — ${riskLevel} risk profile.`;

  if (overallScore < 54) {
    s1Body +=
      ` Only 54% of organizations investing heavily in AI can currently report ROI on that ` +
      `investment. A governance score below 70 is a primary structural driver of that gap — ` +
      `the issue is not AI capability, it is governance infrastructure.`;
  } else if (overallScore >= 70) {
    s1Body +=
      ` ${orgName}'s governance posture positions it ahead of the industry baseline. ` +
      `Organizations at this level deploy AI faster, scale more safely, and withstand ` +
      `regulatory scrutiny more effectively than those treating governance as a cost center.`;
  }

  // ── Section 2: "What is the exposure?" ────────────────────────────────────

  const answeredDims = dimensionScores
    .filter((d) => d.answered)
    .sort((a, b) => a.score - b.score); // ascending = worst first

  const industryGapMap =
    licenseTier === 'professional' && profile.industry
      ? INDUSTRY_GAP_INSIGHTS[profile.industry]
      : undefined;

  const gaps: ExecSummaryGap[] = answeredDims
    .filter((d) => d.score < 70)
    .slice(0, 3)
    .map((d) => ({
      dimension: DIMENSION_LABELS[d.key],
      score: Math.round(d.score),
      insight: industryGapMap?.[d.key] ?? DIMENSION_INSIGHTS[d.key],
    }));

  let s2Body = '';

  if (gaps.length === 0) {
    s2Body =
      `Assessment results indicate that ${orgName} has achieved strong governance posture ` +
      `across all assessed dimensions. The focus should shift from gap remediation to ` +
      `continuous monitoring and governance maturity maintenance.`;
  } else {
    const gapCount = gaps.length;
    s2Body =
      `Assessment identified **${gapCount} governance dimension${gapCount > 1 ? 's' : ''} ` +
      `requiring immediate attention**:\n\n`;

    gaps.forEach((g) => {
      s2Body += `**${g.dimension}** — ${g.score}/100\n${g.insight}\n\n`;
    });
  }

  // Regulatory exposure
  const regions = (profile.operatingRegions ?? []) as Region[];
  const regulations: string[] = [];
  regions.forEach((r) => {
    const regs = REGION_REGULATORY_MAP[r];
    if (regs) regulations.push(...regs);
  });
  if (profile.industry) {
    const industryRegs = INDUSTRY_REGULATORY[profile.industry];
    if (industryRegs) regulations.push(...industryRegs);
  }
  const uniqueRegs = [...new Set(regulations)];

  let regulatoryExposure = '';
  if (uniqueRegs.length > 0) {
    const regionList = regions.join(', ');
    regulatoryExposure =
      `${orgName} operates across ${regionList}, creating active compliance obligations under: ` +
      uniqueRegs.join(', ') + `. `;

    const secScore = dimensionScores.find((d) => d.key === 'securityCompliance');
    if (secScore && secScore.score < 60) {
      regulatoryExposure +=
        `Current Security & Compliance posture (${Math.round(secScore.score)}/100) suggests ` +
        `material exposure under these frameworks. Regulatory penalties in the EU AI Act context ` +
        `reach €35M or 7% of worldwide turnover for high-risk system violations.`;
    } else {
      regulatoryExposure +=
        `Continued governance investment is required to maintain defensible compliance posture ` +
        `as enforcement deadlines approach.`;
    }
  } else {
    regulatoryExposure =
      `Complete your organization profile with operating regions to receive a tailored ` +
      `regulatory exposure analysis.`;
  }

  // ── Section 3: "Where is the ROI?" ────────────────────────────────────────

  const roiDim = dimensionScores.find((d) => d.key === 'roiTracking');
  const roiScore = roiDim?.score ?? 0;
  const spendText = profile.expectedAISpend;

  let s3Body =
    `The three questions every board is asking in 2026: "How is AI governed? ` +
    `What is the exposure? Where is the ROI?" This assessment provides the data to ` +
    `answer all three.\n\n`;

  if (roiScore < 60) {
    s3Body +=
      `${orgName}'s current ROI tracking posture (${Math.round(roiScore)}/100) indicates ` +
      `that AI investment returns cannot yet be systematically demonstrated to leadership or ` +
      `the board. This is not uncommon — 68% of organizations are investing heavily in AI, ` +
      `yet only 54% can report returns. The gap is governance and measurement infrastructure, ` +
      `not AI performance.\n\n`;
  } else {
    s3Body +=
      `${orgName} has established baseline ROI measurement practices. The next horizon is ` +
      `connecting governance maturity gains directly to deployment velocity and risk-adjusted ` +
      `returns — the hallmark of Achiever-stage organizations.\n\n`;
  }

  if (spendText) {
    s3Body +=
      `With ${spendText} in declared AI investment, the financial case for governance ` +
      `infrastructure is proportional: unmitigated exposure grows with deployment scale. ` +
      `Every dollar invested in governance infrastructure at this stage reduces the cost of ` +
      `the incident you are currently unable to detect.`;
  }

  // ── Upgrade prompt ─────────────────────────────────────────────────────────

  let upgradePrompt = '';

  if (licenseTier === 'free') {
    upgradePrompt =
      `This summary reflects your top-level results. Upgrade to AlphaPi Pro to unlock: ` +
      `a 5-dimension ROI dashboard, complete blind spot analysis with remediation roadmap, ` +
      `full 30-question vendor risk questionnaire, and jurisdiction-specific compliance ` +
      `guidance — the full toolkit to move from assessment to executive action.`;
  } else {
    // Pro tier — API key CTA
    upgradePrompt =
      `Add your Anthropic API key in Settings → Account to generate a fully AI-written ` +
      `Executive Summary — a bespoke narrative tailored to ${orgName}'s specific governance ` +
      `profile, industry context, and regulatory exposure. The templated summary above ` +
      `reflects your assessment data; the AI-generated version adds the industry benchmarking ` +
      `and interpretive context your board expects.`;
  }

  return {
    orgName,
    completedAt,
    maturityLevel: maturity,
    overallScore,
    riskLevel,
    section1: { heading: 'How is AI governed?', body: s1Body },
    section2: { heading: 'What is the exposure?', body: s2Body },
    section2Gaps: gaps,
    regulatoryExposure,
    section3: { heading: 'Where is the ROI?', body: s3Body },
    upgradePrompt,
    isTemplated: true,
  };
}
