import { DimensionConfig, DimensionKey } from '@/types/assessment';

export const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'shadowAI',
    label: 'AI Visibility & Sprawl Control',
    shortLabel: 'Shadow AI',
    weight: 0.25,
    description:
      'Measures your ability to detect, inventory, and control AI tools across the organization. Shadow AI is the #1 governance failure — you cannot govern what you cannot see.',
    icon: 'Eye',
  },
  {
    key: 'vendorRisk',
    label: 'Vendor AI Risk Management',
    shortLabel: 'Vendor Risk',
    weight: 0.25,
    description:
      'Evaluates how well you assess and monitor third-party AI vendors. 92% of organizations trust AI vendors but cannot verify how vendors use their data.',
    icon: 'ShieldCheck',
  },
  {
    key: 'dataGovernance',
    label: 'Data Governance & Privacy',
    shortLabel: 'Data Gov.',
    weight: 0.2,
    description:
      'Assesses data classification, lineage, training data governance, and privacy controls for AI systems.',
    icon: 'Database',
  },
  {
    key: 'securityCompliance',
    label: 'Security & Compliance',
    shortLabel: 'Security',
    weight: 0.15,
    description:
      'Reviews certifications, encryption standards, incident response, and regulatory compliance posture.',
    icon: 'Lock',
  },
  {
    key: 'aiSpecificRisks',
    label: 'AI-Specific Risks',
    shortLabel: 'AI Risks',
    weight: 0.1,
    description:
      'Evaluates controls for hallucinations, model drift, adversarial attacks, and agentic AI governance.',
    icon: 'AlertTriangle',
  },
  {
    key: 'roiTracking',
    label: 'ROI & Performance Tracking',
    shortLabel: 'ROI',
    weight: 0.05,
    description:
      'Measures ability to track multi-dimensional ROI beyond cost reduction — including innovation, customer, and strategic value.',
    icon: 'TrendingUp',
  },
];

export const DIMENSION_MAP: Record<DimensionKey, DimensionConfig> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d])
) as Record<DimensionKey, DimensionConfig>;

export const WIZARD_STEPS = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'profile', label: 'Organization Profile' },
  ...DIMENSIONS.map((d) => ({ key: d.key, label: d.shortLabel })),
  { key: 'results', label: 'Results' },
] as const;
