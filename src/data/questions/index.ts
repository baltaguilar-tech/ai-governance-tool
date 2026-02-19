// =============================================================================
// AI Governance & ROI Assessment Tool — Question Bank Index
// =============================================================================
//
// Single entry point for all question banks. Import from this file, not from
// the individual profile files directly.
//
// Architecture: split by org profile to keep each file ~400-800 lines and
// prevent context overflow during development. Each profile file is independent.
// =============================================================================

import { AssessmentQuestion, MaturityLevel, Region } from '@/types/assessment';

export { EXPERIMENTER_QUESTIONS } from './experimenter-questions';
export { BUILDER_QUESTIONS } from './builder-questions';
export { INNOVATOR_QUESTIONS } from './innovator-questions';
export { ACHIEVER_QUESTIONS } from './achiever-questions';

import { EXPERIMENTER_QUESTIONS } from './experimenter-questions';
import { BUILDER_QUESTIONS } from './builder-questions';
import { INNOVATOR_QUESTIONS } from './innovator-questions';
import { ACHIEVER_QUESTIONS } from './achiever-questions';

// Maps Region enum values to jurisdiction codes used on questions.
// Region.Europe maps to both 'eu' and 'uk' since the enum has no UK entry
// and UK-specific regulatory questions (UK GDPR, UK AI governance) apply.
const REGION_TO_JURISDICTION: Partial<Record<Region, string[]>> = {
  [Region.NorthAmerica]: ['us'],
  [Region.Europe]: ['eu', 'uk'],
  [Region.AsiaPacific]: ['ap'],
  [Region.MiddleEast]: ['mea'],
  [Region.LatinAmerica]: ['latam'],
};

// =============================================================================
// QUESTION SELECTOR
// Returns the appropriate question bank for the org's maturity level,
// filtered to include only questions applicable to the org's regions (union).
// =============================================================================
export function getQuestionsForProfile(
  maturityLevel: MaturityLevel,
  operatingRegions: Region[]
): AssessmentQuestion[] {
  const bankMap: Record<MaturityLevel, AssessmentQuestion[]> = {
    [MaturityLevel.Experimenter]: EXPERIMENTER_QUESTIONS,
    [MaturityLevel.Builder]: BUILDER_QUESTIONS,
    [MaturityLevel.Innovator]: INNOVATOR_QUESTIONS,
    [MaturityLevel.Achiever]: ACHIEVER_QUESTIONS,
  };

  const bank = bankMap[maturityLevel] ?? EXPERIMENTER_QUESTIONS;

  // Build the set of active jurisdiction codes for this org
  const activeJurisdictions = new Set<string>(['all']);
  for (const region of operatingRegions) {
    const codes = REGION_TO_JURISDICTION[region];
    if (codes) codes.forEach((c) => activeJurisdictions.add(c));
  }

  // Include a question if it has no jurisdiction filter, or if at least one
  // of its jurisdictions matches the org's active jurisdictions (union rule)
  return bank.filter((q) => {
    if (!q.jurisdictions || q.jurisdictions.length === 0) return true;
    return q.jurisdictions.some((j) => activeJurisdictions.has(j));
  });
}
