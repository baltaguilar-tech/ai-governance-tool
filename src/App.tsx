import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomePage } from '@/components/wizard/WelcomePage';
import { ProfileStep } from '@/components/wizard/ProfileStep';
import { DimensionStep } from '@/components/wizard/DimensionStep';
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAssessmentStore } from '@/store/assessmentStore';
import { initDatabase } from '@/services/db';
import { initContentService } from '@/services/contentService';
import { checkDueReminders } from '@/utils/notifications';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import type { DimensionKey } from '@/types/assessment';

function App() {
  const { currentStep, hydrateDraft } = useAssessmentStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initDatabase()
      .then(() => Promise.all([hydrateDraft(), initContentService()]))
      .then(() => checkDueReminders())
      .catch(() => {})
      .finally(() => setIsInitializing(false));
  }, []);

  if (isInitializing) {
    return (
      <div style={{ background: '#1E2761', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, system-ui, sans-serif' }}>
        <p style={{ color: '#CADCFC', fontSize: '20px', fontWeight: 600, margin: '0 0 20px' }}>AI Governance Assessment</p>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(202,220,252,0.2)', borderTopColor: '#CADCFC', borderRadius: '50%', animation: 'ai-spin 0.8s linear infinite' }} />
        <p style={{ color: 'rgba(202,220,252,0.6)', fontSize: '13px', margin: '16px 0 0' }}>Initializing...</p>
      </div>
    );
  }

  // Register deep link handler — aigov://track opens the Track Progress tab
  useEffect(() => {
    let unlisten: (() => void) | null = null;
    if ('__TAURI_INTERNALS__' in window) {
      onOpenUrl((urls) => {
        for (const url of urls) {
          if (url.startsWith('aigov://track')) {
            useAssessmentStore.getState().setPendingDeepLinkTab('progress');
          } else if (url.startsWith('aigov://activate')) {
            // QR activation flow: phone scans QR → opens aigov://activate?key=XXXX
            // Pre-fills the license key input in LicensePanel (Settings → License Key)
            const keyMatch = url.match(/[?&]key=([^&]+)/);
            if (keyMatch?.[1]) {
              useAssessmentStore.getState().setPendingLicenseKey(decodeURIComponent(keyMatch[1]));
            }
          }
        }
      })
        .then((fn) => { unlisten = fn; })
        .catch(() => {});
    }
    return () => { unlisten?.(); };
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
