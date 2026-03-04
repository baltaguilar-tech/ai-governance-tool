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
 * Props:
 *   progress  0–100 integer driving the progress bar fill
 *   message   Short status string shown below the progress bar
 */

interface LoadingScreenProps {
  progress: number;
  message: string;
}

export function LoadingScreen({ progress, message }: LoadingScreenProps) {
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, rgba(43,92,255,0.18) 0%, transparent 60%), #02093A',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        userSelect: 'none',
      }}
    >
      {/* ── Brand mark ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        {/* Shield icon with gradient — placeholder for logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: 'rgba(43,92,255,0.12)',
            border: '1px solid rgba(43,92,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 32px rgba(43,92,255,0.2)',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2B5CFF" />
                <stop offset="100%" stopColor="#00C48C" />
              </linearGradient>
            </defs>
            {/* Shield body */}
            <path
              d="M32 4L8 14v18c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V14L32 4z"
              fill="rgba(43,92,255,0.15)"
              stroke="url(#shield-grad)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path
              d="M22 32l7 7 13-14"
              stroke="url(#shield-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Product name + tagline */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.4px',
            }}
          >
            AI Governance and ROI Assessment
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 13,
              fontWeight: 400,
              margin: '8px 0 0',
              letterSpacing: '0.1px',
              fontStyle: 'italic',
            }}
          >
            Know your AI risk. Before it knows you.
          </p>
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div style={{ width: 300 }}>
        {/* Track */}
        <div
          style={{
            background: 'rgba(43,92,255,0.15)',
            borderRadius: 6,
            height: 5,
            overflow: 'hidden',
          }}
        >
          {/* Fill — gradient blue → green as loading completes */}
          <div
            style={{
              background: 'linear-gradient(90deg, #2B5CFF, #00C48C)',
              borderRadius: 6,
              height: '100%',
              width: `${pct}%`,
              transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 8px rgba(43,92,255,0.5)',
            }}
          />
        </div>

        {/* Status message + percentage */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
              margin: 0,
            }}
          >
            {message}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.3)',
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
