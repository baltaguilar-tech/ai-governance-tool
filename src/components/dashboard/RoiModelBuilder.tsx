import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { getRoiTasks, saveRoiTask, deleteRoiTask, getRoiModel, saveRoiModel } from '@/services/db';
import { CompanySize } from '@/types/assessment';
import type { RoiTask, RoiModelData, OrganizationProfile } from '@/types/assessment';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Task Baseline', 'Efficiency', 'Revenue', 'Risk', 'Hidden Costs', 'Results'];

const UTILIZATION_CURVE: Record<1 | 2 | 3, number> = { 1: 0.5, 2: 0.8, 3: 1.0 };

const RISK_CATEGORIES = [
  { key: 'compliance',     label: 'Regulatory Compliance Fines',    defaultExposure: 500000 },
  { key: 'fraud',          label: 'Fraud & Financial Loss',          defaultExposure: 300000 },
  { key: 'data_breach',    label: 'Data Breach & Privacy Incident',  defaultExposure: 250000 },
  { key: 'process_errors', label: 'Process Errors & Rework',         defaultExposure: 100000 },
  { key: 'hallucination',  label: 'AI Hallucination Liability',       defaultExposure: 150000 },
];

const HIDDEN_COST_CATEGORIES = [
  { key: 'data_prep',    label: 'Data cleaning & preparation',   hint: 'Typically 20–40% of total project cost' },
  { key: 'integration',  label: 'Integration & middleware',       hint: '$70K–$250K for legacy system connections' },
  { key: 'training',     label: 'Training & change management',  hint: 'Typically 20–30% of total project costs' },
  { key: 'retraining',   label: 'Annual model retraining',       hint: '15–25% of initial dev cost per year' },
  { key: 'risk_reserve', label: 'Risk reserve (contingency)',    hint: '10–15% of annual AI operating budget' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(v: number): string {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function defaultHeadcount(size?: string): string {
  switch (size) {
    case CompanySize.Small:      return '125';
    case CompanySize.Medium:     return '500';
    case CompanySize.Large:      return '1000';
    case CompanySize.Enterprise: return '5000';
    default: return '';
  }
}

function inputClass(extra = '') {
  return `w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761] ${extra}`;
}

function labelClass() {
  return 'block text-xs font-semibold text-navy-700 mb-1';
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

interface CalcResults {
  p1Adjusted: number;
  p2: number;
  p3: number;
  totalBenefits: number;
  annualSpend: number;
  totalHidden: number;
  totalTCO: number;
  scenarios: { conservative: number; realistic: number; optimistic: number };
  scenarioPct: { conservative: number; realistic: number; optimistic: number };
}

function calculate(tasks: RoiTask[], model: RoiModelData, monthlySpend: number): CalcResults {
  const util = UTILIZATION_CURVE[model.utilizationYear] ?? 1.0;

  // Pillar 1 — Efficiency (utilization curve applied)
  let p1Gross = 0;
  for (const t of tasks) {
    const hrsSaved = Math.max(0, t.hoursBefore - t.hoursAfter);
    const workers = model.headcount * (t.workforcePct / 100) * (model.adoptionRate / 100);
    p1Gross += workers * hrsSaved * 52 * model.blendedHourlyRate;
  }
  const p1Adjusted = p1Gross * util;

  // Pillar 2 — Revenue (utilization curve applied)
  const p2 = model.annualRevenue * (model.revenueUpliftPct / 100) * util;

  // Pillar 3 — Risk (no utilization curve — it's a constant annual expected-value delta)
  const p3 = model.riskExposure * Math.max(0, (model.riskProbBefore - model.riskProbAfter) / 100);

  const totalBenefits = p1Adjusted + p2 + p3;
  const annualSpend = monthlySpend * 12;
  const totalHidden = Object.values(model.hiddenCosts).reduce((s, v) => s + (v || 0), 0);
  const totalTCO = annualSpend + totalHidden;

  // Scenario multipliers applied to all gross benefits; costs are fixed
  const scenarioBenefits = {
    conservative: totalBenefits * 0.6,
    realistic:    totalBenefits * 1.0,
    optimistic:   totalBenefits * 1.4,
  };
  const scenarios = {
    conservative: scenarioBenefits.conservative - totalTCO,
    realistic:    scenarioBenefits.realistic    - totalTCO,
    optimistic:   scenarioBenefits.optimistic   - totalTCO,
  };
  const scenarioPct = {
    conservative: totalTCO > 0 ? (scenarios.conservative / totalTCO) * 100 : 0,
    realistic:    totalTCO > 0 ? (scenarios.realistic    / totalTCO) * 100 : 0,
    optimistic:   totalTCO > 0 ? (scenarios.optimistic   / totalTCO) * 100 : 0,
  };

  return { p1Adjusted, p2, p3, totalBenefits, annualSpend, totalHidden, totalTCO, scenarios, scenarioPct };
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, onStepClick }: { step: number; onStepClick: (i: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-6 overflow-x-auto pb-1">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className="flex flex-col items-center">
            <div
              onClick={() => i < step && onStepClick(i)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                i < step  ? 'bg-[#1E2761] border-[#1E2761] text-white cursor-pointer hover:opacity-80'
                : i === step ? 'bg-white border-[#1E2761] text-[#1E2761]'
                : 'bg-white border-navy-200 text-navy-400'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium text-center w-14 leading-tight ${
              i === step ? 'text-[#1E2761]' : 'text-navy-400'
            }`}>{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`h-0.5 w-5 mx-0.5 mb-4 shrink-0 ${i < step ? 'bg-[#1E2761]' : 'bg-navy-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 0: Task Baseline ────────────────────────────────────────────────────

function TaskStep({ tasks, onRefresh }: { tasks: RoiTask[]; onRefresh: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [hoursBefore, setHoursBefore] = useState('');
  const [hoursAfter, setHoursAfter] = useState('');
  const [workforcePct, setWorkforcePct] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); // collapsed when tasks exist

  const canAdd =
    name.trim().length > 0 &&
    parseFloat(hoursBefore) > 0 &&
    parseFloat(hoursAfter) >= 0 &&
    parseFloat(workforcePct) > 0;

  async function handleAdd() {
    if (!canAdd) return;
    setAdding(true);
    await saveRoiTask({
      name: name.trim(),
      hoursBefore: parseFloat(hoursBefore),
      hoursAfter: parseFloat(hoursAfter),
      workforcePct: parseFloat(workforcePct),
    });
    setName(''); setHoursBefore(''); setHoursAfter(''); setWorkforcePct('');
    await onRefresh();
    setAdding(false);
    setShowForm(false);
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    await deleteRoiTask(id);
    await onRefresh();
    setDeleting(null);
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">Before-AI Task Baseline</h3>
        <p className="text-navy-500 text-xs mt-1">
          Add each task where AI is saving time. Record how long it took before and after AI was introduced.
          This creates a defensible, auditable baseline — not a guess.
          Start with one task; you can add more to build a complete picture.
        </p>
      </div>

      {tasks.length > 0 && (
        <div className="mb-4 space-y-2">
          {tasks.map(t => {
            const saved = Math.max(0, t.hoursBefore - t.hoursAfter);
            return (
              <div key={t.id} className="flex items-center justify-between bg-navy-50 rounded-lg px-3 py-2.5 text-sm">
                <div>
                  <span className="font-medium text-navy-900">{t.name}</span>
                  <span className="text-navy-500 ml-2 text-xs">
                    {t.workforcePct}% of workforce · {saved.toFixed(1)} hrs/wk saved per worker
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="text-red-400 hover:text-red-600 text-xs ml-3 disabled:opacity-40"
                >
                  {deleting === t.id ? '...' : 'Remove'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tasks.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full text-sm text-[#1E2761] font-medium border border-dashed border-navy-300 rounded-lg py-2.5 hover:bg-navy-50 transition-colors mb-4"
        >
          + Add another task
        </button>
      )}

      {(tasks.length === 0 || showForm) && (
      <div className="bg-white rounded-lg border border-navy-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-navy-700">Add a Task</p>
          {showForm && tasks.length > 0 && (
            <button onClick={() => setShowForm(false)} className="text-xs text-navy-400 hover:text-navy-600">Cancel</button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="sm:col-span-2">
            <label className={labelClass()}>Task name</label>
            <input
              className={inputClass()}
              placeholder="e.g. Drafting client emails, weekly status reports"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass()}>Hours/week before AI</label>
            <input
              type="number" min="0" step="0.5"
              className={inputClass()}
              placeholder="e.g. 4"
              value={hoursBefore}
              onChange={e => setHoursBefore(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass()}>Hours/week with AI</label>
            <input
              type="number" min="0" step="0.5"
              className={inputClass()}
              placeholder="e.g. 1"
              value={hoursAfter}
              onChange={e => setHoursAfter(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass()}>% of workforce that does this task</label>
            <input
              type="number" min="1" max="100" step="1"
              className={inputClass()}
              placeholder="e.g. 60"
              value={workforcePct}
              onChange={e => setWorkforcePct(e.target.value)}
            />
            <p className="text-xs text-navy-400 mt-1">
              What % of your total headcount performs this task at least weekly?
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!canAdd || adding}
          className="bg-[#1E2761] text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40 hover:bg-navy-800 transition-colors"
        >
          {adding ? 'Adding...' : '+ Add Task'}
        </button>
      </div>
      )}

      {tasks.length === 0 && (
        <p className="text-xs text-navy-400 mt-3 text-center italic">
          Add at least one task to proceed. One is enough to get a meaningful result.
        </p>
      )}
    </div>
  );
}

// ─── Step 1: Efficiency ───────────────────────────────────────────────────────

interface EfficiencyStepProps {
  headcount: string; setHeadcount: (v: string) => void;
  adoptionRate: string; setAdoptionRate: (v: string) => void;
  blendedHourlyRate: string; setBlendedHourlyRate: (v: string) => void;
  utilizationYear: 1 | 2 | 3; setUtilizationYear: (v: 1 | 2 | 3) => void;
}

function EfficiencyStep({
  headcount, setHeadcount,
  adoptionRate, setAdoptionRate,
  blendedHourlyRate, setBlendedHourlyRate,
  utilizationYear, setUtilizationYear,
}: EfficiencyStepProps) {
  const util = UTILIZATION_CURVE[utilizationYear];
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">Efficiency Inputs (Pillar 1)</h3>
        <p className="text-navy-500 text-xs mt-1">
          Headcount is pre-filled from your organization size profile — update it to your actual count.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass()}>Total headcount</label>
          <input
            type="number" min="1"
            className={inputClass()}
            value={headcount}
            onChange={e => setHeadcount(e.target.value)}
            placeholder="e.g. 1050"
          />
          <p className="text-xs text-navy-400 mt-1">
            Estimated from your org size selection. Edit to match your actual employee count.
          </p>
        </div>
        <div>
          <label className={labelClass()}>AI adoption rate (%)</label>
          <input
            type="number" min="0" max="100"
            className={inputClass()}
            value={adoptionRate}
            onChange={e => setAdoptionRate(e.target.value)}
            placeholder="e.g. 40"
          />
          <p className="text-xs text-navy-400 mt-1">
            % of employees actively using AI tools at least weekly.
          </p>
        </div>
        <div>
          <label className={labelClass()}>Blended hourly rate ($)</label>
          <input
            type="number" min="0" step="1"
            className={inputClass()}
            value={blendedHourlyRate}
            onChange={e => setBlendedHourlyRate(e.target.value)}
            placeholder="e.g. 75"
          />
          <p className="text-xs text-navy-400 mt-1">
            Fully-loaded cost: salary + benefits (typically 1.3× base) ÷ 2,080 hrs.
          </p>
        </div>
        <div>
          <label className={labelClass()}>Measurement year</label>
          <select
            className={inputClass('bg-white')}
            value={utilizationYear}
            onChange={e => setUtilizationYear(parseInt(e.target.value) as 1 | 2 | 3)}
          >
            <option value={1}>Year 1 — Ramp-up</option>
            <option value={2}>Year 2 — Optimizing</option>
            <option value={3}>Year 3 — Mature</option>
          </select>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-800 mb-1">Why we apply a utilization curve</p>
        <p className="text-xs text-blue-700 leading-relaxed">
          AI investments rarely deliver 100% of projected value immediately.
          Research shows Year 1 typically delivers ~50% (adoption friction, data quality gaps, change resistance),
          Year 2 reaches ~80% as the organization optimizes, and Year 3 achieves full projected value.
          We apply this curve automatically so your ROI estimate stays realistic and boardroom-defensible.
        </p>
        <p className="text-xs font-semibold text-blue-800 mt-2">
          Currently applying: Year {utilizationYear} — {(util * 100).toFixed(0)}% of projected efficiency gains.
        </p>
      </div>
    </div>
  );
}

// ─── Step 2: Revenue ──────────────────────────────────────────────────────────

interface RevenueStepProps {
  annualRevenue: string; setAnnualRevenue: (v: string) => void;
  revenueUpliftPct: string; setRevenueUpliftPct: (v: string) => void;
}

function RevenueStep({ annualRevenue, setAnnualRevenue, revenueUpliftPct, setRevenueUpliftPct }: RevenueStepProps) {
  const rev = parseFloat(annualRevenue) || 0;
  const uplift = parseFloat(revenueUpliftPct) || 0;
  const revenueROI = rev * (uplift / 100);

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">Revenue Impact (Pillar 2)</h3>
        <p className="text-navy-500 text-xs mt-1">
          Estimate how much AI has contributed to revenue growth. Be conservative — this is the hardest pillar
          to attribute directly. Even 1–2% is meaningful at scale. Leave at 0 if you have no data yet.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass()}>Annual revenue ($)</label>
          <input
            type="number" min="0"
            className={inputClass()}
            value={annualRevenue}
            onChange={e => setAnnualRevenue(e.target.value)}
            placeholder="e.g. 50000000"
          />
        </div>
        <div>
          <label className={labelClass()}>Revenue uplift from AI (%)</label>
          <input
            type="number" min="0" max="100" step="0.5"
            className={inputClass()}
            value={revenueUpliftPct}
            onChange={e => setRevenueUpliftPct(e.target.value)}
            placeholder="e.g. 2"
          />
          <p className="text-xs text-navy-400 mt-1">
            % increase in revenue you can reasonably attribute to AI (faster sales cycles, personalization, etc.).
          </p>
        </div>
      </div>
      {rev > 0 && uplift > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-green-800">Pillar 2 — Revenue ROI (before utilization curve)</p>
          <p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(revenueROI)}</p>
          <p className="text-xs text-green-600 mt-0.5">
            {formatCurrency(rev)} × {uplift}% — utilization curve is applied on the Results step.
          </p>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Attribution note:</strong> Use A/B test data, CRM win-rate comparisons, or
          customer conversion metrics if available. If you have no attribution data yet, enter 0
          and revisit this after your next quarterly review. Overstated revenue ROI undermines
          board credibility and masks the true efficiency story.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Risk Mitigation ──────────────────────────────────────────────────

interface RiskStepProps {
  riskCategories: string[]; setRiskCategories: (v: string[]) => void;
  riskExposure: string; setRiskExposure: (v: string) => void;
  riskProbBefore: string; setRiskProbBefore: (v: string) => void;
  riskProbAfter: string; setRiskProbAfter: (v: string) => void;
}

function RiskStep({ riskCategories, setRiskCategories, riskExposure, setRiskExposure, riskProbBefore, setRiskProbBefore, riskProbAfter, setRiskProbAfter }: RiskStepProps) {
  const exposure = parseFloat(riskExposure) || 0;
  const probBefore = parseFloat(riskProbBefore) || 0;
  const probAfter = parseFloat(riskProbAfter) || 0;
  const riskValue = exposure * Math.max(0, (probBefore - probAfter) / 100);

  function handleCategoryToggle(key: string) {
    const next = riskCategories.includes(key)
      ? riskCategories.filter(k => k !== key)
      : [...riskCategories, key];
    setRiskCategories(next);
    // Sum default exposures for all selected categories
    const total = RISK_CATEGORIES
      .filter(c => next.includes(c.key))
      .reduce((sum, c) => sum + c.defaultExposure, 0);
    setRiskExposure(String(total));
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">Risk Mitigation (Pillar 3)</h3>
        <p className="text-navy-500 text-xs mt-1">
          AI governance reduces the probability and severity of risk events. Select one or more risk categories.
          Default exposure amounts are pre-filled from industry benchmarks and combined — adjust the total to match your organization.
        </p>
      </div>
      <div className="mb-4">
        <label className={labelClass()}>Risk categories (select all that apply)</label>
        <div className="space-y-2">
          {RISK_CATEGORIES.map(cat => {
            const selected = riskCategories.includes(cat.key);
            return (
              <label
                key={cat.key}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selected ? 'border-[#1E2761] bg-navy-50' : 'border-navy-200 bg-white hover:border-navy-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={cat.key}
                  checked={selected}
                  onChange={() => handleCategoryToggle(cat.key)}
                  className="accent-[#1E2761]"
                />
                <span className="text-sm text-navy-900">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      {riskCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass()}>Combined risk exposure ($)</label>
            <input
              type="number" min="0"
              className={inputClass()}
              value={riskExposure}
              onChange={e => setRiskExposure(e.target.value)}
              placeholder="e.g. 500000"
            />
            <p className="text-xs text-navy-400 mt-1">Combined max potential loss. Pre-filled from benchmarks — adjust to your org.</p>
          </div>
          <div>
            <label className={labelClass()}>Probability without AI (%/yr)</label>
            <input
              type="number" min="0" max="100" step="1"
              className={inputClass()}
              value={riskProbBefore}
              onChange={e => setRiskProbBefore(e.target.value)}
              placeholder="e.g. 12"
            />
          </div>
          <div>
            <label className={labelClass()}>Probability with AI (%/yr)</label>
            <input
              type="number" min="0" max="100" step="1"
              className={inputClass()}
              value={riskProbAfter}
              onChange={e => setRiskProbAfter(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
        </div>
      )}
      {riskValue > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-800">Pillar 3 — Annual Risk Mitigation Value</p>
          <p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(riskValue)}</p>
          <p className="text-xs text-green-600 mt-0.5">
            {formatCurrency(exposure)} exposure × ({probBefore}% − {probAfter}%) probability delta
          </p>
        </div>
      )}
      {riskCategories.length === 0 && (
        <p className="text-xs text-navy-400 italic text-center">
          Select one or more risk categories above. You can skip this pillar and advance.
        </p>
      )}
    </div>
  );
}

// ─── Step 4: Hidden Costs ─────────────────────────────────────────────────────

function HiddenCostsStep({
  hiddenCosts,
  setHiddenCosts,
}: {
  hiddenCosts: Record<string, number>;
  setHiddenCosts: (v: Record<string, number>) => void;
}) {
  const total = Object.values(hiddenCosts).reduce((s, v) => s + (v || 0), 0);

  function handleChange(key: string, raw: string) {
    setHiddenCosts({ ...hiddenCosts, [key]: parseFloat(raw) || 0 });
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">Hidden Costs (TCO Iceberg)</h3>
        <p className="text-navy-500 text-xs mt-1">
          Organizations routinely underestimate AI costs by 40–60% by ignoring what sits below the waterline.
          Enter your actual or estimated amounts. Leave at $0 if not applicable.
          These are added to your visible AI spend to produce an accurate Total Cost of Ownership.
        </p>
      </div>
      <div className="space-y-3 mb-4">
        {HIDDEN_COST_CATEGORIES.map(cat => (
          <div key={cat.key} className="bg-white rounded-lg border border-navy-200 p-3">
            <label className={labelClass()}>{cat.label}</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-navy-500 font-medium">$</span>
              <input
                type="number" min="0" step="100"
                className={inputClass()}
                value={hiddenCosts[cat.key] || ''}
                onChange={e => handleChange(cat.key, e.target.value)}
                placeholder="0"
              />
            </div>
            <p className="text-xs text-navy-400 mt-1">{cat.hint}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-navy-50 rounded-lg px-4 py-3">
        <span className="text-sm font-semibold text-navy-800">Total hidden costs:</span>
        <span className="text-sm font-bold text-navy-900">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

// ─── Step 5: Results ──────────────────────────────────────────────────────────

interface ResultsStepProps {
  results: CalcResults;
  saving: boolean;
  onSave: () => void;
  savedConfirm: boolean;
}

function ResultsStep({ results, saving, onSave, savedConfirm }: ResultsStepProps) {
  const scenarios = [
    { key: 'conservative' as const, label: 'Conservative', mult: '0.6×', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { key: 'realistic'    as const, label: 'Realistic',    mult: '1.0×', color: 'text-[#1E2761]', bg: 'bg-navy-50 border-navy-200' },
    { key: 'optimistic'   as const, label: 'Optimistic',   mult: '1.4×', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  ];

  const pct = results.scenarioPct.realistic;
  let summaryHeading: string;
  let summaryText: string;
  if (pct >= 200) {
    summaryHeading = 'Strong investment case';
    summaryText = 'Your AI investment is generating significant returns across multiple value dimensions. Focus on scaling adoption, expanding to higher-value use cases, and capturing the compounding benefits that emerge in Year 2–3 maturity.';
  } else if (pct >= 50) {
    summaryHeading = 'Positive returns with optimization opportunity';
    summaryText = 'AI is delivering measurable value. Improving adoption rates, tightening hidden cost estimates, and better attributing revenue upside will materially strengthen the ROI case for your next board presentation.';
  } else if (pct >= 0) {
    summaryHeading = 'Marginal positive — review your assumptions';
    summaryText = 'Returns are positive but modest. Revisit hidden cost estimates, validate adoption rates against actual tool usage data, and consider whether higher-value use cases should be prioritized before expanding AI spend.';
  } else {
    summaryHeading = 'Investment needs review';
    summaryText = 'Costs exceed modeled benefits in the realistic scenario. Investigate adoption barriers, reduce hidden costs, or target use cases with demonstrably stronger productivity impact before committing to further expansion.';
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-navy-900 text-sm">3-Scenario ROI Results</h3>
        <p className="text-navy-500 text-xs mt-1">
          Scenarios apply a confidence multiplier to all projected benefits. Costs remain fixed in all
          scenarios. The <strong>Realistic</strong> scenario is your primary estimate.
        </p>
      </div>

      {/* Benefit Breakdown */}
      <div className="bg-white rounded-xl border border-navy-200 p-4 mb-4">
        <p className="text-xs font-semibold text-navy-700 mb-3">Gross Benefit Breakdown</p>
        <div className="space-y-1.5 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-navy-500">Pillar 1 — Efficiency (curve-adjusted):</span>
            <span className="font-semibold text-navy-900">{formatCurrency(results.p1Adjusted)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500">Pillar 2 — Revenue uplift (curve-adjusted):</span>
            <span className="font-semibold text-navy-900">{formatCurrency(results.p2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500">Pillar 3 — Risk mitigation value:</span>
            <span className="font-semibold text-navy-900">{formatCurrency(results.p3)}</span>
          </div>
          <div className="border-t border-navy-100 pt-2 mt-1 flex justify-between font-semibold">
            <span className="text-navy-800">Total gross benefits:</span>
            <span className="text-navy-900">{formatCurrency(results.totalBenefits)}</span>
          </div>
        </div>
      </div>

      {/* TCO */}
      <div className="bg-white rounded-xl border border-navy-200 p-4 mb-4">
        <p className="text-xs font-semibold text-navy-700 mb-3">Total Cost of Ownership (TCO)</p>
        <div className="space-y-1.5 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-navy-500">Annual visible AI spend:</span>
            <span className="font-semibold text-navy-900">{formatCurrency(results.annualSpend)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500">Hidden costs:</span>
            <span className="font-semibold text-navy-900">{formatCurrency(results.totalHidden)}</span>
          </div>
          <div className="border-t border-navy-100 pt-2 mt-1 flex justify-between font-semibold">
            <span className="text-navy-800">Total TCO:</span>
            <span className="text-navy-900">{formatCurrency(results.totalTCO)}</span>
          </div>
        </div>
      </div>

      {/* 3 Scenarios */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {scenarios.map(s => {
          const net = results.scenarios[s.key];
          const scenPct = results.scenarioPct[s.key];
          const positive = net >= 0;
          return (
            <div key={s.key} className={`rounded-xl border p-3 text-center ${s.bg}`}>
              <p className="text-xs font-semibold text-navy-600 mb-0.5">{s.label}</p>
              <p className="text-[10px] text-navy-400 mb-2">{s.mult} confidence</p>
              <p className={`text-base font-bold leading-tight ${positive ? s.color : 'text-red-600'}`}>
                {positive ? '+' : ''}{formatCurrency(net)}
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${positive ? s.color : 'text-red-600'}`}>
                {scenPct >= 0 ? '+' : ''}{scenPct.toFixed(0)}% ROI
              </p>
            </div>
          );
        })}
      </div>

      {/* Qualitative Summary */}
      <div className="bg-[#1E2761] rounded-xl p-4 mb-5 text-white">
        <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider mb-1">Investment Assessment</p>
        <p className="text-sm font-bold mb-2">{summaryHeading}</p>
        <p className="text-xs text-blue-100 leading-relaxed">{summaryText}</p>
        <div className="border-t border-blue-700 mt-3 pt-3">
          <p className="text-xs text-blue-300 italic leading-relaxed">
            Organizations with stronger AI governance consistently achieve higher sustained ROI.
            Addressing your top assessment blind spots directly protects this investment.
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[#1E2761] text-white text-sm px-5 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-navy-800 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Model'}
        </button>
        {savedConfirm && (
          <span className="text-green-600 text-sm font-medium">Model saved!</span>
        )}
      </div>
    </div>
  );
}

// ─── Pro Lock Card ────────────────────────────────────────────────────────────

function ProLockCard() {
  return (
    <div className="bg-gradient-to-br from-navy-50 to-blue-50 rounded-xl border border-navy-200 p-6 text-center">
      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3 text-base">
        &#x1F512;
      </div>
      <h3 className="font-bold text-navy-900 text-sm mb-1">ROI Model Builder</h3>
      <p className="text-navy-500 text-xs mb-3 max-w-xs mx-auto leading-relaxed">
        Build a defensible 3-pillar ROI model — Efficiency, Revenue, and Risk Mitigation — with
        before/after task baselines, full TCO accounting, and 3-scenario projections.
      </p>
      <p className="text-xs text-[#1E2761] font-semibold">Upgrade to Professional to unlock</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  totalMonthlySpend: number;
  profile: Partial<OrganizationProfile>;
}

export function RoiModelBuilder({ totalMonthlySpend, profile }: Props) {
  const { licenseTier } = useAssessmentStore();
  const isPro = licenseTier === 'professional';

  const [step, setStep] = useState(0);
  const [tasks, setTasks] = useState<RoiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedConfirm, setSavedConfirm] = useState(false);

  // Step 1 — Efficiency inputs
  const [headcount, setHeadcount] = useState(() => defaultHeadcount(profile.size));
  const [adoptionRate, setAdoptionRate] = useState('');
  const [blendedHourlyRate, setBlendedHourlyRate] = useState('');
  const [utilizationYear, setUtilizationYear] = useState<1 | 2 | 3>(1);

  // Step 2 — Revenue
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [revenueUpliftPct, setRevenueUpliftPct] = useState('');

  // Step 3 — Risk
  const [riskCategories, setRiskCategories] = useState<string[]>([]);
  const [riskExposure, setRiskExposure] = useState('');
  const [riskProbBefore, setRiskProbBefore] = useState('');
  const [riskProbAfter, setRiskProbAfter] = useState('');

  // Step 4 — Hidden Costs
  const [hiddenCosts, setHiddenCosts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isPro) { setLoading(false); return; }
    (async () => {
      try {
        const [t, m] = await Promise.all([getRoiTasks(), getRoiModel()]);
        setTasks(t);
        if (m) {
          if (m.headcount > 0) setHeadcount(String(m.headcount));
          if (m.adoptionRate > 0) setAdoptionRate(String(m.adoptionRate));
          if (m.blendedHourlyRate > 0) setBlendedHourlyRate(String(m.blendedHourlyRate));
          setUtilizationYear(m.utilizationYear ?? 1);
          if (m.annualRevenue > 0) setAnnualRevenue(String(m.annualRevenue));
          if (m.revenueUpliftPct > 0) setRevenueUpliftPct(String(m.revenueUpliftPct));
          setRiskCategories(m.riskCategories ?? []);
          if (m.riskExposure > 0) setRiskExposure(String(m.riskExposure));
          if (m.riskProbBefore > 0) setRiskProbBefore(String(m.riskProbBefore));
          if (m.riskProbAfter > 0) setRiskProbAfter(String(m.riskProbAfter));
          setHiddenCosts(m.hiddenCosts ?? {});
        }
      } catch (err) {
        console.error('[RoiModelBuilder] load failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro]);

  async function refreshTasks() {
    const t = await getRoiTasks();
    setTasks(t);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveRoiModel({
        headcount: parseInt(headcount) || 0,
        adoptionRate: parseFloat(adoptionRate) || 0,
        blendedHourlyRate: parseFloat(blendedHourlyRate) || 0,
        utilizationYear,
        annualRevenue: parseFloat(annualRevenue) || 0,
        revenueUpliftPct: parseFloat(revenueUpliftPct) || 0,
        riskCategories,
        riskExposure: parseFloat(riskExposure) || 0,
        riskProbBefore: parseFloat(riskProbBefore) || 0,
        riskProbAfter: parseFloat(riskProbAfter) || 0,
        hiddenCosts,
      });
      setSavedConfirm(true);
      setTimeout(() => setSavedConfirm(false), 3000);
    } catch (err) {
      console.error('[RoiModelBuilder] save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  const modelData: RoiModelData = {
    headcount: parseInt(headcount) || 0,
    adoptionRate: parseFloat(adoptionRate) || 0,
    blendedHourlyRate: parseFloat(blendedHourlyRate) || 0,
    utilizationYear,
    annualRevenue: parseFloat(annualRevenue) || 0,
    revenueUpliftPct: parseFloat(revenueUpliftPct) || 0,
    riskCategories,
    riskExposure: parseFloat(riskExposure) || 0,
    riskProbBefore: parseFloat(riskProbBefore) || 0,
    riskProbAfter: parseFloat(riskProbAfter) || 0,
    hiddenCosts,
  };

  const results = calculate(tasks, modelData, totalMonthlySpend);

  // Per-step advance gate
  const canAdvance =
    step === 0 ? tasks.length > 0
    : step === 1 ? parseInt(headcount) > 0 && parseFloat(adoptionRate) > 0 && parseFloat(blendedHourlyRate) > 0
    : true; // Steps 2–4 are optional; Results is the terminal step

  if (!isPro) return <ProLockCard />;
  if (loading) return <p className="text-navy-400 text-sm py-4">Loading ROI model...</p>;

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-navy-900">ROI Model Builder</h2>
          <span className="text-xs bg-[#1E2761] text-white px-2 py-0.5 rounded-full font-medium">Pro</span>
        </div>
        <p className="text-navy-500 text-sm">
          Build a defensible 3-pillar ROI model with before/after task baselines, full TCO, and 3-scenario projections.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-navy-200 p-5">
        <StepIndicator step={step} onStepClick={setStep} />

        <div className="min-h-[320px]">
          {step === 0 && <TaskStep tasks={tasks} onRefresh={refreshTasks} />}
          {step === 1 && (
            <EfficiencyStep
              headcount={headcount} setHeadcount={setHeadcount}
              adoptionRate={adoptionRate} setAdoptionRate={setAdoptionRate}
              blendedHourlyRate={blendedHourlyRate} setBlendedHourlyRate={setBlendedHourlyRate}
              utilizationYear={utilizationYear} setUtilizationYear={setUtilizationYear}
            />
          )}
          {step === 2 && (
            <RevenueStep
              annualRevenue={annualRevenue} setAnnualRevenue={setAnnualRevenue}
              revenueUpliftPct={revenueUpliftPct} setRevenueUpliftPct={setRevenueUpliftPct}
            />
          )}
          {step === 3 && (
            <RiskStep
              riskCategories={riskCategories} setRiskCategories={setRiskCategories}
              riskExposure={riskExposure} setRiskExposure={setRiskExposure}
              riskProbBefore={riskProbBefore} setRiskProbBefore={setRiskProbBefore}
              riskProbAfter={riskProbAfter} setRiskProbAfter={setRiskProbAfter}
            />
          )}
          {step === 4 && (
            <HiddenCostsStep hiddenCosts={hiddenCosts} setHiddenCosts={setHiddenCosts} />
          )}
          {step === 5 && (
            <ResultsStep results={results} saving={saving} onSave={handleSave} savedConfirm={savedConfirm} />
          )}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-navy-100">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-navy-600 px-4 py-2 rounded-lg border border-navy-200 disabled:opacity-40 hover:bg-navy-50 transition-colors"
          >
            &larr; Back
          </button>
          {step < STEP_LABELS.length - 1 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance}
              className="bg-[#1E2761] text-white text-sm px-5 py-2 rounded-lg font-medium disabled:opacity-40 hover:bg-navy-800 transition-colors"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
