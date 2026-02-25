// ============================================
// AI Governance & ROI Assessment Tool - Types
// ============================================

// --- Enums ---

export enum Industry {
  Healthcare = 'Healthcare',
  Finance = 'Financial Services',
  Retail = 'Retail & E-Commerce',
  Manufacturing = 'Manufacturing',
  Technology = 'Technology',
  Government = 'Government',
  Education = 'Education',
  Legal = 'Legal Services',
  Energy = 'Energy & Utilities',
  Telecom = 'Telecommunications',
  Media = 'Media & Entertainment',
  RealEstate = 'Real Estate',
  Nonprofit = 'Nonprofit',
  Other = 'Other',
}

export enum CompanySize {
  Small = 'Small (1-249)',
  Medium = 'Medium (250-999)',
  Large = 'Large (1,000-4,999)',
  Enterprise = 'Enterprise (5,000+)',
}

export enum Region {
  NorthAmerica = 'North America',
  Europe = 'Europe',
  AsiaPacific = 'Asia-Pacific',
  MiddleEast = 'Middle East & Africa',
  LatinAmerica = 'Latin America',
}

export enum MaturityLevel {
  Experimenter = 'Experimenter',
  Builder = 'Builder',
  Innovator = 'Innovator',
  Achiever = 'Achiever',
}

export enum AIUseCase {
  GenerativeAI = 'Generative AI (ChatGPT, Copilot, etc.)',
  PredictiveAnalytics = 'Predictive Analytics',
  ComputerVision = 'Computer Vision',
  NLP = 'Natural Language Processing',
  ProcessAutomation = 'Process Automation / RPA',
  CustomerService = 'AI Customer Service / Chatbots',
  HRRecruitment = 'HR & Recruitment AI',
  CybersecurityAI = 'Cybersecurity AI',
  AgenticAI = 'Agentic AI / Autonomous Agents',
  Other = 'Other',
}

export enum DeploymentTimeline {
  AlreadyDeployed = 'Already Deployed',
  ZeroToSix = '0-6 months',
  SixToTwelve = '6-12 months',
  TwelvePlus = '12+ months',
}

export enum ResponseLevel {
  None = 0,
  Basic = 25,
  Developing = 50,
  Mature = 75,
  Advanced = 100,
}

export enum RiskLevel {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL',
}

// --- Core Interfaces ---

export interface OrganizationProfile {
  organizationName: string;
  industry: Industry;
  size: CompanySize;
  annualRevenue: string;
  primaryLocation: string;
  operatingRegions: Region[];
  aiMaturityLevel: MaturityLevel;
  aiUseCases: AIUseCase[];
  deploymentTimeline: DeploymentTimeline;
  expectedAISpend: string;
}

// Jurisdiction codes for question filtering (maps from Region enum)
export type JurisdictionCode = 'all' | 'us' | 'eu' | 'uk' | 'ap' | 'latam' | 'mea';

export interface AssessmentQuestion {
  id: string;
  dimension: DimensionKey;
  text: string;
  helpText: string;
  type: 'radio' | 'checkbox' | 'slider' | 'select';
  options?: QuestionOption[];
  weight?: number;
  // If absent or empty, shown for all jurisdictions. Otherwise, only shown
  // when org operates in at least one of the listed jurisdictions.
  jurisdictions?: JurisdictionCode[];
}

export interface QuestionOption {
  label: string;
  value: number;
  description?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface QuestionResponse {
  questionId: string;
  value: number;
}

export type DimensionKey =
  | 'shadowAI'
  | 'vendorRisk'
  | 'dataGovernance'
  | 'securityCompliance'
  | 'aiSpecificRisks'
  | 'roiTracking';

export interface DimensionConfig {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  weight: number;
  description: string;
  icon: string;
}

export interface DimensionScore {
  key: DimensionKey;
  score: number;
  riskLevel: RiskLevel;
  questionScores: { questionId: string; score: number }[];
}

export interface RiskScore {
  dimensions: Record<DimensionKey, number>;
  overallRisk: number;
  riskLevel: RiskLevel;
  achieverScore: number;
  currentMaturity: MaturityLevel;
  targetMaturity: MaturityLevel;
  maturityGap: string[];
}

export interface BlindSpot {
  title: string;
  dimension: DimensionKey;
  severity: RiskLevel;
  score: number;
  description: string;
  immediateAction: string;
}

export interface Recommendation {
  category: 'vendor' | 'audit' | 'monitoring' | 'roi' | 'roadmap' | 'compliance';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: 'this-week' | 'this-month' | 'this-quarter' | 'this-year';
  isPaid: boolean;
}

export interface AssessmentResult {
  id: string;
  organizationProfile: OrganizationProfile;
  responses: QuestionResponse[];
  dimensionScores: DimensionScore[];
  riskScore: RiskScore;
  blindSpots: BlindSpot[];
  recommendations: Recommendation[];
  completedAt: string;
  assessmentVersion: string;
}

// --- Spend Tracker ---

export type SpendCostType =
  | 'monthly_subscription'
  | 'annual_license'
  | 'one_time'
  | 'api_infrastructure'
  | 'internal_labor';

export interface SpendItem {
  id?: number;
  name: string;
  costType: SpendCostType;
  amount: number;          // raw amount entered by user
  prorateMonths: number;   // 1=monthly, 12=annual, custom for one-time (12/24/36)
  monthlyEquivalent: number; // derived: amount / prorateMonths
  createdAt?: string;
}

// --- Adoption ROI ---

export interface AdoptionSnapshot {
  id?: number;
  adoptionRate: number;       // 0–100 (% of headcount actively using AI)
  headcount: number;          // total employees in the org
  hoursSavedPerUser: number;  // estimated hours/week per AI user
  blendedHourlyRate: number;  // fully-loaded hourly cost per employee (USD)
  recordedAt?: string;
}

// --- Email Preferences ---

export interface EmailPrefs {
  email: string;
  reminderDays: 30 | 60 | 90;
  optedIn: boolean;
  lastRemindedAt?: string;
  registeredAt?: string;
}

// --- Mitigation Tracker ---

export type MitigationStatus = 'not_started' | 'in_progress' | 'complete';
export type MitigationSourceType = 'blind_spot' | 'recommendation' | 'custom';
// 'general' used for custom actions not tied to a specific dimension
export type MitigationDimension = DimensionKey | 'general';

export interface MitigationItem {
  id?: number;
  assessmentId: number;           // FK to completed_assessments.id
  sourceType: MitigationSourceType;
  sourceId?: string;              // questionId for blind_spot items; null for custom
  dimension: MitigationDimension;
  title: string;
  description?: string;
  status: MitigationStatus;
  notes?: string;
  completedAt?: string;           // immutable: set once when status → 'complete', never changed
  createdAt?: string;
}

// --- Assessment History ---

export interface CompletedAssessmentSnapshot {
  id?: number;
  profile: OrganizationProfile;
  overallScore: number;
  riskLevel: RiskLevel;
  dimensionScores: DimensionScore[];
  achieverScore: number;
  blindSpots: BlindSpot[];
  completedAt: string;
  assessmentVersion: number;
}

// --- Wizard State ---

export type WizardStep =
  | 'welcome'
  | 'profile'
  | 'shadowAI'
  | 'vendorRisk'
  | 'dataGovernance'
  | 'securityCompliance'
  | 'aiSpecificRisks'
  | 'roiTracking'
  | 'results';

export interface WizardState {
  currentStep: WizardStep;
  profile: Partial<OrganizationProfile>;
  responses: QuestionResponse[];
  isComplete: boolean;
}

// --- Notification Schedule ---

export interface NotificationSchedule {
  referenceAt: string;  // ISO date — clock start (assessment or email capture, whichever first)
  fired30: boolean;
  fired60: boolean;
  fired90: boolean;
}

// --- License ---

export type LicenseTier = 'free' | 'professional';

export interface LicenseInfo {
  tier: LicenseTier;
  features: string[];
  expiresAt?: string;
  isValid: boolean;
}
