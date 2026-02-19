import { MaturityLevel } from '@/types/assessment';

interface AchieverProgressProps {
  score: number;
  currentMaturity: MaturityLevel;
  targetMaturity: MaturityLevel;
}

const MATURITY_STAGES: { level: MaturityLevel; short: string }[] = [
  { level: MaturityLevel.Experimenter, short: 'Explore' },
  { level: MaturityLevel.Builder, short: 'Build' },
  { level: MaturityLevel.Innovator, short: 'Innovate' },
  { level: MaturityLevel.Achiever, short: 'Achieve' },
];

export function AchieverProgress({ score, currentMaturity, targetMaturity }: AchieverProgressProps) {
  const currentIdx = MATURITY_STAGES.findIndex((s) => s.level === currentMaturity);
  const targetIdx = MATURITY_STAGES.findIndex((s) => s.level === targetMaturity);

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 text-center">
      <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4">
        AI Achiever Progress
      </h3>

      {/* Score */}
      <div className="text-3xl font-bold text-navy-900 mb-1">{score}/100</div>
      <p className="text-xs text-navy-500 mb-4">Achiever readiness score</p>

      {/* Progress bar with stage markers */}
      <div className="relative mb-8">
        <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-emerald-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Stage dots and labels positioned along the bar */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1">
          {MATURITY_STAGES.map((stage, i) => {
            const isCurrent = i === currentIdx;
            const isTarget = i === targetIdx && i !== currentIdx;
            return (
              <div key={stage.level} className="flex flex-col items-center" style={{ width: '25%' }}>
                <div
                  className={`w-3 h-3 rounded-full -mt-[21px] mb-1 border-2 border-white ${
                    i <= currentIdx
                      ? 'bg-blue-500'
                      : i <= targetIdx
                      ? 'bg-blue-200'
                      : 'bg-navy-200'
                  }`}
                />
                <span
                  className={`text-[10px] leading-tight ${
                    isCurrent
                      ? 'text-blue-700 font-bold'
                      : isTarget
                      ? 'text-emerald-600 font-semibold'
                      : 'text-navy-400 font-medium'
                  }`}
                >
                  {stage.short}
                </span>
                {isCurrent && (
                  <span className="text-[9px] text-blue-500 font-medium">Current</span>
                )}
                {isTarget && (
                  <span className="text-[9px] text-emerald-500 font-medium">Target</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-navy-500 mt-4">
        Only 12% of organizations reach Achiever status (30%+ AI-influenced revenue)
      </p>
    </div>
  );
}
