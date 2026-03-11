/**
 * industryContent.ts
 *
 * Industry-specific content for the Executive Summary generator.
 * Consumed by execSummary.ts — do not import elsewhere.
 *
 * First pass (session 44): Healthcare, Financial Services, Technology,
 * Manufacturing, Government, Legal Services.
 * Remaining industries fall back to generic DIMENSION_INSIGHTS in execSummary.ts.
 */

import { Industry } from '@/types/assessment';
import type { DimensionKey } from '@/types/assessment';

// ─── Section 1 Opener (per industry) ─────────────────────────────────────────
// 2–3 sentences prepended before the maturity narrative in Section 1.

export const INDUSTRY_INTRO: Partial<Record<Industry, string>> = {
  [Industry.Healthcare]:
    'As a healthcare organization, your AI governance posture carries patient safety obligations ' +
    'that extend beyond regulatory compliance. Clinical AI tools — from diagnostic support to ' +
    'care pathway recommendations — require validated authority at each decision point. In this ' +
    'context, a governance gap is not a compliance finding; it is an unmanaged patient risk.',

  [Industry.Finance]:
    'Financial services organizations face the most immediate AI governance exposure of any ' +
    'industry. Automated credit decisions, fraud detection, trading algorithms, and client-facing ' +
    'AI are classified as high-risk AI systems under the EU AI Act and face active US court ' +
    'scrutiny on discrimination and explainability grounds. Your governance posture is a direct ' +
    'input to your regulatory risk profile.',

  [Industry.Technology]:
    'Technology organizations are simultaneously the heaviest AI adopters and, in many cases, ' +
    'the primary builders of AI tools others will use. Your governance posture applies in both ' +
    'directions: as operators of AI systems within your organization, and as developers whose ' +
    'products carry governance obligations to every downstream user and customer.',

  [Industry.Manufacturing]:
    'Manufacturing AI governance is converging toward critical infrastructure standards. ' +
    'Autonomous quality control, predictive maintenance, and supply chain optimization tools ' +
    'are increasingly classified as high-risk AI under EU AI Act Article 9 — requiring full ' +
    'technical documentation, human oversight mechanisms, and robustness controls. The ' +
    'governance question is not whether these systems will be regulated, but whether you will ' +
    'be ready when they are.',

  [Industry.Government]:
    'Government organizations deploying AI face the strictest explainability and accountability ' +
    'obligations of any sector. Public-facing AI decisions — benefits eligibility, permit ' +
    'processing, law enforcement applications, resource allocation — must meet a higher standard ' +
    'of traceability and human oversight than private sector equivalents. The question regulators ' +
    'and citizens will ask is not whether AI was used, but whether it was used responsibly and ' +
    'with appropriate human authority.',

  [Industry.Legal]:
    'Legal organizations occupy a structurally complex position in AI governance: advising ' +
    'clients on AI risk while managing significant AI exposure in their own operations. Contract ' +
    'analysis tools, legal research AI, document review automation, and matter management ' +
    'systems are reshaping legal practice — and each one carries attorney-client privilege, ' +
    'confidentiality, and professional responsibility implications that general IT governance ' +
    'frameworks do not address.',
};

// ─── Industry-Specific Regulatory Obligations ────────────────────────────────
// Appended to region-based regs in the regulatory exposure callout.

export const INDUSTRY_REGULATORY: Partial<Record<Industry, string[]>> = {
  [Industry.Healthcare]: [
    'HIPAA (patient data handling and AI tool access)',
    'FDA AI/ML-based Software as a Medical Device guidance',
    'EU AI Act Article 6 high-risk classification for patient-facing AI (if operating in Europe)',
  ],

  [Industry.Finance]: [
    'FINRA and SEC AI guidance (audit trail, explainability)',
    'EU AI Act high-risk classification (automated credit scoring, insurance adjudication)',
    'SR 11-7 Model Risk Management guidance',
    'CCPA / GDPR for customer financial data',
  ],

  [Industry.Technology]: [
    'EU AI Act (obligations as both AI operator and AI provider)',
    'GDPR for customer and user data',
    'ISO/IEC 42001 AI Management System Standard (becoming expected baseline)',
    'CCPA for California user data',
  ],

  [Industry.Manufacturing]: [
    'EU AI Act Article 9 high-risk classification (critical infrastructure, product safety)',
    'ISO/IEC 42001 AI Management System Standard',
    'Industry-specific safety standards (ISO 13849 for safety-critical machinery AI)',
    'NIST AI RMF for US operations',
  ],

  [Industry.Government]: [
    'EU AI Act highest-risk tier (law enforcement, public services, benefits determination)',
    'NIST AI RMF (US federal and state AI guidance)',
    'OMB Memorandum M-24-10 (US federal AI governance)',
    'GDPR for EU public bodies processing citizen data',
    'Freedom of Information obligations for AI decision audit trails',
  ],

  [Industry.Legal]: [
    'Bar association AI ethics guidance (ABA Formal Opinion 512 and state-specific rules)',
    'EU AI Act for European practice',
    'GDPR for client personal data',
    'Attorney-client privilege implications for AI-processed privileged communications',
    'CCPA for California client data',
  ],
};

// ─── Industry × Dimension Gap Insights (Pro tier) ────────────────────────────
// If present, replaces generic DIMENSION_INSIGHTS for the specific dimension.
// Only dimensions with tailored content are listed — others fall back to generic.

export const INDUSTRY_GAP_INSIGHTS: Partial<Record<Industry, Partial<Record<DimensionKey, string>>>> = {
  [Industry.Healthcare]: {
    shadowAI:
      'Clinical staff using unapproved AI for patient documentation, diagnostic support, or ' +
      'care recommendations creates liability that cannot be remediated retroactively. Every ' +
      'undocumented AI interaction with patient data is an unaudited clinical decision — and a ' +
      'potential HIPAA breach event.',
    vendorRisk:
      'AI vendors in healthcare settings must operate under HIPAA Business Associate Agreements. ' +
      'A vendor processing patient data without a BAA in place creates immediate regulatory ' +
      'exposure — and courts have established that healthcare organizations cannot defer ' +
      'liability to the vendor tool.',
    dataGovernance:
      'Clinical AI outputs are only as reliable as the data they run on. Patient records ' +
      'spanning multiple EHR systems, inconsistent clinical terminology across departments, and ' +
      'undefined data ownership are the leading causes of AI failure in care delivery settings. ' +
      'You cannot audit a model built on data you cannot trace.',
  },

  [Industry.Finance]: {
    shadowAI:
      'Unapproved AI in financial workflows — portfolio analysis tools, client communication ' +
      'drafters, regulatory filing assistants — creates audit exposure that compounds with each ' +
      'undocumented use. Regulators are beginning to require full inventory of AI tools in use, ' +
      'not just approved and documented ones.',
    vendorRisk:
      'Federal courts have ordered client lists from AI tool vendors in discrimination lawsuits ' +
      'involving hiring and lending. The precedent is explicit: financial institutions cannot ' +
      'transfer liability to the vendor. If your organization uses AI in credit, insurance, or ' +
      'hiring decisions, your vendor contracts must include audit rights, adverse impact testing ' +
      'obligations, and documented challenge processes.',
    dataGovernance:
      'Model risk management frameworks require documented lineage from training data to ' +
      'decision output. Financial institutions with fragmented data foundations — multiple ' +
      'customer record systems, inconsistent product definitions, undocumented data ownership ' +
      '— cannot meet this standard with current AI deployment practices.',
  },

  [Industry.Technology]: {
    shadowAI:
      'In technology organizations, shadow AI is not only employees using unapproved tools — ' +
      'it is engineers embedding unapproved models into products without governance review. The ' +
      'blast radius of an ungoverned AI deployment is not one user\'s workflow; it is every ' +
      'customer using the product, and every regulatory obligation that attaches to that product.',
    aiSpecificRisks:
      'Software engineering represents 49.7% of current AI agent deployments. Code-generating ' +
      'agents with broad repository access, autonomous commit capabilities, and CI/CD pipeline ' +
      'integration require execution-boundary authority validation — not just workflow completion ' +
      'logs. Permissions to push code are not the same as organizational mandate to push ' +
      'AI-generated code.',
    dataGovernance:
      'Product telemetry, user behavior data, and training datasets for internal models ' +
      'frequently span multiple systems with inconsistent ownership. The question that AI ' +
      'governance requires you to answer — "Who owns this data, and did they authorize this ' +
      'use?" — is often unanswerable in technology organizations without a dedicated data ' +
      'governance foundation.',
  },

  [Industry.Manufacturing]: {
    securityCompliance:
      'Operational technology (OT) systems in manufacturing are increasingly connected to ' +
      'AI-driven analytics and optimization platforms. A security posture built for IT ' +
      'environments does not protect OT/AI integration points — and a breach at that boundary ' +
      'has physical safety consequences, not just data exposure.',
    vendorRisk:
      'AI vendors in manufacturing supply chains have access to production data, quality ' +
      'parameters, yield telemetry, and operational IP. Without contractual audit rights and ' +
      'documented data handling requirements, your organization has no visibility into how that ' +
      'data is used, retained, or whether it is used to train vendor models that serve your ' +
      'competitors.',
    aiSpecificRisks:
      'Automated quality control and production decisions are high-stakes AI use cases where ' +
      'decision reversibility is low and failure impact is physical. Risk classification by ' +
      'decision impact — not tool brand — is the governance discipline that distinguishes ' +
      'organizations that are AI-ready from those that are AI-exposed.',
  },

  [Industry.Government]: {
    aiSpecificRisks:
      'Government AI in high-stakes decisions must meet the EU AI Act\'s Article 14 human ' +
      'oversight requirements — but most public sector organizations have not yet built HITL ' +
      'infrastructure to provide meaningful oversight rather than symbolic approval. A ' +
      'compliance officer who cannot feasibly review the volume of AI-assisted decisions is ' +
      'not oversight; it is liability without authority.',
    dataGovernance:
      'Government data is siloed across agencies, classified at multiple sensitivity levels, ' +
      'and subject to both records retention requirements and Freedom of Information obligations ' +
      'simultaneously. AI systems built on this substrate inherit every data ownership, quality, ' +
      'and lineage problem — and every AI output that cannot be traced to source data is a ' +
      'potential FOIA exposure.',
    vendorRisk:
      'Government procurement of AI tools creates a dual exposure: the organization\'s own ' +
      'regulatory obligations AND the vendor\'s compliance posture. A vendor breach that exposes ' +
      'citizen data carries reputational and legal consequences that no contractual ' +
      'indemnification fully resolves. Audit rights are not optional in public sector ' +
      'AI procurement.',
  },

  [Industry.Legal]: {
    shadowAI:
      'Attorney use of unapproved AI in client matters — contract drafting, research synthesis, ' +
      'discovery review — raises privilege and confidentiality concerns that policy alone cannot ' +
      'address. Every unapproved AI tool that processes client matter content is an undisclosed ' +
      'data handling event. Bar association guidance is increasingly clear: attorneys have a ' +
      'duty of competence that includes understanding the AI tools they use.',
    dataGovernance:
      'Legal AI requires demonstrable data lineage for any output used in client matters. ' +
      'AI-generated legal analysis that cannot be traced to source documents creates professional ' +
      'responsibility exposure. "The AI said so" is not a citable source and is not a defensible ' +
      'answer to a challenge in court or before a bar disciplinary committee.',
    vendorRisk:
      'Legal technology vendors frequently process client data, privileged communications, and ' +
      'matter-sensitive documents. Without Business Associate-equivalent confidentiality ' +
      'agreements, audit rights, and data handling controls, your organization cannot meet its ' +
      'duty of confidentiality obligations — and cannot detect a breach before your client does.',
  },
};
