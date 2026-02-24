import type {
  OrganizationProfile,
  DimensionScore,
  RiskLevel,
  DimensionKey,
  JurisdictionCode,
  MaturityLevel,
  Industry,
} from '@/types/assessment';

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  shadowAI: 'Shadow AI',
  vendorRisk: 'Vendor Risk',
  dataGovernance: 'Data Governance',
  securityCompliance: 'Security & Compliance',
  aiSpecificRisks: 'AI-Specific Risks',
  roiTracking: 'ROI Tracking',
};

export function getTopRiskyDimensions(dimensionScores: DimensionScore[], n: number): DimensionScore[] {
  return [...dimensionScores].sort((a, b) => b.score - a.score).slice(0, n);
}

function getIndustryPhrase(industry: Industry): string {
  const phrases: Partial<Record<Industry, string>> = {
    Healthcare: 'patient data and clinical decision support',
    'Financial Services': 'financial risk and regulatory obligations',
    Government: 'public trust and accountability standards',
    'Legal Services': 'client confidentiality and professional liability',
    Education: 'student data protection and academic integrity',
    Technology: 'product reliability and data handling',
    Manufacturing: 'operational continuity and supply chain integrity',
  };
  return phrases[industry] ?? 'organizational data and operations';
}

function getMaturityFraming(maturity: MaturityLevel): string {
  const framings: Record<MaturityLevel, string> = {
    Experimenter: 'beginning to explore AI\'s potential',
    Builder: 'actively building AI capabilities',
    Innovator: 'scaling AI across the organization',
    Achiever: 'operating AI as a core business driver',
  };
  return framings[maturity];
}

function getMaturityContext(maturity: MaturityLevel, industryPhrase: string): string {
  switch (maturity) {
    case 'Experimenter':
      return `As an organization beginning to explore AI\'s potential, establishing clear governance from the outset is especially important — decisions made now about ${industryPhrase} will shape your compliance posture for years to come.`;
    case 'Builder':
      return `As an organization actively building AI capabilities, this is a critical foundation-setting moment — the governance choices made now will determine how safely and scalably AI can grow within your operations, particularly around ${industryPhrase}.`;
    case 'Innovator':
      return `As an organization scaling AI across the organization, governance must keep pace with growth — ensuring that controls around ${industryPhrase} remain robust as adoption expands and use cases become more complex.`;
    case 'Achiever':
      return `As an organization operating AI as a core business driver, protecting your competitive advantage requires that governance around ${industryPhrase} remains rigorous and continuously improving.`;
    default:
      return `As an organization ${maturity}, governance decisions made now will shape your compliance posture for years to come.`;
  }
}

function buildPara1(profile: OrganizationProfile): string {
  const { organizationName, industry, aiMaturityLevel } = profile;
  const industryPhrase = getIndustryPhrase(industry);
  const maturityContext = getMaturityContext(aiMaturityLevel, industryPhrase);
  const maturityFraming = getMaturityFraming(aiMaturityLevel);

  return (
    `This assessment evaluated ${organizationName}\'s AI governance posture across six dimensions of risk and readiness. ` +
    `As a ${industry} organization ${maturityFraming}, ${maturityContext}`
  );
}

function getJurisdictionNote(jurisdiction: JurisdictionCode): string {
  const notes: Record<JurisdictionCode, string> = {
    us: 'Operating in the United States, where state-level AI regulations and CCPA data obligations are evolving rapidly, makes addressing these gaps a near-term compliance priority.',
    eu: 'Operating in the European Union, where the EU AI Act enters enforcement in August 2026 and GDPR obligations continue to apply, makes strengthening these areas a near-term compliance priority.',
    uk: 'Operating in the United Kingdom, where the UK AI Safety Institute continues to develop guidance and UK GDPR obligations remain in force, makes addressing these areas a near-term compliance priority.',
    ap: 'Operating in the Asia-Pacific region, where Singapore\'s Model AI Governance Framework sets a regional benchmark and data localisation requirements vary by jurisdiction, makes addressing these gaps a near-term compliance priority.',
    latam: 'Operating in Latin America, where Brazil\'s LGPD establishes data protection obligations and emerging regional AI frameworks are taking shape, makes addressing these gaps a near-term compliance priority.',
    mea: 'Operating in the Middle East and Africa, where the UAE AI Strategy and South Africa\'s POPIA represent increasing regulatory expectations, makes addressing these gaps a near-term compliance priority.',
    all: 'Given the rapidly evolving global AI regulatory landscape, with new obligations taking effect across multiple jurisdictions, addressing these gaps represents an important near-term priority.',
  };
  return notes[jurisdiction];
}

function buildPara2(
  profile: OrganizationProfile,
  overallScore: number,
  riskLevel: RiskLevel,
  dimensionScores: DimensionScore[],
  jurisdiction: JurisdictionCode
): string {
  const { organizationName } = profile;
  const top2 = getTopRiskyDimensions(dimensionScores, 2);
  const topLabels = top2.map((d) => DIMENSION_LABELS[d.key]);

  const riskLabel = riskLevel.charAt(0) + riskLevel.slice(1).toLowerCase();
  const dimensionText =
    topLabels.length === 2
      ? `${topLabels[0]} and ${topLabels[1]}`
      : topLabels[0] ?? 'the highest-scoring dimension';

  const jurisdictionNote = getJurisdictionNote(jurisdiction);

  return (
    `${organizationName} scored ${overallScore} out of 100, placing it in the ${riskLabel} risk category — indicating ` +
    getRiskDescription(riskLevel) +
    ` The areas of greatest concern are ${dimensionText}, where current controls are limited relative to your organization\'s exposure. ` +
    jurisdictionNote
  );
}

function getRiskDescription(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'LOW':
      return 'a strong governance foundation with limited gaps across the dimensions assessed.';
    case 'MEDIUM':
      return 'meaningful progress in some areas alongside gaps that warrant structured attention.';
    case 'HIGH':
      return 'material governance gaps across the dimensions assessed.';
    case 'CRITICAL':
      return 'significant governance gaps across the dimensions assessed.';
    default:
      return 'governance gaps across the dimensions assessed.';
  }
}

function getFirstActionSentence(topDimension: DimensionKey): string {
  const actions: Record<DimensionKey, string> = {
    shadowAI:
      'The most pressing action is to establish a formal AI tool registry and usage policy — a structured record of what AI tools are in use, by whom, and for what purpose.',
    vendorRisk:
      'The most pressing action is to conduct a structured vendor AI risk review — assessing the AI practices, data handling, and contractual obligations of your key technology providers.',
    dataGovernance:
      'The most pressing action is to map AI data flows and classify data sensitivity — understanding what data your AI systems touch, and where governance controls need to be applied.',
    securityCompliance:
      'The most pressing action is to perform an AI security posture review — assessing how AI systems are protected, monitored, and governed within your existing security framework.',
    aiSpecificRisks:
      'The most pressing action is to assess model risk and hallucination controls — evaluating how your organization identifies, monitors, and responds to AI outputs that may be inaccurate or harmful.',
    roiTracking:
      'The most pressing action is to implement an AI value measurement framework — establishing how your organization tracks the financial, operational, and strategic returns from AI investment.',
  };
  return actions[topDimension];
}

function getUrgencyOpener(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'LOW':
      return 'Your organization has built a strong governance foundation, and this is an opportunity to lead — deepening controls in targeted areas to stay ahead of regulatory and operational expectations.';
    case 'MEDIUM':
      return 'Your organization has made meaningful progress, but there are gaps to address before they become liabilities — a focused effort in the highest-risk dimensions will significantly improve your overall posture.';
    case 'HIGH':
      return 'The material gaps identified in this assessment require structured attention — a prioritized remediation effort focused on the highest-risk dimensions will reduce exposure and build organizational confidence in AI use.';
    case 'CRITICAL':
      return 'The significant exposure identified in this assessment requires immediate action — a clear, prioritized response plan focused on the highest-risk dimensions is essential to reducing compliance and operational risk.';
    default:
      return 'Addressing the gaps identified in this assessment will meaningfully improve your organization\'s AI governance posture.';
  }
}

function buildPara3(riskLevel: RiskLevel, dimensionScores: DimensionScore[]): string {
  const top = getTopRiskyDimensions(dimensionScores, 1)[0];
  const urgencyOpener = getUrgencyOpener(riskLevel);
  const firstAction = top ? getFirstActionSentence(top.key) : '';

  return (
    urgencyOpener +
    (firstAction ? ` ${firstAction}` : '') +
    ' With the right framework in place, organizations can build governance capability progressively — reducing risk while continuing to advance their AI programs with confidence.'
  );
}

export function generateExecutiveSummary(params: {
  profile: OrganizationProfile;
  overallScore: number;
  riskLevel: RiskLevel;
  dimensionScores: DimensionScore[];
  jurisdiction: JurisdictionCode;
}): { para1: string; para2: string; para3: string } {
  const { profile, overallScore, riskLevel, dimensionScores, jurisdiction } = params;

  return {
    para1: buildPara1(profile),
    para2: buildPara2(profile, overallScore, riskLevel, dimensionScores, jurisdiction),
    para3: buildPara3(riskLevel, dimensionScores),
  };
}
