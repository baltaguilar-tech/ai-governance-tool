import { MaturityLevel } from '@/types/assessment';

interface AchieverProgressProps {
  score: number;
  currentMaturity: MaturityLevel;
  targetMaturity: MaturityLevel;
}

const MATURITY_ORDER: MaturityLevel[] = [
  MaturityLevel.Experimenter,
  MaturityLevel.Builder,
  MaturityLevel.Innovator,
  MaturityLevel.Achiever,
];

export function AchieverProgress({ score, currentMaturity, targetMaturity }: AchieverProgressProps) {
  const currentIdx = MATURITY_ORDER.indexOf(currentMaturity);
  const targetIdx = MATURITY_ORDER.indexOf(targetMaturity);

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 text-center">
      <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4">
        AI Achiever Progress
      </h3>

      {/* Score */}
      <div className="text-3xl font-bold text-navy-900 mb-1">{score}/100</div>
      <p className="text-xs text-navy-500 mb-4">Achiever readiness score</p>

      {/* Progress bar */}
      <div className="h-3 bg-navy-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-emerald-500"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Maturity stages */}
      <div className="flex justify-between text-xs">
        {MATURITY_ORDER.map((level, i) => {
          const isCurrent = i === currentIdx;
          const isTarget = i === targetIdx;
          return (
            <div key={level} className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  i <= currentIdx
                    ? 'bg-blue-500'
                    : i <= targetIdx
                    ? 'bg-blue-200'
                    : 'bg-navy-200'
                }`}
              />
              <span
                className={`${
                  isCurrent
                    ? 'text-blue-700 font-semibold'
                    : isTarget
                    ? 'text-emerald-600 font-medium'
                    : 'text-navy-400'
                }`}
              >
                {level}
              </span>
              {isCurrent && (
                <div className="text-[10px] text-blue-500">Current</div>
              )}
              {isTarget && !isCurrent && (
                <div className="text-[10px] text-emerald-500">Target</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-navy-500 mt-4">
        Only 12% of organizations reach Achiever status (30%+ AI-influenced revenue)
      </p>
    </div>
  );
}
