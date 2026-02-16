import { RiskLevel } from '@/types/assessment';
import { getRiskColor } from '@/utils/scoring';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const color = getRiskColor(level);
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 text-center">
      <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4">
        Overall Risk Score
      </h3>

      {/* Gauge */}
      <div className="relative w-40 h-20 mx-auto mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Green zone */}
          <path
            d="M 10 100 A 90 90 0 0 1 46 28"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Amber zone */}
          <path
            d="M 46 28 A 90 90 0 0 1 100 10"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
            opacity="0.3"
          />
          {/* Orange zone */}
          <path
            d="M 100 10 A 90 90 0 0 1 154 28"
            fill="none"
            stroke="#f97316"
            strokeWidth="16"
            opacity="0.3"
          />
          {/* Red zone */}
          <path
            d="M 154 28 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="25"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation}, 100, 100)`}
          />
          <circle cx="100" cy="100" r="6" fill={color} />
        </svg>
      </div>

      <div className="text-3xl font-bold" style={{ color }}>
        {score}
      </div>
      <div
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${
          level === RiskLevel.Low
            ? 'bg-emerald-100 text-emerald-700'
            : level === RiskLevel.Medium
            ? 'bg-amber-100 text-amber-700'
            : level === RiskLevel.High
            ? 'bg-orange-100 text-orange-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {level} RISK
      </div>
      <p className="text-xs text-navy-500 mt-2">Lower is better (0-100 scale)</p>
    </div>
  );
}
