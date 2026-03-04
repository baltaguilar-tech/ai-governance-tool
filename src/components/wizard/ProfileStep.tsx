import { useState } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import {
  Industry,
  CompanySize,
  Region,
  MaturityLevel,
  AIUseCase,
  DeploymentTimeline,
} from '@/types/assessment';

const PRIMARY_LOCATION_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Netherlands', 'Ireland', 'Sweden',
  'Denmark', 'Finland', 'Norway', 'Belgium', 'Spain', 'Italy',
  'Switzerland', 'Austria', 'Poland',
  'Singapore', 'Japan', 'South Korea', 'India', 'Hong Kong', 'New Zealand',
  'UAE', 'Saudi Arabia', 'Israel', 'South Africa',
  'Brazil', 'Mexico',
];

export function ProfileStep() {
  const { profile, updateProfile, nextStep, prevStep, canProceed } = useAssessmentStore();

  const [locationSelect, setLocationSelect] = useState(() => {
    if (!profile.primaryLocation) return '';
    if (PRIMARY_LOCATION_COUNTRIES.includes(profile.primaryLocation)) return profile.primaryLocation;
    return '__other__';
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-light-text mb-2">Organization Profile</h2>
      <p className="text-light-muted mb-6">
        Tell us about your organization so we can tailor the assessment and recommendations
        to your industry, size, and regulatory environment.
      </p>

      <div className="space-y-6">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Organization Name <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            value={profile.organizationName || ''}
            onChange={(e) => updateProfile({ organizationName: e.target.value })}
            placeholder="Your organization name"
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text placeholder-light-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Industry <span className="text-accent-red">*</span>
          </label>
          <select
            value={profile.industry || ''}
            onChange={(e) => updateProfile({ industry: e.target.value as Industry })}
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select your industry</option>
            {Object.values(Industry).map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Organization Size <span className="text-accent-red">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(CompanySize).map((size) => (
              <button
                key={size}
                onClick={() => updateProfile({ size })}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  profile.size === size
                    ? 'border-accent-blue bg-accent-blue/8 text-accent-blue'
                    : 'border-navy-200 bg-white text-light-text hover:border-navy-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Revenue */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Annual Revenue (optional)
          </label>
          <select
            value={profile.annualRevenue || ''}
            onChange={(e) => updateProfile({ annualRevenue: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Prefer not to say</option>
            <option value="Under $10M">Under $10M</option>
            <option value="$10M-$50M">$10M-$50M</option>
            <option value="$50M-$250M">$50M-$250M</option>
            <option value="$250M-$1B">$250M-$1B</option>
            <option value="Over $1B">Over $1B</option>
          </select>
        </div>

        {/* Primary Location */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Primary Location
          </label>
          <select
            value={locationSelect}
            onChange={(e) => {
              const val = e.target.value;
              setLocationSelect(val);
              if (val !== '__other__') {
                updateProfile({ primaryLocation: val });
              } else {
                updateProfile({ primaryLocation: '' });
              }
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select your primary location</option>
            {PRIMARY_LOCATION_COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
            <option value="__other__">Other</option>
          </select>
          {locationSelect === '__other__' && (
            <input
              type="text"
              value={profile.primaryLocation || ''}
              onChange={(e) => updateProfile({ primaryLocation: e.target.value })}
              placeholder="Enter your country or region"
              className="mt-2 w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text placeholder-light-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
              autoFocus
            />
          )}
        </div>

        {/* Operating Regions */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Operating Regions (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Region).map((region) => {
              const selected = profile.operatingRegions?.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => {
                    const current = profile.operatingRegions || [];
                    updateProfile({
                      operatingRegions: selected
                        ? current.filter((r) => r !== region)
                        : [...current, region],
                    });
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-accent-blue text-white'
                      : 'bg-navy-100 text-light-muted hover:bg-navy-200'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Maturity */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            AI Maturity Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { level: MaturityLevel.Experimenter, desc: 'Exploring AI possibilities' },
              { level: MaturityLevel.Builder, desc: 'Building initial AI projects' },
              { level: MaturityLevel.Innovator, desc: 'Scaling AI across the org' },
              { level: MaturityLevel.Achiever, desc: '30%+ revenue from AI' },
            ].map(({ level, desc }) => (
              <button
                key={level}
                onClick={() => updateProfile({ aiMaturityLevel: level })}
                className={`px-4 py-3 rounded-lg border text-left transition-colors ${
                  profile.aiMaturityLevel === level
                    ? 'border-accent-blue bg-accent-blue/8'
                    : 'border-navy-200 bg-white hover:border-navy-300'
                }`}
              >
                <div className={`text-sm font-semibold ${profile.aiMaturityLevel === level ? 'text-accent-blue' : 'text-light-text'}`}>
                  {level}
                </div>
                <div className="text-xs text-light-muted mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Use Cases */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            AI Use Cases (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(AIUseCase).map((uc) => {
              const selected = profile.aiUseCases?.includes(uc);
              return (
                <button
                  key={uc}
                  onClick={() => {
                    const current = profile.aiUseCases || [];
                    updateProfile({
                      aiUseCases: selected
                        ? current.filter((u) => u !== uc)
                        : [...current, uc],
                    });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-accent-blue text-white'
                      : 'bg-navy-100 text-light-muted hover:bg-navy-200'
                  }`}
                >
                  {uc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deployment Timeline */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            AI Deployment Timeline
          </label>
          <select
            value={profile.deploymentTimeline || ''}
            onChange={(e) => updateProfile({ deploymentTimeline: e.target.value as DeploymentTimeline })}
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select timeline</option>
            {Object.values(DeploymentTimeline).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Expected AI Spend */}
        <div>
          <label className="block text-sm font-medium text-light-text mb-1">
            Expected Annual AI Spend
          </label>
          <select
            value={profile.expectedAISpend || ''}
            onChange={(e) => updateProfile({ expectedAISpend: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-light-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select range</option>
            <option value="Under $100K">Under $100K</option>
            <option value="$100K-$500K">$100K-$500K</option>
            <option value="$500K-$2M">$500K-$2M</option>
            <option value="$2M-$10M">$2M-$10M</option>
            <option value="Over $10M">Over $10M</option>
          </select>
        </div>
      </div>

      {/* Navigation — sticky so Back/Continue are always visible */}
      <div className="sticky bottom-0 bg-light-bg border-t border-navy-100 -mx-6 px-6 flex justify-between pt-4 pb-4 mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg border border-navy-200 text-light-muted font-medium hover:bg-navy-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed()}
          className="px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2B5CFF 0%, #1A44CC 100%)' }}
        >
          Continue to Assessment
        </button>
      </div>
    </div>
  );
}
