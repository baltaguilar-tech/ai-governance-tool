import { useState } from 'react';
import { LicensePanel } from './panels/LicensePanel';
import { EmailPanel } from './panels/EmailPanel';
import { NotificationsPanel } from './panels/NotificationsPanel';
import { AboutPanel } from './panels/AboutPanel';
import { DataPanel } from './panels/DataPanel';

type SettingsSection = 'license' | 'email' | 'notifications' | 'about' | 'data';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  section: SettingsSection;
  label: string;
  icon: React.ReactNode;
}

function KeyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { section: 'license',       label: 'License Key',    icon: <KeyIcon /> },
  { section: 'email',         label: 'Email',          icon: <EnvelopeIcon /> },
  { section: 'notifications', label: 'Notifications',  icon: <BellIcon /> },
  { section: 'about',         label: 'About',          icon: <InfoIcon /> },
  { section: 'data',          label: 'My Data',        icon: <ClipboardIcon /> },
];

function renderPanel(section: SettingsSection) {
  switch (section) {
    case 'license':       return <LicensePanel />;
    case 'email':         return <EmailPanel />;
    case 'notifications': return <NotificationsPanel />;
    case 'about':         return <AboutPanel />;
    case 'data':          return <DataPanel />;
  }
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('license');

  if (!isOpen) return null;

  return (
    <div className="flex h-full shadow-2xl border-r border-white/10 flex-shrink-0">
      {/* Sidebar nav */}
      <nav className="w-56 bg-[#1E2761] text-white flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span className="text-sm font-semibold text-white/90 tracking-wide uppercase">
            Settings
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded"
            title="Close settings"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav items */}
        <ul className="flex-1 py-2">
          {NAV_ITEMS.map(({ section, label, icon }) => (
            <li key={section}>
              <button
                type="button"
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${
                  activeSection === section
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{icon}</span>
                <span>{label}</span>
                {activeSection === section && (
                  <span className="ml-auto w-1 h-4 bg-blue-400 rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-xs text-white/40">v0.1.0</p>
        </div>
      </nav>

      {/* Content panel */}
      <div className="w-96 bg-white border-r border-gray-200 h-full overflow-y-auto">
        {renderPanel(activeSection)}
      </div>
    </div>
  );
}
