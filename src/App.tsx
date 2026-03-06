import { useEffect, useRef, useState } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomePage } from '@/components/wizard/WelcomePage';
import { ProfileStep } from '@/components/wizard/ProfileStep';
import { DimensionStep } from '@/components/wizard/DimensionStep';
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FirstRunGate } from '@/components/legal/FirstRunGate';
import { useAssessmentStore } from '@/store/assessmentStore';
import { initDatabase } from '@/services/db';
import { initContentService } from '@/services/contentService';
import { getLicenseState, tierFromState } from '@/services/license';
import { checkDueReminders } from '@/utils/notifications';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import type { DimensionKey } from '@/types/assessment';

function App() {
  const { currentStep, hydrateDraft, setLicenseTier } = useAssessmentStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [legalAccepted, setLegalAccepted] = useState(true); // assume accepted until store says otherwise

  // ── Staged loading progress ───────────────────────────────────────────────
  // Progress advances through three natural checkpoints in the init sequence:
  //   0  → Database initializing
  //   35 → Database ready; regulatory content loading from CDN or cache
  //   85 → Content loaded; running final checks
  //  100 → Done — brief 300ms pause before the app appears
  const [initProgress, setInitProgress] = useState(0);
  const [initMessage, setInitMessage] = useState('Starting up\u2026');

  // Guard against state updates after the component unmounts (strict mode / fast-refresh)
  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  useEffect(() => {
    aliveRef.current = true; // reset on each mount — fixes React Strict Mode double-invoke race
    const set = (progress: number, message: string) => {
      if (!aliveRef.current) return;
      setInitProgress(progress);
      setInitMessage(message);
    };

    const run = async () => {
      try {
        set(10, 'Initializing database\u2026');
        await initDatabase();

        set(35, 'Loading regulatory content\u2026');
        await Promise.all([hydrateDraft(), initContentService()]);

        set(85, 'Almost ready\u2026');
        await checkDueReminders();

        // Check whether the user has accepted the legal terms
        try {
          const store = await Store.load('settings.json');
          const accepted = await store.get<boolean>('legalAccepted');
          if (aliveRef.current) setLegalAccepted(accepted === true);
        } catch {
          // If store read fails, leave legalAccepted=true so users aren't stuck
        }

        // Restore license tier from store (e.g. beta tester key persisted from last session)
        try {
          const licenseState = await getLicenseState();
          if (aliveRef.current) setLicenseTier(tierFromState(licenseState));
        } catch { /* ignore — default free tier stands */ }

        set(100, 'Ready');
        // Brief pause at 100% so users can see the bar complete before it disappears
        await new Promise((r) => setTimeout(r, 350));
      } catch {
        // Init errors are non-fatal — proceed to the app so users aren't stuck
      } finally {
        if (aliveRef.current) setIsInitializing(false);
      }
    };

    run();
  }, []);

  // ── Deep link handler ────────────────────────────────────────────────────
  // MUST be declared here — before any conditional return — to satisfy the
  // Rules of Hooks (hooks must be called in the same order every render).
  // It is safe to register this before init completes: the handler only
  // writes to Zustand store, which is ready immediately at mount.
  //   aigov://track         → opens the Track Progress tab
  //   aigov://activate?key= → pre-fills the license key in Settings
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
              try {
                useAssessmentStore.getState().setPendingLicenseKey(decodeURIComponent(keyMatch[1]));
              } catch {
                console.warn('Deep link: failed to decode license key param, ignoring.');
              }
            }
          }
        }
      })
        .then((fn) => { unlisten = fn; })
        .catch(() => {});
    }
    return () => { unlisten?.(); };
  }, []);

  // All hooks declared — conditional returns are now safe
  if (isInitializing) {
    return <LoadingScreen progress={initProgress} message={initMessage} />;
  }

  if (!legalAccepted) {
    return <FirstRunGate onAccept={() => setLegalAccepted(true)} />;
  }

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
