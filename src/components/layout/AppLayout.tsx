import { useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { Settings } from '../settings/Settings';

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

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Header — full width */}
      <header className="bg-navy-900 text-white px-6 py-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* Hamburger — left of logo */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen((o) => !o)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded mr-1"
              title={isSettingsOpen ? 'Close settings' : 'Open settings'}
              aria-label={isSettingsOpen ? 'Close settings' : 'Open settings'}
            >
              <HamburgerIcon />
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">AI Governance & ROI</h1>
              <p className="text-xs text-navy-300">Assessment Tool v0.1.0</p>
            </div>
          </div>
          <div className="text-xs text-navy-400">
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

        {/* Main content column */}
        <div className="flex flex-col flex-1 min-w-0">
          <ProgressStepper />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full px-6 py-8">
              {children}
            </div>
          </main>
          <footer className="bg-navy-900 text-navy-400 text-xs text-center py-3 flex-shrink-0">
            &copy; 2026 baltaguilar-tech &middot; Assessment data is stored locally and never transmitted
          </footer>
        </div>
      </div>
    </div>
  );
}
