import { ProgressStepper } from './ProgressStepper';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Header */}
      <header className="bg-navy-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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

      {/* Progress */}
      <ProgressStepper />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-navy-400 text-xs text-center py-3">
        &copy; 2026 baltaguilar-tech &middot; Assessment data is stored locally and never transmitted
      </footer>
    </div>
  );
}
