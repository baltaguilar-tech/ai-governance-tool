import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomePage } from '@/components/wizard/WelcomePage';
import { ProfileStep } from '@/components/wizard/ProfileStep';
import { DimensionStep } from '@/components/wizard/DimensionStep';
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { useAssessmentStore } from '@/store/assessmentStore';
import type { DimensionKey } from '@/types/assessment';

function App() {
  const { currentStep } = useAssessmentStore();

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomePage />;
      case 'profile':
        return <ProfileStep />;
      case 'results':
        return <ResultsDashboard />;
      default:
        return <DimensionStep dimensionKey={currentStep as DimensionKey} />;
    }
  };

  return (
    <AppLayout>
      {renderStep()}
    </AppLayout>
  );
}

export default App;
