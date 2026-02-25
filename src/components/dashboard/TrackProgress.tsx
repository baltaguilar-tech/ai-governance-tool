import type { DimensionScore } from '@/types/assessment';

interface Props {
  assessmentId: number;
  currentScore: number;
  dimensionScores: DimensionScore[];
}

// Full implementation written by subagent in Steps 3c–3e
export function TrackProgress({ assessmentId, currentScore, dimensionScores }: Props) {
  void assessmentId; void currentScore; void dimensionScores;
  return (
    <div className="py-8 text-center text-navy-400 text-sm">
      Loading Track Progress…
    </div>
  );
}
