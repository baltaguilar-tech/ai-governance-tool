import { useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { Settings } from '../settings/Settings';
import { useAssessmentStore } from '@/store/assessmentStore';

// Steps that render on a dark background (bg-dark-base fills <main>)
// Results is intentionally excluded — it gets a hybrid dark/light treatment in Phase 6
const DARK_STEPS = new Set(['welcome']);

interface AppLayoutProps {
  children: React.ReactNode;
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { currentStep } = useAssessmentStore();
  const isDark = DARK_STEPS.has(currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — deep navy chrome, full width */}
      <header className="bg-dark-base text-white px-6 py-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* Hamburger — left of logo */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen((o) => !o)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded mr-1"
              title={isSettingsOpen ? 'Close settings' : 'Open settings'}
              aria-label={isSettingsOpen ? 'Close settings' : 'Open settings'}
            >
              <HamburgerIcon />
            </button>
            {/* Logo placeholder — replace when brand mark is ready */}
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">AI Governance & ROI</h1>
              <p className="text-xs text-white/50">Assessment Tool v0.1.0</p>
            </div>
          </div>
          <div className="text-xs text-white/40">
            Your data never leaves this device
          </div>
        </div>
      </header>

      {/* Body — Settings sidebar pushes main content right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings: sidebar nav + panel (push — flex sibling of main) */}
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Main content column — clicking anywhere here closes the settings panel */}
        <div
          className="flex flex-col flex-1 min-w-0"
          onClick={isSettingsOpen ? () => setIsSettingsOpen(false) : undefined}
        >
          <ProgressStepper />

          {/* Dark screens: children control their own layout and centering.
              Light screens: constrained wrapper with standard padding. */}
          <main className={`flex-1 overflow-y-auto ${isDark ? 'bg-dark-base' : 'bg-light-bg'}`}>
            {isDark ? (
              children
            ) : (
              <div className="max-w-4xl mx-auto w-full px-6 py-8">
                {children}
              </div>
            )}
          </main>

          {/* Footer — matches header chrome */}
          <footer className="bg-dark-base text-white/40 text-xs text-center py-3 flex-shrink-0">
            &copy; 2026 baltaguilar-tech &middot; Assessment data is stored locally and never transmitted
          </footer>
        </div>
      </div>
    </div>
  );
}
