import { create } from 'zustand';
import {
  WizardStep,
  OrganizationProfile,
  QuestionResponse,
  DimensionScore,
  RiskScore,
  BlindSpot,
  Recommendation,
  LicenseTier,
  MaturityLevel,
} from '@/types/assessment';
import { WIZARD_STEPS } from '@/data/dimensions';
import { calculateAllScores } from '@/utils/scoring';
import { generateRecommendations } from '@/utils/recommendations';
import { getQuestionsForProfile } from '@/data/questions/index';

interface AssessmentStore {
  // Wizard state
  currentStep: WizardStep;
  profile: Partial<OrganizationProfile>;
  responses: QuestionResponse[];

  // Results
  dimensionScores: DimensionScore[];
  riskScore: RiskScore | null;
  blindSpots: BlindSpot[];
  recommendations: Recommendation[];

  // License
  licenseTier: LicenseTier;

  // Actions
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (updates: Partial<OrganizationProfile>) => void;
  setResponse: (questionId: string, value: number) => void;
  calculateResults: () => void;
  resetAssessment: () => void;
  getStepIndex: () => number;
  canProceed: () => boolean;
}

const STEP_ORDER: WizardStep[] = WIZARD_STEPS.map((s) => s.key as WizardStep);

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  currentStep: 'welcome',
  profile: {},
  responses: [],
  dimensionScores: [],
  riskScore: null,
  blindSpots: [],
  recommendations: [],
  licenseTier: (import.meta.env.DEV ? 'professional' : 'free') as LicenseTier,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      // Calculate results when moving to results step
      if (nextStep === 'results') {
        get().calculateResults();
      }
      set({ currentStep: nextStep });
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: STEP_ORDER[currentIndex - 1] });
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    }
  },

  updateProfile: (updates) =>
    set((state) => {
      const questionsWillChange =
        ('aiMaturityLevel' in updates && updates.aiMaturityLevel !== state.profile.aiMaturityLevel) ||
        ('operatingRegions' in updates && updates.operatingRegions !== state.profile.operatingRegions);
      return {
        profile: { ...state.profile, ...updates },
        ...(questionsWillChange ? { responses: [] } : {}),
      };
    }),

  setResponse: (questionId, value) =>
    set((state) => {
      const existing = state.responses.findIndex((r) => r.questionId === questionId);
      const responses = [...state.responses];
      if (existing >= 0) {
        responses[existing] = { questionId, value };
      } else {
        responses.push({ questionId, value });
      }
      return { responses };
    }),

  calculateResults: () => {
    const { responses, profile } = get();
    const questions = getQuestionsForProfile(
      (profile as OrganizationProfile).aiMaturityLevel ?? MaturityLevel.Experimenter,
      (profile as OrganizationProfile).operatingRegions ?? []
    );
    const { dimensionScores, riskScore, blindSpots } = calculateAllScores(responses, profile, questions);
    const recommendations = generateRecommendations(
      dimensionScores,
      riskScore,
      profile as OrganizationProfile,
      get().licenseTier
    );
    set({ dimensionScores, riskScore, blindSpots, recommendations });
  },

  resetAssessment: () =>
    set({
      currentStep: 'welcome',
      profile: {},
      responses: [],
      dimensionScores: [],
      riskScore: null,
      blindSpots: [],
      recommendations: [],
    }),

  getStepIndex: () => {
    const { currentStep } = get();
    return STEP_ORDER.indexOf(currentStep);
  },

  canProceed: () => {
    const { currentStep, profile, responses } = get();
    if (currentStep === 'welcome') return true;
    if (currentStep === 'profile') {
      return !!(profile.organizationName && profile.industry && profile.size);
    }
    // For dimension steps, require at least half the questions answered
    const dimensionQuestionCount = 10;
    const dimensionResponses = responses.filter((r) => {
      const prefix = currentStep === 'shadowAI' ? 'shadow'
        : currentStep === 'vendorRisk' ? 'vendor'
        : currentStep === 'dataGovernance' ? 'data'
        : currentStep === 'securityCompliance' ? 'security'
        : currentStep === 'aiSpecificRisks' ? 'airisk'
        : currentStep === 'roiTracking' ? 'roi'
        : '';
      return r.questionId.startsWith(prefix);
    });
    return dimensionResponses.length >= Math.ceil(dimensionQuestionCount / 2);
  },
}));
