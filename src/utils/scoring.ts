import {
  AssessmentQuestion,
  DimensionKey,
  DimensionScore,
  QuestionResponse,
  RiskLevel,
  RiskScore,
  MaturityLevel,
  BlindSpot,
  OrganizationProfile,
} from '@/types/assessment';
import { DIMENSION_MAP } from '@/data/dimensions';

// Dimension weights from the spec
const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  shadowAI: 0.25,
  vendorRisk: 0.25,
  dataGovernance: 0.2,
  securityCompliance: 0.15,
  aiSpecificRisks: 0.1,
  roiTracking: 0.05,
};

// Score is now 0-100 where higher = better governance
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return RiskLevel.Low;
  if (score >= 40) return RiskLevel.Medium;
  if (score >= 20) return RiskLevel.High;
  return RiskLevel.Critical;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.Low:
      return '#10b981'; // green
    case RiskLevel.Medium:
      return '#f59e0b'; // amber
    case RiskLevel.High:
      return '#f97316'; // orange
    case RiskLevel.Critical:
      return '#ef4444'; // red
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.Low:
      return 'bg-emerald-100 text-emerald-800';
    case RiskLevel.Medium:
      return 'bg-amber-100 text-amber-800';
    case RiskLevel.High:
      return 'bg-orange-100 text-orange-800';
    case RiskLevel.Critical:
      return 'bg-red-100 text-red-800';
  }
}

export function calculateDimensionScore(
  dimension: DimensionKey,
  responses: QuestionResponse[],
  questions: AssessmentQuestion[]
): DimensionScore {
  const dimensionQuestions = questions.filter((q) => q.dimension === dimension);
  const questionScores: { questionId: string; score: number }[] = [];

  let totalScore = 0;
  let answeredCount = 0;

  for (const question of dimensionQuestions) {
    const response = responses.find((r) => r.questionId === question.id);
    if (response !== undefined) {
      questionScores.push({ questionId: question.id, score: response.value });
      totalScore += response.value;
      answeredCount++;
    }
  }

  const averageRaw = answeredCount > 0 ? totalScore / answeredCount : 100;
  // Invert: 0 (worst raw) → 100 (best display), 100 (worst raw) → 0 (worst display)
  const governanceScore = 100 - averageRaw;

  return {
    key: dimension,
    score: Math.round(governanceScore),
    riskLevel: getRiskLevel(governanceScore),
    questionScores,
  };
}

export function calculateOverallRisk(
  dimensionScores: DimensionScore[],
  profile: Partial<OrganizationProfile>
): RiskScore {
  const dimensions = {} as Record<DimensionKey, number>;
  let overallScore = 0;

  for (const ds of dimensionScores) {
    dimensions[ds.key] = ds.score;
    overallScore += ds.score * DIMENSION_WEIGHTS[ds.key];
  }

  overallScore = Math.round(overallScore);
  const riskLevel = getRiskLevel(overallScore);

  // Achiever score builds on governance score with maturity bonus
  const maturityBonus = getMaturityBonus(profile.aiMaturityLevel);
  const achieverScore = Math.min(100, Math.max(0, overallScore + maturityBonus));

  const currentMaturity = profile.aiMaturityLevel || MaturityLevel.Experimenter;
  const targetMaturity = determineTargetMaturity(achieverScore);
  const maturityGap = identifyMaturityGaps(dimensionScores, currentMaturity);

  return {
    dimensions,
    overallRisk: overallScore,
    riskLevel,
    achieverScore: Math.round(achieverScore),
    currentMaturity,
    targetMaturity,
    maturityGap,
  };
}

function getMaturityBonus(maturity?: MaturityLevel): number {
  switch (maturity) {
    case MaturityLevel.Achiever:
      return 15;
    case MaturityLevel.Innovator:
      return 10;
    case MaturityLevel.Builder:
      return 5;
    default:
      return 0;
  }
}

function determineTargetMaturity(achieverScore: number): MaturityLevel {
  if (achieverScore >= 75) return MaturityLevel.Achiever;
  if (achieverScore >= 50) return MaturityLevel.Innovator;
  if (achieverScore >= 25) return MaturityLevel.Builder;
  return MaturityLevel.Experimenter;
}

function identifyMaturityGaps(
  dimensionScores: DimensionScore[],
  currentMaturity: MaturityLevel
): string[] {
  const gaps: string[] = [];

  for (const ds of dimensionScores) {
    if (ds.score < 40) {
      const config = DIMENSION_MAP[ds.key];
      gaps.push(`${config.label} governance is ${ds.riskLevel.toLowerCase()} (score: ${ds.score}/100)`);
    }
  }

  if (currentMaturity === MaturityLevel.Experimenter) {
    gaps.push('No formal AI governance framework in place');
  }

  return gaps;
}

export function identifyBlindSpots(
  _dimensionScores: DimensionScore[],
  responses: QuestionResponse[],
  questions: AssessmentQuestion[]
): BlindSpot[] {
  const blindSpots: BlindSpot[] = [];

  // Find the lowest-scoring (worst governance) individual questions
  const scoredQuestions = responses
    .map((r) => {
      const question = questions.find((q) => q.id === r.questionId);
      // Invert: raw value 100 (worst) → display 0, raw 0 (best) → display 100
      return question ? { question, score: 100 - r.value } : null;
    })
    .filter((sq): sq is NonNullable<typeof sq> => sq !== null)
    .sort((a, b) => a.score - b.score);

  // Top blind spots from lowest-scoring (worst governance) questions
  for (const sq of scoredQuestions.slice(0, 10)) {
    if (sq.score <= 40) {
      blindSpots.push({
        title: sq.question.text,
        dimension: sq.question.dimension,
        severity: getRiskLevel(sq.score),
        score: sq.score,
        description: sq.question.helpText,
        immediateAction: getImmediateAction(sq.question.id, sq.score),
      });
    }
  }

  return blindSpots;
}

export function getImmediateAction(questionId: string, score: number): string {
  // Phase 0: dimension-prefix matching covers all 240 question IDs immediately.
  // Phase 4 (Option B): replace with full per-question map (shadow-e-1 through roi-a-10).

  if (questionId.startsWith('shadow-')) {
    return (
      'Conduct an AI inventory audit: survey department heads and cross-reference SSO logs, expense reports, and browser extensions. ' +
      'Build a centralized AI registry (tool name, owner, data accessed, risk tier, approval status). ' +
      'Draft an AI Acceptable Use Policy covering approved tools, prohibited uses (no customer PII in public AI), and a formal request process. Require employee acknowledgment within 30 days. ' +
      'WHY: Over 50% of workers use GenAI without IT approval — the majority of your AI risk is invisible until you actively look. ' +
      'RISK AVOIDED: Closes the visibility gap that enables undetected data leakage, compliance violations, and the "we didn\'t know" defense in a breach investigation.'
    );
  }

  if (questionId.startsWith('vendor-')) {
    return (
      'Conduct AI risk assessments for your top 10 critical vendors. Key questions: Do you train models on our data? Who owns outputs? What is your breach notification timeline? ' +
      'Update contracts with AI-specific clauses: data ownership, model training opt-out, audit rights, and exit/portability provisions. ' +
      'WHY: Most vendor contracts predate the AI era and contain no AI-specific protections — your data may be used for model training by default. ' +
      'RISK AVOIDED: Prevents data from being permanently incorporated into vendor AI models, establishes liability clarity, and creates audit evidence for regulatory compliance.'
    );
  }

  if (questionId.startsWith('data-')) {
    return (
      'Update your data classification policy to explicitly address AI data handling: which data categories can enter which AI systems, and under what conditions. ' +
      'Deploy data loss prevention (DLP) controls to block sensitive data (PII, financial, legal) from being pasted into public AI services. ' +
      'WHY: 77% of employees paste company data into GenAI tools — most without understanding the data exposure implications. ' +
      'RISK AVOIDED: Prevents customer and employee PII from flowing to AI services outside your contractual control. Reduces GDPR, CCPA, and HIPAA exposure from unauthorized AI data processing.'
    );
  }

  if (questionId.startsWith('security-')) {
    return (
      'Create an AI-specific incident response plan covering three scenarios: (1) data leakage via AI tool, (2) harmful AI output reaching a customer, (3) AI vendor security incident. ' +
      'Assign clear ownership for each scenario and test the plan quarterly. Implement access controls and audit logging for all AI system interactions. ' +
      'WHY: Standard incident response plans don\'t address AI-specific failure modes — hallucinations, model poisoning, and AI supply chain attacks require different containment steps. ' +
      'RISK AVOIDED: Reduces mean time to contain an AI-related incident. Provides documented evidence of security controls under regulatory scrutiny.'
    );
  }

  if (questionId.startsWith('airisks-')) {
    return (
      'Implement human review checkpoints for high-stakes AI outputs (customer-facing content, financial decisions, medical or legal guidance). ' +
      'Establish a bias testing process: define fairness metrics for each AI use case and test quarterly. Deploy prompt injection defenses and output filtering for externally-facing AI systems. ' +
      'WHY: AI systems fail in non-obvious ways — bias, hallucination, and adversarial manipulation are invisible without active monitoring. ' +
      'RISK AVOIDED: Prevents AI-caused harm from reaching customers. Reduces liability exposure from discriminatory AI outputs. Protects brand reputation from high-profile AI failures.'
    );
  }

  if (questionId.startsWith('roi-')) {
    return (
      'Establish baseline measurements for your top 3 AI use cases: time saved per user per week, error rate reduction, and cost per active user (license cost ÷ monthly active users). ' +
      'Create a monthly reporting template to communicate AI ROI to leadership, even if data is incomplete at first — starting measurement is the critical step. ' +
      'WHY: Without baseline metrics, you cannot demonstrate AI value to leadership or justify continued investment. You also cannot identify underperforming tools worth cutting. ' +
      'RISK AVOIDED: Prevents AI budget waste on tools with low adoption. Builds the evidence base needed to defend or expand AI investment when leadership questions spending.'
    );
  }

  return `Address this ${getRiskLevel(score).toLowerCase()}-risk area within 30 days. Develop a remediation plan with clear ownership and timeline.`;
}

export function calculateAllScores(
  responses: QuestionResponse[],
  profile: Partial<OrganizationProfile>,
  questions: AssessmentQuestion[]
): {
  dimensionScores: DimensionScore[];
  riskScore: RiskScore;
  blindSpots: BlindSpot[];
} {
  const dimensionKeys: DimensionKey[] = [
    'shadowAI',
    'vendorRisk',
    'dataGovernance',
    'securityCompliance',
    'aiSpecificRisks',
    'roiTracking',
  ];

  const dimensionScores = dimensionKeys.map((key) => calculateDimensionScore(key, responses, questions));
  const riskScore = calculateOverallRisk(dimensionScores, profile);
  const blindSpots = identifyBlindSpots(dimensionScores, responses, questions);

  return { dimensionScores, riskScore, blindSpots };
}
