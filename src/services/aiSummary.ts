/**
 * aiSummary.ts
 *
 * AI-generated executive summary service.
 * Handles: McCormick maturity mapping, agent governance trigger,
 * prompt construction, Anthropic API call, and consent state.
 *
 * Citation policy: McCormick framework language informs prompt framing
 * only — never surfaced verbatim in product output.
 */

import { invoke } from '@tauri-apps/api/core';
import { Store } from '@tauri-apps/plugin-store';
import { MaturityLevel } from '@/types/assessment';
import type { OrganizationProfile, DimensionScore, BlindSpot } from '@/types/assessment';

// ─── Model IDs ────────────────────────────────────────────────────────────────

export const AI_MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
} as const;

export type AiModelKey = keyof typeof AI_MODELS;

// ─── McCormick 5-Level Maturity Mapping ──────────────────────────────────────
// Maps overall score (0–100) to McCormick's operational maturity levels.
// These levels inform the AI prompt framing — not surfaced verbatim in output.

export interface McCormickLevel {
  level: number;
  name: string;
  promptContext: string;
}

export function getMcCormickLevel(overallScore: number): McCormickLevel {
  if (overallScore <= 25) {
    return {
      level: 0,
      name: 'Ungoverned',
      promptContext:
        'The organization has no formal AI governance lifecycle, no behavioral monitoring, ' +
        'and no structured audit trail. Failures are discovered after impact, if at all. ' +
        'This organization likely cannot demonstrate AI governance to regulators or auditors.',
    };
  }
  if (overallScore <= 50) {
    return {
      level: 1,
      name: 'Reactive Governance',
      promptContext:
        'Basic governance structures exist — defined phases and human oversight at key decisions — ' +
        'but drift is detected only after impact through observation or post-incident review. ' +
        'The human operator is the sole detection mechanism. Failures are documented but ' +
        'prevention infrastructure is not yet in place.',
    };
  }
  if (overallScore <= 70) {
    return {
      level: 2,
      name: 'Structural Governance',
      promptContext:
        'Automated monitoring catches known failure modes at the point of action before impact. ' +
        'Independent validation functions operate alongside human oversight. Trust calibration ' +
        'is beginning to inform oversight levels. Novel failure modes still become incidents ' +
        'before detection.',
    };
  }
  if (overallScore <= 85) {
    return {
      level: 3,
      name: 'Predictive Governance',
      promptContext:
        'Trend analysis identifies drift trajectories before incidents occur. Fleet-level ' +
        'analytics assess governance posture across all AI systems and workstreams. ' +
        'Compliance reporting is structured for regulatory frameworks. The primary remaining ' +
        'gap is that governance parameters require manual adjustment.',
    };
  }
  return {
    level: 4,
    name: 'Adaptive Governance',
    promptContext:
      'Governance mechanisms adapt based on empirical data within operator-approved policies. ' +
      'The organization contributes to governance standard development. Governance operates ' +
      'as organizational infrastructure, not periodic oversight.',
  };
}

// ─── Agent Governance Trigger ─────────────────────────────────────────────────

const AGENT_GOVERNANCE_INDUSTRIES = new Set([
  'Healthcare',
  'Financial Services',
  'Technology',
  'Manufacturing',
]);

const AGENT_GOVERNANCE_TIERS = new Set<MaturityLevel>([
  MaturityLevel.Builder,
  MaturityLevel.Innovator,
  MaturityLevel.Achiever,
]);

export function shouldIncludeAgentGovernance(
  tier: MaturityLevel,
  industry: string | undefined
): boolean {
  if (!industry) return false;
  return AGENT_GOVERNANCE_TIERS.has(tier) && AGENT_GOVERNANCE_INDUSTRIES.has(industry);
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior AI governance advisor preparing a bespoke executive briefing for a senior leader. Your register is direct, authoritative, and specific — the standard of a trusted advisor, not a software product.

You will receive structured AI governance assessment data. Write exactly two sections:

OPENING: 2–4 sentences. A diagnostic synthesis that captures this specific organization's AI governance situation with precision. Do not open with "Your organization" or generic framing. Name the specific gaps, the specific industry context, the specific risk exposure. Make it feel like you studied their data, not a template.

CLOSING: 2–4 sentences. A path forward calibrated to their governance maturity level and specific gaps — concrete, correctly sequenced for an organization at this stage, and grounded in the data provided.

Separate the two sections with exactly this delimiter on its own line: ---

Format rules:
- Use **bold** only for the single most critical phrase in each section
- No bullet points, no headers, no markdown beyond bold
- No repetition of dimension scores or regulatory frameworks already in the structured report
- Do not mention "AlphaPi" or any tool name
- Write as if briefing the CEO directly`;

const DIMENSION_LABELS: Record<string, string> = {
  shadowAI: 'Shadow AI Control',
  vendorRisk: 'Vendor Risk Management',
  dataGovernance: 'Data Governance',
  securityCompliance: 'Security & Compliance',
  aiSpecificRisks: 'AI-Specific Risk Controls',
  roiTracking: 'ROI Accountability',
};

export interface AiSummaryPromptParams {
  profile: OrganizationProfile;
  overallScore: number;
  riskLevel: string;
  maturityTier: MaturityLevel;
  dimensionScores: DimensionScore[];
  blindSpots: BlindSpot[];
}

export function buildAiSummaryPrompt(params: AiSummaryPromptParams): string {
  const { profile, overallScore, riskLevel, maturityTier, dimensionScores, blindSpots } = params;
  const mcCormick = getMcCormickLevel(overallScore);
  const includeAgentGovernance = shouldIncludeAgentGovernance(maturityTier, profile.industry);

  const orgName = profile.organizationName || 'This organization';
  const industry = profile.industry || 'unspecified industry';
  const size = profile.size || 'unspecified size';
  const regions = (profile.operatingRegions ?? []).join(', ') || 'unspecified regions';

  const dimLines = dimensionScores
    .filter((d) => d.answered)
    .sort((a, b) => a.score - b.score)
    .map((d) => `  ${DIMENSION_LABELS[d.key] ?? d.key}: ${Math.round(d.score)}/100 (${d.riskLevel})`)
    .join('\n');

  // Bottom-quartile blind spots — worst 5 by score, with descriptive context
  const worstSpots = [...blindSpots]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const blindSpotLines = worstSpots
    .map(
      (b) =>
        `  [${DIMENSION_LABELS[b.dimension] ?? b.dimension}] ${b.title}\n` +
        `    Context: ${b.description}\n` +
        `    Required action: ${b.immediateAction}`
    )
    .join('\n\n');

  let prompt =
    `ORGANIZATION\n` +
    `  Name: ${orgName}\n` +
    `  Industry: ${industry}\n` +
    `  Size: ${size}\n` +
    `  Operating regions: ${regions}\n` +
    `  Profile tier: ${maturityTier}\n`;

  if (profile.expectedAISpend) {
    prompt += `  Declared AI investment: ${profile.expectedAISpend}\n`;
  }

  prompt +=
    `\nASSESSMENT RESULTS\n` +
    `  Overall score: ${overallScore}/100 — ${riskLevel} risk\n` +
    `  Governance maturity: ${maturityTier} tier / Operational level: ${mcCormick.name} (Level ${mcCormick.level})\n` +
    `  Maturity context: ${mcCormick.promptContext}\n` +
    `\nDIMENSION SCORES (worst to best)\n${dimLines}\n`;

  if (worstSpots.length > 0) {
    prompt +=
      `\nCRITICAL GOVERNANCE GAPS (bottom-quartile responses — most specific data available)\n` +
      blindSpotLines + `\n`;
  }

  if (includeAgentGovernance) {
    prompt +=
      `\nAGENT GOVERNANCE CONTEXT\n` +
      `  This organization operates in ${industry} at the ${maturityTier} tier, where AI agents ` +
      `(autonomous systems acting under delegated authority) are active or imminent. ` +
      `The governance gap most relevant to this profile: organizations at this tier typically ` +
      `have observability and security controls in place but lack a structured governance ` +
      `lifecycle for agent work — meaning failures pass all checks, look correct in logs, ` +
      `and only surface after impact. The closing section should acknowledge this specifically.\n`;
  }

  return prompt;
}

// ─── Anthropic API Call ───────────────────────────────────────────────────────

export interface AiSummaryResult {
  opening: string;
  closing: string;
  rawText: string;
  model: string;
}

export async function callAnthropicApi(
  apiKey: string,
  modelKey: AiModelKey,
  userPrompt: string
): Promise<AiSummaryResult> {
  const modelId = AI_MODELS[modelKey];

  // Use native Rust command to bypass CORS and header-stripping issues
  // with the Tauri HTTP plugin's JS bridge.
  const responseText = await invoke<string>('call_anthropic', {
    apiKey,
    model: modelId,
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 600,
  });

  const data = JSON.parse(responseText) as {
    content: Array<{ type: string; text: string }>;
    model: string;
  };

  const rawText = data.content.find((c) => c.type === 'text')?.text ?? '';
  const parts = rawText.split(/^---$/m).map((s) => s.trim());

  return {
    opening: parts[0] ?? rawText,
    closing: parts[1] ?? '',
    rawText,
    model: modelId,
  };
}

// ─── Consent Helpers ──────────────────────────────────────────────────────────

const CONSENT_KEY = 'aiSummaryConsent';

export async function getAiSummaryConsent(): Promise<boolean> {
  try {
    const store = await Store.load('settings.json');
    const value = await store.get<boolean>(CONSENT_KEY);
    return value === true;
  } catch {
    return false;
  }
}

export async function setAiSummaryConsent(): Promise<void> {
  try {
    const store = await Store.load('settings.json');
    await store.set(CONSENT_KEY, true);
    await store.save();
  } catch {
    // non-fatal — user will be asked again next session
  }
}

// ─── API Key Loader ───────────────────────────────────────────────────────────

export async function loadAnthropicApiKey(): Promise<string> {
  try {
    const store = await Store.load('settings.json');
    return (await store.get<string>('anthropicApiKey')) ?? '';
  } catch {
    return '';
  }
}
