import { useAssessmentStore } from '@/store/assessmentStore';
import type { OrganizationProfile } from '@/types/assessment';

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">{label}</p>
      <p className="text-sm text-navy-900 font-medium">{value || '\u2014'}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-3">
      {children}
    </h3>
  );
}

function hasProfileData(profile: Partial<OrganizationProfile>): boolean {
  return !!(profile.organizationName && profile.organizationName.trim().length > 0);
}

export function DataPanel() {
  const profile = useAssessmentStore((s) => s.profile);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-navy-900">My Organization Data</h2>
        <p className="text-sm text-gray-500 mt-0.5">A summary of your current assessment profile.</p>
      </div>

      {!hasProfileData(profile) ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          </svg>
          <p className="text-sm text-gray-400 max-w-xs">
            No assessment data found. Complete an assessment to see your organization profile here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1 — Organization */}
          <div>
            <SectionHeading>Organization</SectionHeading>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label="Organization Name"
                value={profile.organizationName ?? ''}
              />
              <Field
                label="Industry"
                value={profile.industry ?? ''}
              />
              <Field
                label="Company Size"
                value={profile.size ?? ''}
              />
              <Field
                label="Annual Revenue"
                value={profile.annualRevenue ?? ''}
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 2 — AI Profile */}
          <div>
            <SectionHeading>AI Profile</SectionHeading>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label="AI Maturity Level"
                value={profile.aiMaturityLevel ?? ''}
              />
              <Field
                label="AI Use Cases"
                value={
                  profile.aiUseCases && profile.aiUseCases.length > 0
                    ? profile.aiUseCases.join(', ')
                    : ''
                }
              />
              <Field
                label="Deployment Timeline"
                value={profile.deploymentTimeline ?? ''}
              />
              <Field
                label="Expected AI Spend"
                value={profile.expectedAISpend ?? ''}
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 3 — Scope */}
          <div>
            <SectionHeading>Scope</SectionHeading>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label="Primary Location"
                value={profile.primaryLocation ?? ''}
              />
              <Field
                label="Operating Regions"
                value={
                  profile.operatingRegions && profile.operatingRegions.length > 0
                    ? profile.operatingRegions.join(', ')
                    : ''
                }
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            To update your organization profile, start a new assessment from the beginning.
          </p>
        </div>
      )}
    </div>
  );
}
