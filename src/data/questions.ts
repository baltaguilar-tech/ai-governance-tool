import { AssessmentQuestion } from '@/types/assessment';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // =============================================
  // DIMENSION 1: Shadow AI & Visibility (10 Qs)
  // =============================================
  {
    id: 'shadow-1',
    dimension: 'shadowAI',
    text: 'Does your organization have automated shadow AI detection tools deployed?',
    helpText:
      'Shadow AI detection tools automatically discover unauthorized AI applications used by employees. Examples include Reco.ai, Vanta SSPM, and custom network monitoring solutions.',
    type: 'radio',
    options: [
      { label: 'No detection capability', value: 100 },
      { label: 'Manual/ad-hoc surveys only', value: 75 },
      { label: 'Semi-automated detection', value: 50 },
      { label: 'Fully automated real-time detection', value: 0 },
    ],
  },
  {
    id: 'shadow-2',
    dimension: 'shadowAI',
    text: 'What percentage of AI tools in your organization are in a centralized inventory?',
    helpText:
      'A centralized AI inventory tracks all AI tools, platforms, and integrations in use. This is the foundation of AI governance.',
    type: 'radio',
    options: [
      { label: '0-20% (minimal awareness)', value: 100 },
      { label: '21-50% (partial inventory)', value: 75 },
      { label: '51-80% (substantial inventory)', value: 50 },
      { label: '81-100% (comprehensive inventory)', value: 0 },
    ],
  },
  {
    id: 'shadow-3',
    dimension: 'shadowAI',
    text: 'Have you identified unauthorized AI applications used by employees?',
    helpText:
      'Over 50% of U.S. workers use GenAI at work without IT approval. Identifying these tools is the first step to governance.',
    type: 'radio',
    options: [
      { label: "No / Don't know", value: 100 },
      { label: 'Yes, fewer than 10 identified', value: 50 },
      { label: 'Yes, 10+ identified but not remediated', value: 75 },
      { label: 'Yes, identified and remediated', value: 25 },
    ],
  },
  {
    id: 'shadow-4',
    dimension: 'shadowAI',
    text: 'Do you have SaaS-to-SaaS AI exposure mapping?',
    helpText:
      'AI integrations bridge multiple applications, creating cascading risk. A low-trust AI app connected to Slack can access Google Workspace, then Salesforce with full PII access.',
    type: 'radio',
    options: [
      { label: 'No mapping exists', value: 100 },
      { label: 'Partial mapping of known integrations', value: 60 },
      { label: 'Comprehensive manual mapping', value: 20 },
      { label: 'Automated continuous mapping', value: 0 },
    ],
  },
  {
    id: 'shadow-5',
    dimension: 'shadowAI',
    text: 'Do you have an AI Acceptable Use Policy that employees must acknowledge?',
    helpText:
      'Only 18.5% of employees are aware of any company AI policy, despite 60% using AI tools regularly.',
    type: 'radio',
    options: [
      { label: 'No policy exists', value: 100 },
      { label: 'Informal guidelines only', value: 75 },
      { label: 'Formal policy, not enforced', value: 50 },
      { label: 'Formal policy, acknowledged and enforced', value: 0 },
    ],
  },
  {
    id: 'shadow-6',
    dimension: 'shadowAI',
    text: 'How do employees currently request approval for new AI tools?',
    helpText:
      'A formal approval process prevents unauthorized tool adoption. The average enterprise hosts 1,200+ unauthorized AI applications.',
    type: 'radio',
    options: [
      { label: 'No approval process exists', value: 100 },
      { label: 'Ad-hoc email/Slack requests', value: 75 },
      { label: 'Formal request form with manual review', value: 25 },
      { label: 'Automated portal with risk-based routing', value: 0 },
    ],
  },
  {
    id: 'shadow-7',
    dimension: 'shadowAI',
    text: 'Do you monitor which employees access AI tools via personal accounts?',
    helpText:
      '47% of GenAI users still access tools via personal accounts in 2026, creating data leakage risks outside organizational control.',
    type: 'radio',
    options: [
      { label: 'No monitoring', value: 100 },
      { label: 'Rely on policy/trust only', value: 75 },
      { label: 'Network-level monitoring (partial)', value: 50 },
      { label: 'Endpoint + network monitoring with alerts', value: 0 },
    ],
  },
  {
    id: 'shadow-8',
    dimension: 'shadowAI',
    text: 'When existing SaaS vendors add new AI features, how do you become aware?',
    helpText:
      'Vendors like Zoom, Slack, Salesforce, and Microsoft are embedding AI into existing platforms, often with default settings that prioritize functionality over security.',
    type: 'radio',
    options: [
      { label: 'We usually discover them accidentally', value: 100 },
      { label: 'We check at contract renewal', value: 75 },
      { label: 'Vendors notify us (informal)', value: 50 },
      { label: 'Contractually required notification + review', value: 0 },
    ],
  },
  {
    id: 'shadow-9',
    dimension: 'shadowAI',
    text: 'Do you have an AI kill switch for emergency shutdown of AI systems?',
    helpText:
      'An AI kill switch allows rapid deactivation of AI tools if a security incident, hallucination causing harm, or compliance violation is detected.',
    type: 'radio',
    options: [
      { label: 'No kill switch capability', value: 100 },
      { label: 'Manual process (contact vendor, revoke access)', value: 75 },
      { label: 'Documented process with assigned owners', value: 25 },
      { label: 'Automated kill switch with testing protocol', value: 0 },
    ],
  },
  {
    id: 'shadow-10',
    dimension: 'shadowAI',
    text: 'Have you conducted an AI literacy training program for all employees?',
    helpText:
      'Only 23% of organizations require staff training on approved AI usage. Training reduces shadow AI adoption by increasing awareness of approved tools and risks.',
    type: 'radio',
    options: [
      { label: 'No training program', value: 100 },
      { label: 'Optional/informal training', value: 75 },
      { label: 'Mandatory for IT/tech staff only', value: 50 },
      { label: 'Mandatory enterprise-wide with assessments', value: 0 },
    ],
  },

  // =============================================
  // DIMENSION 2: Vendor AI Risk (10 Qs)
  // =============================================
  {
    id: 'vendor-1',
    dimension: 'vendorRisk',
    text: 'Have you conducted AI risk assessments for your top 10 critical vendors?',
    helpText:
      '92% of organizations trust AI vendors but cannot verify how vendors use their data. Start with your most critical vendors.',
    type: 'radio',
    options: [
      { label: 'No vendor AI risk assessments conducted', value: 100 },
      { label: 'Some vendors assessed informally', value: 60 },
      { label: 'All critical vendors assessed', value: 20 },
      { label: 'All assessed with quarterly reviews', value: 0 },
    ],
  },
  {
    id: 'vendor-2',
    dimension: 'vendorRisk',
    text: 'Can you clearly articulate data ownership boundaries with AI vendors?',
    helpText:
      '"How do you define what\'s yours versus mine?" is the critical question for every AI vendor relationship.',
    type: 'radio',
    options: [
      { label: 'No clarity on data ownership', value: 100 },
      { label: 'Somewhat understood but not documented', value: 60 },
      { label: 'Documented in some contracts', value: 20 },
      { label: 'Contractually defined for all AI vendors', value: 0 },
    ],
  },
  {
    id: 'vendor-3',
    dimension: 'vendorRisk',
    text: 'How often do you review vendor AI data practices?',
    helpText:
      'Vendors frequently change their AI features and data handling practices. Without regular reviews, your risk profile silently expands.',
    type: 'radio',
    options: [
      { label: 'Never reviewed', value: 100 },
      { label: 'Only at contract renewal', value: 60 },
      { label: 'Annually', value: 40 },
      { label: 'Quarterly or more frequently', value: 0 },
    ],
  },
  {
    id: 'vendor-4',
    dimension: 'vendorRisk',
    text: 'Do vendors notify you when adding new AI features to your subscriptions?',
    helpText:
      'SaaS vendors frequently embed AI into existing products without explicit customer notification, expanding your AI footprint without governance review.',
    type: 'radio',
    options: [
      { label: 'Never notified', value: 100 },
      { label: 'Sometimes notified (informal)', value: 60 },
      { label: 'Required by contract', value: 0 },
    ],
  },
  {
    id: 'vendor-5',
    dimension: 'vendorRisk',
    text: 'Do you know if your vendors train AI models on your data?',
    helpText:
      'Many AI vendors use customer data to improve their models unless explicitly opted out. This is a critical data governance question.',
    type: 'radio',
    options: [
      { label: "Don't know", value: 100 },
      { label: 'Some vendors — unclear for others', value: 75 },
      { label: 'Know for most vendors, some gaps', value: 40 },
      { label: 'Fully documented, opted out where needed', value: 0 },
    ],
  },
  {
    id: 'vendor-6',
    dimension: 'vendorRisk',
    text: 'Do your vendor contracts include AI-specific clauses (data usage, model training, liability)?',
    helpText:
      'Standard vendor contracts often lack AI-specific provisions for data ownership, model training rights, and AI-related liability.',
    type: 'radio',
    options: [
      { label: 'No AI-specific contract clauses', value: 100 },
      { label: 'Some contracts have basic AI clauses', value: 60 },
      { label: 'Most contracts include AI provisions', value: 25 },
      { label: 'All contracts have comprehensive AI clauses', value: 0 },
    ],
  },
  {
    id: 'vendor-7',
    dimension: 'vendorRisk',
    text: 'Where do your vendors store and process AI data (geographic jurisdiction)?',
    helpText:
      'Data residency affects regulatory compliance. EU data processed in the US may violate GDPR. Knowing where vendors process AI data is essential.',
    type: 'radio',
    options: [
      { label: "Don't know where data is processed", value: 100 },
      { label: 'Know for some vendors', value: 75 },
      { label: 'Know for most, some gaps', value: 40 },
      { label: 'Fully documented with residency controls', value: 0 },
    ],
  },
  {
    id: 'vendor-8',
    dimension: 'vendorRisk',
    text: 'Do your AI vendors hold relevant certifications (SOC 2, ISO 27001, ISO 42001)?',
    helpText:
      'Certifications demonstrate a baseline of security and governance maturity. ISO 42001 is the first AI-specific management system standard.',
    type: 'radio',
    options: [
      { label: "Don't know vendor certification status", value: 100 },
      { label: 'Some vendors certified (SOC 2)', value: 60 },
      { label: 'Most vendors hold SOC 2 + ISO 27001', value: 25 },
      { label: 'All critical vendors certified including ISO 42001', value: 0 },
    ],
  },
  {
    id: 'vendor-9',
    dimension: 'vendorRisk',
    text: "What is your vendor's AI incident response process?",
    helpText:
      'When an AI vendor has a security breach or AI failure, how quickly are you notified? Do they have documented incident response procedures?',
    type: 'radio',
    options: [
      { label: "Don't know their process", value: 100 },
      { label: 'General security incident process only', value: 60 },
      { label: 'AI-specific incident process documented', value: 25 },
      { label: 'Documented with SLA for notification + tested', value: 0 },
    ],
  },
  {
    id: 'vendor-10',
    dimension: 'vendorRisk',
    text: 'Do you have audit rights over your AI vendors?',
    helpText:
      'Audit rights allow you to verify vendor claims about data handling, security, and AI practices. Without them, you rely entirely on vendor self-reporting.',
    type: 'radio',
    options: [
      { label: 'No audit rights', value: 100 },
      { label: 'Limited audit rights (some contracts)', value: 60 },
      { label: 'Audit rights in most contracts', value: 25 },
      { label: 'Comprehensive audit rights exercised regularly', value: 0 },
    ],
  },

  // =============================================
  // DIMENSION 3: Data Governance & Privacy (10 Qs)
  // =============================================
  {
    id: 'data-1',
    dimension: 'dataGovernance',
    text: 'Do you have data classification policies that address AI training and inference data?',
    helpText:
      'Data classification (public, internal, confidential, restricted) determines what data can be used with AI systems. Without classification, sensitive data may be exposed.',
    type: 'radio',
    options: [
      { label: 'No data classification policy', value: 100 },
      { label: 'Basic classification (not AI-specific)', value: 75 },
      { label: 'Classification policy includes AI data handling', value: 25 },
      { label: 'Comprehensive AI-aware classification, enforced', value: 0 },
    ],
  },
  {
    id: 'data-2',
    dimension: 'dataGovernance',
    text: 'Can you trace the lineage of data used in AI systems (where it came from, how it was transformed)?',
    helpText:
      'Data lineage is critical for auditing AI decisions, especially in regulated industries. 60-80% of AI project time is spent on data preparation.',
    type: 'radio',
    options: [
      { label: 'No data lineage tracking', value: 100 },
      { label: 'Manual/ad-hoc lineage documentation', value: 75 },
      { label: 'Automated lineage for some AI systems', value: 25 },
      { label: 'Comprehensive automated lineage for all AI data', value: 0 },
    ],
  },
  {
    id: 'data-3',
    dimension: 'dataGovernance',
    text: 'Do you control what data employees can paste or upload to AI tools?',
    helpText:
      '77% of employees paste data into GenAI prompts, and 82% do so from unmanaged accounts. Data loss prevention (DLP) for AI is essential.',
    type: 'radio',
    options: [
      { label: 'No controls on data sharing with AI', value: 100 },
      { label: 'Policy exists but no technical enforcement', value: 75 },
      { label: 'Basic DLP for some AI tools', value: 40 },
      { label: 'Comprehensive DLP for all AI tools', value: 0 },
    ],
  },
  {
    id: 'data-4',
    dimension: 'dataGovernance',
    text: 'Do you have consent management for personal data used in AI processing?',
    helpText:
      'GDPR, CCPA, and other regulations require explicit consent for AI processing of personal data. GDPR Article 22 provides rights related to automated decision-making.',
    type: 'radio',
    options: [
      { label: 'No consent management for AI', value: 100 },
      { label: 'General privacy consent (not AI-specific)', value: 60 },
      { label: 'AI-specific consent for some use cases', value: 25 },
      { label: 'Comprehensive AI consent management', value: 0 },
    ],
  },
  {
    id: 'data-5',
    dimension: 'dataGovernance',
    text: 'How do you handle data retention and deletion for AI systems?',
    helpText:
      'AI systems may retain data indefinitely for training. Proper retention policies ensure compliance with privacy regulations and reduce exposure.',
    type: 'radio',
    options: [
      { label: 'No AI-specific retention policies', value: 100 },
      { label: 'General retention policy (not AI-specific)', value: 75 },
      { label: 'AI retention policies defined, manual enforcement', value: 40 },
      { label: 'Automated retention and deletion for all AI data', value: 0 },
    ],
  },
  {
    id: 'data-6',
    dimension: 'dataGovernance',
    text: 'Do you anonymize or pseudonymize sensitive data before AI processing?',
    helpText:
      'Data anonymization reduces risk when data must be used with AI systems. This is especially important for healthcare, financial, and HR data.',
    type: 'radio',
    options: [
      { label: 'No anonymization practices', value: 100 },
      { label: 'Ad-hoc anonymization for some use cases', value: 60 },
      { label: 'Standard anonymization process, not always followed', value: 35 },
      { label: 'Mandatory anonymization enforced for all sensitive AI data', value: 0 },
    ],
  },
  {
    id: 'data-7',
    dimension: 'dataGovernance',
    text: 'Do you have a data governance committee or owner responsible for AI data?',
    helpText:
      'A designated data governance owner ensures accountability for how data is collected, stored, and used in AI systems.',
    type: 'radio',
    options: [
      { label: 'No designated data governance ownership', value: 100 },
      { label: 'IT manages data informally', value: 75 },
      { label: 'Data governance owner designated', value: 25 },
      { label: 'Cross-functional data governance committee with AI focus', value: 0 },
    ],
  },
  {
    id: 'data-8',
    dimension: 'dataGovernance',
    text: 'Can you fulfill data subject access requests (DSARs) for AI-processed data?',
    helpText:
      'Under GDPR and CCPA, individuals can request to see what data an organization holds about them, including data processed by AI systems.',
    type: 'radio',
    options: [
      { label: 'Cannot fulfill DSARs for AI data', value: 100 },
      { label: 'Can partially fulfill (manual, slow)', value: 60 },
      { label: 'Can fulfill for most AI systems', value: 25 },
      { label: 'Fully automated DSAR process including AI data', value: 0 },
    ],
  },
  {
    id: 'data-9',
    dimension: 'dataGovernance',
    text: 'Do you have data quality controls for AI training and input data?',
    helpText:
      'Poor data quality leads to poor AI outcomes. "Garbage in, garbage out" applies especially to AI systems that amplify data quality issues.',
    type: 'radio',
    options: [
      { label: 'No data quality controls for AI', value: 100 },
      { label: 'Basic validation at data ingestion', value: 60 },
      { label: 'Quality checks for most AI data pipelines', value: 25 },
      { label: 'Comprehensive quality framework with monitoring', value: 0 },
    ],
  },
  {
    id: 'data-10',
    dimension: 'dataGovernance',
    text: 'Do you maintain separate environments (dev/staging/prod) for AI data?',
    helpText:
      'Using production data in development or testing environments increases exposure risk. Proper environment separation protects sensitive data.',
    type: 'radio',
    options: [
      { label: 'No environment separation for AI', value: 100 },
      { label: 'Some separation but inconsistent', value: 60 },
      { label: 'Standard separation for most AI systems', value: 25 },
      { label: 'Strict separation with synthetic data for dev/test', value: 0 },
    ],
  },

  // =============================================
  // DIMENSION 4: Security & Compliance (10 Qs)
  // =============================================
  {
    id: 'security-1',
    dimension: 'securityCompliance',
    text: 'Which AI-relevant certifications does your organization hold?',
    helpText:
      'ISO 42001 is the first certifiable AI management standard. 40% of organizations are pursuing it. SOC 2 and ISO 27001 are baseline security certifications.',
    type: 'radio',
    options: [
      { label: 'No relevant certifications', value: 100 },
      { label: 'SOC 2 or ISO 27001 only', value: 60 },
      { label: 'SOC 2 + ISO 27001', value: 35 },
      { label: 'SOC 2 + ISO 27001 + ISO 42001 (or pursuing)', value: 0 },
    ],
  },
  {
    id: 'security-2',
    dimension: 'securityCompliance',
    text: 'Do you encrypt AI data at rest and in transit?',
    helpText:
      'Encryption is a baseline security requirement. AI systems often process sensitive data that requires protection both in storage and during transmission.',
    type: 'radio',
    options: [
      { label: "Don't know / not standard practice", value: 100 },
      { label: 'In transit only (TLS)', value: 60 },
      { label: 'At rest and in transit for most systems', value: 25 },
      { label: 'Comprehensive encryption with key management', value: 0 },
    ],
  },
  {
    id: 'security-3',
    dimension: 'securityCompliance',
    text: 'Do you have an AI-specific incident response plan?',
    helpText:
      'Standard incident response plans may not cover AI-specific scenarios like hallucinations, model poisoning, or autonomous agent failures.',
    type: 'radio',
    options: [
      { label: 'No incident response plan for AI', value: 100 },
      { label: 'General IR plan covers AI informally', value: 60 },
      { label: 'AI scenarios included in general IR plan', value: 25 },
      { label: 'Dedicated AI incident response plan, tested', value: 0 },
    ],
  },
  {
    id: 'security-4',
    dimension: 'securityCompliance',
    text: 'How prepared are you for EU AI Act compliance?',
    helpText:
      'The EU AI Act enforcement date of August 2, 2026 marks the most consequential AI regulation deadline. Penalties up to 35M or 7% of worldwide turnover.',
    type: 'radio',
    options: [
      { label: 'Not applicable / no EU operations', value: 0 },
      { label: 'Not started preparation', value: 100 },
      { label: 'Awareness only, no action plan', value: 75 },
      { label: 'Active preparation with gap assessment', value: 25 },
      { label: 'Compliance roadmap with implementation underway', value: 0 },
    ],
  },
  {
    id: 'security-5',
    dimension: 'securityCompliance',
    text: 'Do you conduct penetration testing for AI systems?',
    helpText:
      'AI systems face unique attack vectors (prompt injection, data poisoning, model inversion) that traditional penetration testing may not cover.',
    type: 'radio',
    options: [
      { label: 'No penetration testing for AI', value: 100 },
      { label: 'General pen testing (not AI-specific)', value: 60 },
      { label: 'AI-specific pen testing annually', value: 25 },
      { label: 'Regular AI pen testing + red team exercises', value: 0 },
    ],
  },
  {
    id: 'security-6',
    dimension: 'securityCompliance',
    text: 'Do you have access controls (RBAC) for AI systems and data?',
    helpText:
      'Role-based access controls ensure only authorized personnel can access, configure, or modify AI systems and their underlying data.',
    type: 'radio',
    options: [
      { label: 'No AI-specific access controls', value: 100 },
      { label: 'Basic access controls (admin/user)', value: 60 },
      { label: 'RBAC implemented for most AI systems', value: 25 },
      { label: 'Comprehensive RBAC with least-privilege enforcement', value: 0 },
    ],
  },
  {
    id: 'security-7',
    dimension: 'securityCompliance',
    text: 'Do you review AI-generated code before deploying to production?',
    helpText:
      'The Moltbook breach exposed 35K emails and 1.5M API tokens because AI-generated code was deployed without security review.',
    type: 'radio',
    options: [
      { label: 'No review process for AI-generated code', value: 100 },
      { label: 'Informal peer review', value: 60 },
      { label: 'Mandatory code review process', value: 25 },
      { label: 'Automated security scanning + mandatory review', value: 0 },
    ],
  },
  {
    id: 'security-8',
    dimension: 'securityCompliance',
    text: 'Do you maintain audit trails for AI decisions?',
    helpText:
      'Audit trails document how AI systems make decisions, which is required for regulatory compliance and incident investigation.',
    type: 'radio',
    options: [
      { label: 'No audit trails for AI', value: 100 },
      { label: 'Basic logging for some systems', value: 60 },
      { label: 'Comprehensive logging for most AI systems', value: 25 },
      { label: 'Immutable audit trails with explainability', value: 0 },
    ],
  },
  {
    id: 'security-9',
    dimension: 'securityCompliance',
    text: 'Do you have a designated AI governance committee or responsible person?',
    helpText:
      'An AI governance committee provides cross-functional oversight. Without one, governance responsibilities fall through the cracks between IT, Legal, and business units.',
    type: 'radio',
    options: [
      { label: 'No designated governance responsibility', value: 100 },
      { label: 'IT handles AI informally', value: 75 },
      { label: 'Designated person (CISO or CTO)', value: 40 },
      { label: 'Cross-functional AI governance committee with CEO sponsorship', value: 0 },
    ],
  },
  {
    id: 'security-10',
    dimension: 'securityCompliance',
    text: 'How do you handle compliance with multiple jurisdictions (GDPR, CCPA, etc.)?',
    helpText:
      'Organizations operating across regions must navigate multiple, sometimes conflicting, regulatory frameworks. 53-54% of organizations feel overwhelmed by AI regulations.',
    type: 'radio',
    options: [
      { label: 'No cross-jurisdictional compliance strategy', value: 100 },
      { label: 'Primary jurisdiction compliance only', value: 60 },
      { label: 'Most jurisdictions mapped, some gaps', value: 25 },
      { label: 'Comprehensive multi-jurisdictional compliance framework', value: 0 },
    ],
  },

  // =============================================
  // DIMENSION 5: AI-Specific Risks (10 Qs)
  // =============================================
  {
    id: 'airisk-1',
    dimension: 'aiSpecificRisks',
    text: 'Do you monitor AI outputs for hallucinations before they reach customers?',
    helpText:
      '$67.4 billion was lost to AI hallucinations in 2024. 47% of enterprise AI users made major decisions based on hallucinated content.',
    type: 'radio',
    options: [
      { label: 'No hallucination monitoring', value: 100 },
      { label: 'Manual spot-checking', value: 75 },
      { label: 'Automated validation for some outputs', value: 25 },
      { label: 'Comprehensive validation layer for all customer-facing AI', value: 0 },
    ],
  },
  {
    id: 'airisk-2',
    dimension: 'aiSpecificRisks',
    text: 'Do you have model drift detection and monitoring?',
    helpText:
      'AI models degrade over time. Model drift consumes 22% more resources than initial deployment and leads to unreliable outputs.',
    type: 'radio',
    options: [
      { label: 'No drift detection', value: 100 },
      { label: 'Periodic manual accuracy checks', value: 60 },
      { label: 'Automated drift monitoring with alerts', value: 25 },
      { label: 'Continuous monitoring with automated retraining triggers', value: 0 },
    ],
  },
  {
    id: 'airisk-3',
    dimension: 'aiSpecificRisks',
    text: 'Do you have defenses against prompt injection attacks?',
    helpText:
      'Prompt injection hides malicious commands in data that AI systems process. Traditional security tools are "semantically blind" to these attacks.',
    type: 'radio',
    options: [
      { label: 'No prompt injection defenses', value: 100 },
      { label: 'Aware of the risk, no controls', value: 75 },
      { label: 'Basic input sanitization', value: 40 },
      { label: 'Multi-layer defense (input validation + output filtering + monitoring)', value: 0 },
    ],
  },
  {
    id: 'airisk-4',
    dimension: 'aiSpecificRisks',
    text: 'Do you have governance controls for agentic AI (autonomous agents)?',
    helpText:
      'Agentic AI takes actions autonomously without real-time human oversight. Agents may modify databases, execute transactions, or grant system access.',
    type: 'radio',
    options: [
      { label: 'Not using agentic AI', value: 0 },
      { label: 'Using agents with no specific governance', value: 100 },
      { label: 'Basic approval process for agent deployment', value: 50 },
      { label: 'Comprehensive agent governance (scope limits, monitoring, kill switch)', value: 0 },
    ],
  },
  {
    id: 'airisk-5',
    dimension: 'aiSpecificRisks',
    text: 'Do you assess AI systems for bias and fairness?',
    helpText:
      'AI systems can perpetuate or amplify existing biases. Bias in hiring algorithms, credit scoring, and healthcare AI has led to significant legal and reputational consequences.',
    type: 'radio',
    options: [
      { label: 'No bias assessment', value: 100 },
      { label: 'Aware of bias risk, no formal assessment', value: 75 },
      { label: 'Bias assessment for some high-risk AI', value: 25 },
      { label: 'Systematic bias testing for all AI with remediation', value: 0 },
    ],
  },
  {
    id: 'airisk-6',
    dimension: 'aiSpecificRisks',
    text: 'Do you have AI explainability requirements for decision-making systems?',
    helpText:
      'EU AI Act and NIST AI RMF require explainability for high-risk AI. Can you explain how and why an AI system made a specific decision?',
    type: 'radio',
    options: [
      { label: 'No explainability requirements', value: 100 },
      { label: 'Informal "best effort" explanations', value: 75 },
      { label: 'Explainability required for high-risk decisions', value: 25 },
      { label: 'Comprehensive explainability framework with documentation', value: 0 },
    ],
  },
  {
    id: 'airisk-7',
    dimension: 'aiSpecificRisks',
    text: 'Do you validate the safety of third-party AI models and plugins before use?',
    helpText:
      'The OpenClaw incident showed 17% of analyzed AI agent skills were malicious. Third-party AI models and plugins can introduce backdoors and malware.',
    type: 'radio',
    options: [
      { label: 'No validation of third-party AI', value: 100 },
      { label: 'Basic reputation check only', value: 75 },
      { label: 'Security review before deployment', value: 25 },
      { label: 'Comprehensive validation (code review, sandboxing, monitoring)', value: 0 },
    ],
  },
  {
    id: 'airisk-8',
    dimension: 'aiSpecificRisks',
    text: 'Do you have safeguards for AI interactions with vulnerable populations?',
    helpText:
      'A 16-year-old boy was encouraged toward suicide by an AI chatbot. AI systems interacting with minors, patients, or vulnerable individuals need additional safeguards.',
    type: 'radio',
    options: [
      { label: 'No specific safeguards', value: 100 },
      { label: 'General content moderation', value: 60 },
      { label: 'Risk-specific filters for vulnerable populations', value: 25 },
      { label: 'Comprehensive safeguards with escalation protocols', value: 0 },
    ],
  },
  {
    id: 'airisk-9',
    dimension: 'aiSpecificRisks',
    text: 'Do you have a process for AI model versioning and rollback?',
    helpText:
      'When an AI model update causes problems, you need to quickly roll back to a previous version. Without versioning, recovery is extremely difficult.',
    type: 'radio',
    options: [
      { label: 'No versioning or rollback capability', value: 100 },
      { label: 'Manual versioning for some models', value: 60 },
      { label: 'Systematic versioning with rollback procedures', value: 25 },
      { label: 'Automated versioning with one-click rollback and testing', value: 0 },
    ],
  },
  {
    id: 'airisk-10',
    dimension: 'aiSpecificRisks',
    text: 'Do you monitor for deepfake and synthetic content threats?',
    helpText:
      'Deepfake attacks are increasing. An Indian Finance Minister deepfake led to a $22,600 fraud. Organizations need authentication and detection capabilities.',
    type: 'radio',
    options: [
      { label: 'No deepfake/synthetic content monitoring', value: 100 },
      { label: 'Awareness only, no monitoring', value: 75 },
      { label: 'Basic detection tools deployed', value: 40 },
      { label: 'Comprehensive monitoring with authentication protocols', value: 0 },
    ],
  },

  // =============================================
  // DIMENSION 6: ROI & Performance Tracking (10 Qs)
  // =============================================
  {
    id: 'roi-1',
    dimension: 'roiTracking',
    text: 'Do you track ROI for AI initiatives beyond simple cost reduction?',
    helpText:
      'Most organizations only measure AI cost savings, missing innovation value, customer value, and strategic value. Multi-dimensional ROI separates AI Achievers from the rest.',
    type: 'radio',
    options: [
      { label: 'No ROI tracking for AI', value: 100 },
      { label: 'Cost reduction tracking only', value: 60 },
      { label: '2-3 ROI dimensions tracked', value: 25 },
      { label: 'Multi-dimensional ROI (financial, operational, innovation, customer, strategic)', value: 0 },
    ],
  },
  {
    id: 'roi-2',
    dimension: 'roiTracking',
    text: 'What percentage of your revenue is influenced by AI initiatives?',
    helpText:
      'AI Achievers attribute 30%+ of revenue to AI. Only 12% of organizations reach this level. This is the key benchmark for AI maturity.',
    type: 'radio',
    options: [
      { label: '0% (no AI influence on revenue)', value: 100 },
      { label: '1-10%', value: 60 },
      { label: '11-29%', value: 25 },
      { label: '30%+ (AI Achiever level)', value: 0 },
    ],
  },
  {
    id: 'roi-3',
    dimension: 'roiTracking',
    text: 'Do you track hidden AI costs (data prep, maintenance, talent premium)?',
    helpText:
      '85% of organizations misestimate AI costs by >10%. Hidden costs include data prep (60-80% of project time), ongoing maintenance (+22% resources), and talent premium (30-50% above market).',
    type: 'radio',
    options: [
      { label: 'No hidden cost tracking', value: 100 },
      { label: 'Some cost tracking (compute only)', value: 60 },
      { label: 'Most hidden costs tracked', value: 25 },
      { label: 'Comprehensive cost tracking including all hidden categories', value: 0 },
    ],
  },
  {
    id: 'roi-4',
    dimension: 'roiTracking',
    text: 'Do you have KPIs for AI model performance (accuracy, latency, reliability)?',
    helpText:
      'Without performance KPIs, you cannot determine if AI systems are meeting expectations or degrading over time.',
    type: 'radio',
    options: [
      { label: 'No AI performance KPIs', value: 100 },
      { label: 'Informal monitoring', value: 75 },
      { label: 'KPIs defined for most AI systems', value: 25 },
      { label: 'Real-time dashboards with alerting', value: 0 },
    ],
  },
  {
    id: 'roi-5',
    dimension: 'roiTracking',
    text: 'How do you measure the impact of AI on customer experience?',
    helpText:
      'AI-enhanced customer experience includes NPS improvement, retention rates, satisfaction scores, and response time reduction.',
    type: 'radio',
    options: [
      { label: 'No customer experience measurement for AI', value: 100 },
      { label: 'General customer metrics (not AI-attributed)', value: 75 },
      { label: 'Some AI-attributed customer metrics', value: 40 },
      { label: 'Comprehensive AI customer impact measurement', value: 0 },
    ],
  },
  {
    id: 'roi-6',
    dimension: 'roiTracking',
    text: 'Do you track AI project success/failure rates?',
    helpText:
      '70-85% of AI initiatives fail expectations. 42% of companies abandoned most AI projects in 2025. Tracking rates helps identify systemic issues.',
    type: 'radio',
    options: [
      { label: 'No project tracking', value: 100 },
      { label: 'Informal awareness of failures', value: 75 },
      { label: 'Formal project status tracking', value: 25 },
      { label: 'Comprehensive tracking with post-mortem analysis', value: 0 },
    ],
  },
  {
    id: 'roi-7',
    dimension: 'roiTracking',
    text: 'Do you compare AI ROI against initial business case projections?',
    helpText:
      '85% of organizations misestimate AI costs. Comparing actual outcomes against projections helps improve future business case accuracy.',
    type: 'radio',
    options: [
      { label: 'No comparison to business case', value: 100 },
      { label: 'Ad-hoc comparisons for some projects', value: 60 },
      { label: 'Regular comparison for most projects', value: 25 },
      { label: 'Systematic comparison with variance analysis and lessons learned', value: 0 },
    ],
  },
  {
    id: 'roi-8',
    dimension: 'roiTracking',
    text: 'Do you measure the impact of AI governance itself (incidents avoided, time saved)?',
    helpText:
      'Governance ROI includes incidents avoided, vendor risk reduction, compliance confidence, and time savings from standardized processes.',
    type: 'radio',
    options: [
      { label: 'No governance ROI measurement', value: 100 },
      { label: 'Qualitative assessment only', value: 60 },
      { label: 'Some quantitative metrics', value: 25 },
      { label: 'Comprehensive governance ROI dashboard', value: 0 },
    ],
  },
  {
    id: 'roi-9',
    dimension: 'roiTracking',
    text: 'Do you have executive dashboards for AI performance and governance?',
    helpText:
      'Executive dashboards provide leadership visibility into AI portfolio health, risk posture, and ROI — enabling informed strategic decisions.',
    type: 'radio',
    options: [
      { label: 'No executive AI dashboards', value: 100 },
      { label: 'Ad-hoc reporting when requested', value: 75 },
      { label: 'Regular reports (monthly/quarterly)', value: 25 },
      { label: 'Real-time executive dashboard with drill-down', value: 0 },
    ],
  },
  {
    id: 'roi-10',
    dimension: 'roiTracking',
    text: 'Do you benchmark your AI maturity against industry peers?',
    helpText:
      'Benchmarking helps identify gaps and opportunities. Only 12% of organizations achieve AI Achiever status — knowing where you stand is the first step.',
    type: 'radio',
    options: [
      { label: 'No benchmarking', value: 100 },
      { label: 'Informal awareness of industry trends', value: 75 },
      { label: 'Annual benchmarking exercise', value: 25 },
      { label: 'Continuous benchmarking with action plans', value: 0 },
    ],
  },
];

export const getQuestionsByDimension = (dimension: string): AssessmentQuestion[] =>
  ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dimension);
