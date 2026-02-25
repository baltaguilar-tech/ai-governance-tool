import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomePage } from '@/components/wizard/WelcomePage';
import { ProfileStep } from '@/components/wizard/ProfileStep';
import { DimensionStep } from '@/components/wizard/DimensionStep';
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAssessmentStore } from '@/store/assessmentStore';
import { initDatabase } from '@/services/db';
import { checkDueReminders } from '@/utils/notifications';
import type { DimensionKey } from '@/types/assessment';

function App() {
  const { currentStep, hydrateDraft } = useAssessmentStore();

  useEffect(() => {
    initDatabase()
      .then(() => hydrateDraft())
      .then(() => checkDueReminders())
      .catch(() => {});
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <ErrorBoundary scope="the welcome screen">
            <WelcomePage />
          </ErrorBoundary>
        );
      case 'profile':
        return (
          <ErrorBoundary scope="the profile step">
            <ProfileStep />
          </ErrorBoundary>
        );
      case 'results':
        return (
          <ErrorBoundary scope="the results dashboard">
            <ResultsDashboard />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary scope={`the ${currentStep} assessment step`}>
            <DimensionStep dimensionKey={currentStep as DimensionKey} />
          </ErrorBoundary>
        );
    }
  };

  return (
    <AppLayout>
      {renderStep()}
    </AppLayout>
  );
}

export default App;
