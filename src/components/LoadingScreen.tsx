/**
 * LoadingScreen.tsx
 *
 * Full-screen initialization screen shown at app launch while the database
 * and CDN content service are warming up. Displayed instead of a blank window
 * so first-time users know the app is actively loading — not frozen.
 *
 * Shown in App.tsx during the three-stage init sequence:
 *   Stage 1 (0–35%):  Database initializing
 *   Stage 2 (35–85%): Regulatory content loading from CDN (or SQLite cache)
 *   Stage 3 (85–100%): Finalizing, then brief pause before app appears
 *
 * Design is intentionally minimal — colors, copy, and icon can be updated
 * during the UI redesign phase (Phase 5) without changing any logic here.
 *
 * Props:
 *   progress  0–100 integer driving the progress bar fill
 *   message   Short status string shown below the progress bar
 */

interface LoadingScreenProps {
  progress: number;
  message: string;
}

export function LoadingScreen({ progress, message }: LoadingScreenProps) {
  // Clamp progress to 0–100 so callers don't need to worry about over/underflow
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <div
      style={{
        background: '#1E2761',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* ── Brand mark ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Shield icon — placeholder for Phase 5 logo swap */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Shield body */}
          <path
            d="M32 4L8 14v18c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V14L32 4z"
            fill="rgba(202,220,252,0.12)"
            stroke="#CADCFC"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Checkmark */}
          <path
            d="M22 32l7 7 13-14"
            stroke="#CADCFC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Product name */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            AI Governance Assessment
          </p>
          <p
            style={{
              color: 'rgba(202,220,252,0.55)',
              fontSize: 13,
              fontWeight: 400,
              margin: '6px 0 0',
              letterSpacing: '0.2px',
            }}
          >
            Enterprise AI Risk &amp; ROI Platform
          </p>
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div style={{ width: 300 }}>
        {/* Track */}
        <div
          style={{
            background: 'rgba(202,220,252,0.15)',
            borderRadius: 4,
            height: 5,
            overflow: 'hidden',
          }}
        >
          {/* Fill — CSS transition gives the smooth animated feel */}
          <div
            style={{
              background: '#CADCFC',
              borderRadius: 4,
              height: '100%',
              width: `${pct}%`,
              transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Status message + percentage */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <p
            style={{
              color: 'rgba(202,220,252,0.55)',
              fontSize: 12,
              margin: 0,
            }}
          >
            {message}
          </p>
          <p
            style={{
              color: 'rgba(202,220,252,0.4)',
              fontSize: 12,
              margin: 0,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pct}%
          </p>
        </div>
      </div>
    </div>
  );
}
