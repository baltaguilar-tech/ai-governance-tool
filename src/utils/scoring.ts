import {
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
import { ASSESSMENT_QUESTIONS } from '@/data/questions';

// Dimension weights from the spec
const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  shadowAI: 0.25,
  vendorRisk: 0.25,
  dataGovernance: 0.2,
  securityCompliance: 0.15,
  aiSpecificRisks: 0.1,
  roiTracking: 0.05,
};

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return RiskLevel.Low;
  if (score <= 60) return RiskLevel.Medium;
  if (score <= 80) return RiskLevel.High;
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
  responses: QuestionResponse[]
): DimensionScore {
  const dimensionQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dimension);
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

  const averageScore = answeredCount > 0 ? totalScore / answeredCount : 100;

  return {
    key: dimension,
    score: Math.round(averageScore),
    riskLevel: getRiskLevel(averageScore),
    questionScores,
  };
}

export function calculateOverallRisk(
  dimensionScores: DimensionScore[],
  profile: Partial<OrganizationProfile>
): RiskScore {
  const dimensions = {} as Record<DimensionKey, number>;
  let overallRisk = 0;

  for (const ds of dimensionScores) {
    dimensions[ds.key] = ds.score;
    overallRisk += ds.score * DIMENSION_WEIGHTS[ds.key];
  }

  overallRisk = Math.round(overallRisk);
  const riskLevel = getRiskLevel(overallRisk);

  // Calculate AI Achiever score (inverse of risk)
  const maturityBonus = getMaturityBonus(profile.aiMaturityLevel);
  const achieverScore = Math.min(100, Math.max(0, 100 - overallRisk + maturityBonus));

  const currentMaturity = profile.aiMaturityLevel || MaturityLevel.Experimenter;
  const targetMaturity = determineTargetMaturity(achieverScore);
  const maturityGap = identifyMaturityGaps(dimensionScores, currentMaturity);

  return {
    dimensions,
    overallRisk,
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
    if (ds.score > 60) {
      const config = DIMENSION_MAP[ds.key];
      gaps.push(`${config.label} risk is ${ds.riskLevel.toLowerCase()} (score: ${ds.score})`);
    }
  }

  if (currentMaturity === MaturityLevel.Experimenter) {
    gaps.push('No formal AI governance framework in place');
  }

  return gaps;
}

export function identifyBlindSpots(
  _dimensionScores: DimensionScore[],
  responses: QuestionResponse[]
): BlindSpot[] {
  const blindSpots: BlindSpot[] = [];

  // Find the highest-risk individual questions
  const scoredQuestions = responses
    .map((r) => {
      const question = ASSESSMENT_QUESTIONS.find((q) => q.id === r.questionId);
      return question ? { question, score: r.value } : null;
    })
    .filter((sq): sq is NonNullable<typeof sq> => sq !== null)
    .sort((a, b) => b.score - a.score);

  // Top blind spots from highest-scoring (worst) questions
  for (const sq of scoredQuestions.slice(0, 10)) {
    if (sq.score >= 60) {
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

function getImmediateAction(questionId: string, score: number): string {
  const actions: Record<string, string> = {
    'shadow-1': 'Deploy automated shadow AI detection tools (e.g., Reco.ai, Vanta SSPM) within 2 weeks.',
    'shadow-2': 'Conduct a comprehensive AI inventory audit. Survey all departments and scan networks for AI tool usage.',
    'shadow-3': 'Launch an immediate shadow AI audit. Survey employees about unauthorized AI tool usage.',
    'shadow-4': 'Map all SaaS-to-SaaS AI integrations. Document data flow paths between connected applications.',
    'shadow-5': 'Draft and publish an AI Acceptable Use Policy. Require employee acknowledgment within 30 days.',
    'shadow-9': 'Establish an AI kill switch procedure. Define who can shut down AI systems and under what circumstances.',
    'vendor-1': 'Begin vendor AI risk assessments for your top 10 critical vendors immediately.',
    'vendor-2': 'Schedule meetings with top vendors to clarify data ownership. Update contracts with AI-specific clauses.',
    'vendor-5': 'Contact all AI vendors and ask: "Do you train models on our data?" Document the answers.',
    'data-1': 'Implement data classification policy that addresses AI data handling requirements.',
    'data-3': 'Deploy data loss prevention (DLP) for AI tools. Block sensitive data from being pasted into public AI services.',
    'security-3': 'Create an AI-specific incident response plan. Include scenarios for hallucinations, data breaches, and model failures.',
    'security-9': 'Form an AI Governance Committee with cross-functional representation. Secure CEO sponsorship.',
    'airisk-1': 'Implement a validation layer for AI outputs before they reach customers or inform business decisions.',
    'airisk-3': 'Deploy prompt injection defenses including input sanitization and output filtering.',
  };

  return actions[questionId] || `Address this ${getRiskLevel(score).toLowerCase()}-risk area within 30 days. Develop a remediation plan with clear ownership and timeline.`;
}

export function calculateAllScores(
  responses: QuestionResponse[],
  profile: Partial<OrganizationProfile>
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

  const dimensionScores = dimensionKeys.map((key) => calculateDimensionScore(key, responses));
  const riskScore = calculateOverallRisk(dimensionScores, profile);
  const blindSpots = identifyBlindSpots(dimensionScores, responses);

  return { dimensionScores, riskScore, blindSpots };
}
