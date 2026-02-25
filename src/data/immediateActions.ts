// Per-question immediate actions — 240 entries covering all 4 maturity profiles.
// getImmediateAction() in scoring.ts looks up this map first (exact question ID),
// then falls back to dimension-level text for any missing entries.

import { experimenterActions } from './questions/experimenter-actions';
import { builderActions } from './questions/builder-actions';
import { innovatorActions } from './questions/innovator-actions';
import { achieverActions } from './questions/achiever-actions';

export const immediateActions: Record<string, string> = {
  ...experimenterActions,
  ...builderActions,
  ...innovatorActions,
  ...achieverActions,
};
