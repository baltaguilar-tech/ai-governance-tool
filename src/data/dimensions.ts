import { DimensionConfig, DimensionKey } from '@/types/assessment';

// ── Dimension Weight Rationale ────────────────────────────────────────────────
//
// Weights reflect the relative impact of each governance failure mode on an
// organization's overall AI risk posture, based on empirical incident data and
// regulatory enforcement priorities. They are product decisions, not arbitrary.
//
// Shadow AI (25%) — The #1 governance failure mode. You cannot govern what you
//   cannot see. 1,200+ unauthorized AI apps average per enterprise (Netskope 2024).
//   86% of organizations are blind to their AI data flows. Ungoverned tools are
//   the primary vector for data leakage, compliance violations, and reputational harm.
//
// Vendor Risk (25%) — 92% of AI risk is inherited through third-party vendors.
//   Most vendor contracts predate the AI era; no data ownership, no training opt-out,
//   no audit rights. EU AI Act assigns direct liability to deployers for vendor AI
//   failures — vendor oversight is no longer optional.
//
// Data Governance (20%) — The foundation all other AI controls rest on. Poor data
//   classification, consent gaps, and missing DLP controls are cited in 77% of
//   AI-related regulatory enforcement actions. Without data governance, bias
//   controls and security controls fail regardless of intent.
//
// Security & Compliance (15%) — Important but partially covered by existing
//   infosec programs in most orgs. AI-specific gaps (incident response for
//   hallucinations, AI supply chain attacks, model poisoning) are the incremental
//   risk above baseline. Lower weight reflects that security baselines are more
//   mature than AI-specific governance across the target market.
//
// AI-Specific Risks (10%) — Bias, hallucinations, model drift, adversarial
//   attacks, and agentic AI governance. Real and growing, but often not the first
//   governance failure an org encounters. Given lower weight because most mid-market
//   orgs face Shadow AI and Vendor Risk failures long before reaching the
//   sophistication level where AI-specific risk controls matter most.
//
// ROI Tracking (5%) — Governance maturity indicator, not a direct risk factor.
//   Organizations that measure AI ROI rigorously tend to govern AI better (investment
//   discipline correlates with control discipline). Small weight reflects that ROI
//   tracking is a hygiene metric, not a primary risk control.
//
// Note: These weights are reviewed at each major product version. EU AI Act
// enforcement (Aug 2026) and ISO 42001 adoption may justify rebalancing toward
// Security & Compliance in future releases.
// ─────────────────────────────────────────────────────────────────────────────

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
