# AI Governance & ROI Assessment Tool - Architecture

## Overview
A commercial desktop application built with Tauri v2 + React + TypeScript that guides organizations through comprehensive AI governance assessment and ROI measurement.

## Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Desktop Framework | Tauri v2.10+ | Rust backend, system WebView frontend |
| Frontend | React 19 + TypeScript | UI components and state management |
| Build Tool | Vite 7 | Fast HMR, optimized production builds |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Charts | Recharts | Radar chart, gauges, bar charts |
| State | Zustand | Lightweight state management |
| Database | SQLite (tauri-plugin-sql) | Assessment data, org profiles |
| Settings | tauri-plugin-store | App preferences (JSON) |
| Updates | tauri-plugin-updater | App binary auto-updates |
| Export | jsPDF + jspdf-autotable | PDF report generation |

## Project Structure
```
ai-governance-tool/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/               # AppLayout, ProgressStepper
│   │   ├── wizard/               # WelcomePage, ProfileStep, DimensionStep
│   │   ├── dashboard/            # ResultsDashboard, RiskGauge, DimensionRadar
│   │   ├── common/               # Shared UI components
│   │   └── export/               # PDF/DOCX export components
│   ├── data/
│   │   ├── dimensions.ts         # 6 dimension configs with weights
│   │   └── questions.ts          # 60 assessment questions
│   ├── store/
│   │   └── assessmentStore.ts    # Zustand store (wizard state, results)
│   ├── types/
│   │   └── assessment.ts         # TypeScript interfaces and enums
│   ├── utils/
│   │   ├── scoring.ts            # Scoring engine (weighted calculation)
│   │   └── recommendations.ts    # Recommendation engine
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind + custom theme
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   └── lib.rs                # Plugin registration
│   ├── capabilities/
│   │   └── default.json          # Scoped permissions
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # App configuration
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

## Assessment Flow
```
Welcome → Org Profile → 6 Dimensions (10 Qs each) → Results Dashboard
```

### 6 Assessment Dimensions
| # | Dimension | Weight | Questions |
|---|-----------|--------|-----------|
| 1 | Shadow AI & Visibility Control | 25% | 10 |
| 2 | Vendor AI Risk Management | 25% | 10 |
| 3 | Data Governance & Privacy | 20% | 10 |
| 4 | Security & Compliance | 15% | 10 |
| 5 | AI-Specific Risks | 10% | 10 |
| 6 | ROI & Performance Tracking | 5% | 10 |

### Scoring Algorithm
```
Overall Risk = Σ (Dimension Score × Weight)

Each question: 0 (best) to 100 (worst)
Dimension Score = Average of question scores
Risk Levels: Low (0-30), Medium (31-60), High (61-80), Critical (81-100)
Achiever Score = max(0, 100 - Overall Risk + Maturity Bonus)
```

## Freemium Model
| Feature | Free | Pro |
|---------|------|-----|
| Full 60-question assessment | Yes | Yes |
| Overall risk score | Yes | Yes |
| Top 3 blind spots | Yes | All |
| Generic recommendations | Yes | Customized |
| Basic ROI tracking | Yes | 5-dimension dashboard |
| 1-page PDF summary | Yes | Full report |
| DOCX export | No | Yes |
| Assessment history | No | Yes |
| Vendor questionnaire | 5 sample | 30 customized |

## Dual Update System
1. **App updates**: Tauri built-in updater via GitHub Releases
2. **Content updates**: Custom HTTP fetch for questions, regulations, scoring weights (JSON)

## Security
- Deny-by-default Tauri permissions (scoped to $APPDATA, $RESOURCE)
- No Node.js access from frontend
- All system access through Rust IPC
- Data never leaves the device (offline-first)
- CSP enforced for all web content

## Future Phases
- Phase 2: SQLite persistence, assessment history, PDF export
- Phase 3: Licensing via Keygen.sh, payment processing
- Phase 4: Content update server, regulatory deadline tracking
- Phase 5: Code signing (Apple + Windows), distribution via CrabNebula
