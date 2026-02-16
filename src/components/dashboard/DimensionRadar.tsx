import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { DimensionScore } from '@/types/assessment';
import { DIMENSION_MAP } from '@/data/dimensions';

interface DimensionRadarProps {
  dimensionScores: DimensionScore[];
}

export function DimensionRadar({ dimensionScores }: DimensionRadarProps) {
  const data = dimensionScores.map((ds) => ({
    dimension: DIMENSION_MAP[ds.key].shortLabel,
    risk: ds.score,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-6 text-center">
      <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-2">
        Risk by Dimension
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#d9e2ec" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 10, fill: '#627d98' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 8, fill: '#9fb3c8' }}
          />
          <Radar
            name="Risk"
            dataKey="risk"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <p className="text-xs text-navy-500 mt-1">
        Larger area = higher risk exposure
      </p>
    </div>
  );
}
