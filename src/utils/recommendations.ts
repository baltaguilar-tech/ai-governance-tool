import {
  DimensionScore,
  RiskScore,
  OrganizationProfile,
  Recommendation,
  LicenseTier,
  Industry,
  Region,
} from '@/types/assessment';

export function generateRecommendations(
  dimensionScores: DimensionScore[],
  _riskScore: RiskScore,
  profile: OrganizationProfile,
  _licenseTier: LicenseTier
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const dimMap = Object.fromEntries(dimensionScores.map((d) => [d.key, d]));

  // --- CRITICAL: Always included (free tier) ---
  // Note: scores are now 0-100 where higher = better governance
  // So low scores indicate problems

  // Shadow AI recommendations
  if (dimMap.shadowAI?.score < 40) {
    recommendations.push({
      category: 'audit',
      title: 'Deploy Shadow AI Detection Immediately',
      description:
        'Your organization has critical blind spots in AI visibility. Deploy automated shadow AI detection tools to identify unauthorized AI applications. Research shows employees average 3-5 AI tools each, and the majority are adopted without IT approval.',
      priority: 'critical',
      timeline: 'this-week',
      isPaid: false,
    });
  }

  if (dimMap.shadowAI?.score < 60) {
    recommendations.push({
      category: 'audit',
      title: 'Conduct Comprehensive AI Inventory',
      description:
        'Create a centralized registry of all AI tools, platforms, and integrations. Survey all departments and scan networks. You cannot govern what you cannot see.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: false,
    });
  }

  // Vendor risk recommendations
  if (dimMap.vendorRisk?.score < 40) {
    recommendations.push({
      category: 'vendor',
      title: 'Urgent: Assess Top 10 Critical AI Vendors',
      description:
        'Conduct AI risk assessments for your most critical vendors. Start with the question: "How do you define what\'s yours versus mine?" 92% of organizations trust vendors but cannot verify their data practices.',
      priority: 'critical',
      timeline: 'this-week',
      isPaid: false,
    });
  }

  if (dimMap.vendorRisk?.score < 60) {
    recommendations.push({
      category: 'vendor',
      title: 'Establish Quarterly Vendor Review Process',
      description:
        'Implement quarterly reviews for all AI vendors to detect scope creep, new AI features, and changes in data practices. The "routine renewal trap" silently expands your risk profile.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: false,
    });
  }

  // Governance committee
  if (dimMap.securityCompliance?.score < 50) {
    recommendations.push({
      category: 'roadmap',
      title: 'Form AI Governance Committee',
      description:
        'Establish a cross-functional AI Governance Committee with CEO sponsorship. Include IT Security, Legal, Compliance, Data Governance, and Business Unit leaders. This is the foundation of effective governance.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: false,
    });
  }

  // AI Acceptable Use Policy
  if (dimMap.shadowAI?.score < 70) {
    recommendations.push({
      category: 'compliance',
      title: 'Develop AI Acceptable Use Policy',
      description:
        'Create and distribute an AI Acceptable Use Policy. Only 18.5% of employees are aware of any company AI policy. Require employee acknowledgment.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: false,
    });
  }

  // Incident response
  if (dimMap.securityCompliance?.score < 50) {
    recommendations.push({
      category: 'monitoring',
      title: 'Create AI Incident Response Plan',
      description:
        'Develop an AI-specific incident response plan covering hallucinations, data breaches, model failures, and autonomous agent malfunctions. Standard IR plans miss these scenarios.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: false,
    });
  }

  // --- PAID TIER RECOMMENDATIONS ---

  // Industry-specific vendor questionnaire
  recommendations.push({
    category: 'vendor',
    title: 'Customized Vendor Assessment Questionnaire',
    description: getIndustryVendorDescription(profile.industry),
    priority: 'high',
    timeline: 'this-month',
    isPaid: true,
  });

  // Regulatory compliance
  const regulatoryRecs = getRegulatorRecommendations(profile);
  recommendations.push(...regulatoryRecs);

  // ROI framework
  if (dimMap.roiTracking?.score < 70) {
    recommendations.push({
      category: 'roi',
      title: 'Multi-Dimensional ROI Framework',
      description:
        'Implement a comprehensive ROI tracking framework measuring Financial, Operational, Innovation, Customer, and Strategic value — including hidden costs (data prep, maintenance, talent premium).',
      priority: 'medium',
      timeline: 'this-quarter',
      isPaid: true,
    });
  }

  // Implementation roadmap
  recommendations.push({
    category: 'roadmap',
    title: 'Detailed Implementation Roadmap',
    description:
      'A week-by-week action plan prioritized by your specific risk profile, including task owners, milestones, and success criteria.',
    priority: 'medium',
    timeline: 'this-quarter',
    isPaid: true,
  });

  // ISO 42001
  if (dimMap.securityCompliance?.score < 70) {
    recommendations.push({
      category: 'compliance',
      title: 'ISO 42001 Gap Assessment & Certification Roadmap',
      description:
        'ISO 42001 is becoming enterprise-expected in 2026. Get a gap assessment showing what you need to achieve certification and a phased implementation plan.',
      priority: 'medium',
      timeline: 'this-quarter',
      isPaid: true,
    });
  }

  // Monitoring strategies
  recommendations.push({
    category: 'monitoring',
    title: 'Continuous AI Monitoring Strategy',
    description:
      'Comprehensive monitoring strategy including quarterly vendor reviews, monthly AI sprawl scans, real-time performance dashboards, and annual AI-specific penetration testing.',
    priority: 'medium',
    timeline: 'this-quarter',
    isPaid: true,
  });

  // Data governance
  if (dimMap.dataGovernance?.score < 50) {
    recommendations.push({
      category: 'audit',
      title: 'AI Data Governance Framework',
      description:
        'Comprehensive data governance framework for AI including classification, lineage, DLP, consent management, and retention policies.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: true,
    });
  }

  // AI-specific risk mitigations
  if (dimMap.aiSpecificRisks?.score < 50) {
    recommendations.push({
      category: 'monitoring',
      title: 'AI Risk Mitigation Playbook',
      description:
        'Detailed playbook for mitigating AI-specific risks: hallucination validation, model drift detection, prompt injection defense, agentic AI governance, and bias testing.',
      priority: 'high',
      timeline: 'this-month',
      isPaid: true,
    });
  }

  return recommendations;
}

function getIndustryVendorDescription(industry?: Industry): string {
  const base = 'Full 30-question vendor assessment questionnaire customized to your industry';
  switch (industry) {
    case Industry.Healthcare:
      return `${base}. Includes HIPAA compliance questions, PHI handling, clinical decision support validation, and FDA requirements.`;
    case Industry.Finance:
      return `${base}. Includes SOC 2 Type II requirements, PCI DSS, FFIEC guidance, algorithmic trading controls, and credit scoring fairness.`;
    case Industry.Government:
      return `${base}. Includes FedRAMP requirements, NIST AI RMF alignment, Executive Order compliance, and public sector-specific data handling.`;
    case Industry.Education:
      return `${base}. Includes FERPA compliance, student data protection, age-appropriate AI use, and algorithmic fairness in educational outcomes.`;
    case Industry.Legal:
      return `${base}. Includes attorney-client privilege protection, hallucination risk for legal citations, court filing accuracy, and confidentiality controls.`;
    default:
      return `${base}. Covers data ownership, model training, security certifications, incident response, and AI-specific contract clauses.`;
  }
}

function getRegulatorRecommendations(profile: OrganizationProfile): Recommendation[] {
  const recs: Recommendation[] = [];
  const regions = profile.operatingRegions || [];

  if (regions.includes(Region.Europe)) {
    recs.push({
      category: 'compliance',
      title: 'EU AI Act Compliance Roadmap',
      description:
        'August 2, 2026 enforcement deadline. Penalties up to €35M or 7% worldwide turnover. Get a risk classification of your AI systems and compliance timeline.',
      priority: 'critical',
      timeline: 'this-month',
      isPaid: true,
    });
  }

  if (regions.includes(Region.NorthAmerica)) {
    recs.push({
      category: 'compliance',
      title: 'US AI Regulatory Compliance Review',
      description:
        'Review compliance with NIST AI RMF, state-level AI regulations (Colorado, Illinois), and sector-specific requirements (HIPAA, FFIEC, FTC guidance).',
      priority: 'medium',
      timeline: 'this-quarter',
      isPaid: true,
    });
  }

  if (regions.includes(Region.AsiaPacific)) {
    recs.push({
      category: 'compliance',
      title: 'Asia-Pacific AI Regulation Review',
      description:
        'Review compliance with Singapore AI Governance Framework, China CSL requirements, Australia Privacy Act updates, and Japan AI guidelines.',
      priority: 'medium',
      timeline: 'this-quarter',
      isPaid: true,
    });
  }

  return recs;
}
