import { useState, useEffect } from 'react';
import type {
  DimensionScore,
  DimensionKey,
  MitigationItem,
  MitigationStatus,
  MitigationDimension,
  SpendItem,
  SpendCostType,
  AdoptionSnapshot,
  CompletedAssessmentSnapshot,
} from '@/types/assessment';
import {
  getMitigationItems,
  updateMitigationStatus,
  addCustomMitigationItem,
  deleteMitigationItem,
  getSpendItems,
  addSpendItem,
  deleteSpendItem,
  saveAdoptionSnapshot,
  getAdoptionSnapshots,
  getCompletedAssessments,
} from '@/services/db';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  assessmentId: number;
  currentScore: number;
  dimensionScores: DimensionScore[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  shadowAI: 'Shadow AI',
  vendorRisk: 'Vendor Risk',
  dataGovernance: 'Data Governance',
  securityCompliance: 'Security & Compliance',
  aiSpecificRisks: 'AI-Specific Risks',
  roiTracking: 'ROI Tracking',
};

const DIMENSION_COLORS: Record<MitigationDimension, string> = {
  shadowAI: 'bg-purple-100 text-purple-700 border-purple-200',
  vendorRisk: 'bg-orange-100 text-orange-700 border-orange-200',
  dataGovernance: 'bg-blue-100 text-blue-700 border-blue-200',
  securityCompliance: 'bg-red-100 text-red-700 border-red-200',
  aiSpecificRisks: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  roiTracking: 'bg-green-100 text-green-700 border-green-200',
  general: 'bg-gray-100 text-gray-600 border-gray-200',
};

const SPEND_TYPE_LABELS: Record<SpendCostType, string> = {
  monthly_subscription: 'Monthly Subscription',
  annual_license: 'Annual License',
  one_time: 'One-Time Purchase',
  api_infrastructure: 'API / Infrastructure',
  internal_labor: 'Internal Labor',
};

const ALL_DIMENSIONS: MitigationDimension[] = [
  'shadowAI',
  'vendorRisk',
  'dataGovernance',
  'securityCompliance',
  'aiSpecificRisks',
  'roiTracking',
  'general',
];

// ─── Section 1: Delta Banner ──────────────────────────────────────────────────

interface DeltaBannerProps {
  currentScore: number;
  currentDimensionScores: DimensionScore[];
  assessments: CompletedAssessmentSnapshot[];
}

function DeltaBanner({ currentScore, currentDimensionScores, assessments }: DeltaBannerProps) {
  if (assessments.length < 2) return null;

  const prior = assessments[assessments.length - 2];
  const overallDelta = currentScore - prior.overallScore;
  const deltaSign = overallDelta > 0 ? '+' : '';
  const deltaColor =
    overallDelta > 0
      ? 'text-green-600'
      : overallDelta < 0
      ? 'text-red-600'
      : 'text-gray-500';
  const trendWord = overallDelta > 0 ? 'improved' : overallDelta < 0 ? 'declined' : 'remained unchanged';

  const dimDeltas = currentDimensionScores.map((d) => {
    const priorDim = prior.dimensionScores.find((p) => p.key === d.key);
    const delta = priorDim !== undefined ? d.score - priorDim.score : 0;
    return { key: d.key, delta };
  });

  return (
    <div className="bg-white rounded-xl border border-navy-200 p-5 mb-6">
      <p className="text-navy-700 font-medium text-sm mb-3">
        Since your assessment on{' '}
        <span className="font-semibold">{formatDate(prior.completedAt)}</span>, your overall
        governance score has{' '}
        <span className={deltaColor + ' font-bold'}>
          {trendWord} by {deltaSign}{Math.abs(overallDelta)} points
        </span>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        {dimDeltas.map(({ key, delta }) => {
          const color =
            delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-400';
          const sign = delta > 0 ? '+' : '';
          return (
            <span
              key={key}
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DIMENSION_COLORS[key]} `}
            >
              {DIMENSION_LABELS[key]}{' '}
              <span className={color}>
                {sign}
                {delta}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section 2: Mitigation Tracker ───────────────────────────────────────────

interface MitigationTrackerProps {
  assessmentId: number;
}

function MitigationTracker({ assessmentId }: MitigationTrackerProps) {
  const [items, setItems] = useState<MitigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [noteValues, setNoteValues] = useState<Record<number, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDimension, setNewDimension] = useState<MitigationDimension>('general');
  const [newDescription, setNewDescription] = useState('');
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    if (assessmentId === -1) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getMitigationItems(assessmentId);
        setItems(data);
        const notes: Record<number, string> = {};
        data.forEach((item) => {
          if (item.id !== undefined && item.notes) {
            notes[item.id] = item.notes;
          }
        });
        setNoteValues(notes);
      } catch (err) {
        console.error('[TrackProgress] getMitigationItems failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [assessmentId]);

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.status === 'complete').length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  async function handleStatusChange(item: MitigationItem, newStatus: MitigationStatus) {
    if (item.id === undefined) return;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: newStatus,
              completedAt:
                newStatus === 'complete' && !i.completedAt
                  ? new Date().toISOString()
                  : i.completedAt,
            }
          : i
      )
    );
    try {
      await updateMitigationStatus(item.id, newStatus, noteValues[item.id]);
    } catch (err) {
      console.error('[TrackProgress] updateMitigationStatus failed:', err);
    }
  }

  async function handleNoteBlur(item: MitigationItem) {
    if (item.id === undefined) return;
    const notes = noteValues[item.id] ?? '';
    try {
      await updateMitigationStatus(item.id, item.status, notes);
    } catch (err) {
      console.error('[TrackProgress] updateMitigationStatus (notes) failed:', err);
    }
  }

  async function handleDelete(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteMitigationItem(id);
    } catch (err) {
      console.error('[TrackProgress] deleteMitigationItem failed:', err);
    }
  }

  function toggleNotes(id: number) {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleAddCustom() {
    if (!newTitle.trim()) return;
    setAddingItem(true);
    const newItem: Omit<MitigationItem, 'id' | 'createdAt' | 'sourceType' | 'completedAt'> = {
      assessmentId,
      dimension: newDimension,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: 'not_started',
    };
    try {
      await addCustomMitigationItem(newItem);
      const refreshed = await getMitigationItems(assessmentId);
      setItems(refreshed);
      setNewTitle('');
      setNewDimension('general');
      setNewDescription('');
      setShowAddForm(false);
    } catch (err) {
      console.error('[TrackProgress] addCustomMitigationItem failed:', err);
    } finally {
      setAddingItem(false);
    }
  }

  const statusConfig: Record<MitigationStatus, { label: string; active: string; inactive: string }> = {
    not_started: {
      label: 'Not Started',
      active: 'bg-gray-500 text-white',
      inactive: 'border border-gray-300 text-gray-500 hover:bg-gray-50',
    },
    in_progress: {
      label: 'In Progress',
      active: 'bg-amber-500 text-white',
      inactive: 'border border-amber-300 text-amber-600 hover:bg-amber-50',
    },
    complete: {
      label: 'Complete',
      active: 'bg-green-600 text-white',
      inactive: 'border border-green-300 text-green-600 hover:bg-green-50',
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Governance Action Plan</h2>
          <p className="text-navy-500 text-sm">Track remediation actions from your assessment</p>
        </div>
        {totalCount > 0 && (
          <div className="text-right">
            <span className="text-sm font-semibold text-navy-700">
              {completedCount} of {totalCount} complete
            </span>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-navy-400 mt-1">{progressPct}% complete</p>
        </div>
      )}

      {loading ? (
        <p className="text-navy-400 text-sm py-4">Loading actions...</p>
      ) : assessmentId === -1 ? (
        <div className="bg-white rounded-xl border border-navy-200 p-5 text-center text-navy-400 text-sm">
          Assessment data not available in this context.
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-navy-200 p-5 text-center text-navy-400 text-sm">
          No actions yet — complete your assessment to see recommendations here.
        </div>
      ) : (
        <div>
          {items.map((item) => {
            const itemId = item.id ?? 0;
            const notesExpanded = expandedNotes.has(itemId);
            const currentNote = noteValues[itemId] ?? '';

            return (
              <div
                key={itemId}
                className="bg-white rounded-xl border border-navy-200 p-5 mb-3 relative"
              >
                <button
                  onClick={() => handleDelete(itemId)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 text-lg leading-none font-bold transition-colors"
                  title="Delete action"
                >
                  ×
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap mt-0.5 ${DIMENSION_COLORS[item.dimension]}`}
                  >
                    {item.dimension === 'general' ? 'General' : DIMENSION_LABELS[item.dimension as DimensionKey]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-navy-900 text-sm">{item.title}</p>
                      {item.sourceType === 'blind_spot' && (
                        <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                          Blind Spot
                        </span>
                      )}
                      {item.sourceType === 'custom' && (
                        <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-medium">
                          Custom
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-navy-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {(['not_started', 'in_progress', 'complete'] as MitigationStatus[]).map((s) => {
                    const cfg = statusConfig[s];
                    const isActive = item.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(item, s)}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                          isActive ? cfg.active : cfg.inactive
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => toggleNotes(itemId)}
                    className="text-xs text-navy-500 hover:text-navy-700 underline"
                  >
                    {notesExpanded
                      ? 'Hide note'
                      : currentNote
                      ? 'Edit note'
                      : 'Add note'}
                  </button>
                  {!notesExpanded && currentNote && (
                    <p className="text-xs text-navy-400 mt-1 italic">{currentNote}</p>
                  )}
                  {notesExpanded && (
                    <textarea
                      className="mt-2 w-full border border-navy-200 rounded-lg p-2 text-xs text-navy-700 resize-none focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
                      rows={3}
                      placeholder="Add a note..."
                      value={currentNote}
                      onChange={(e) =>
                        setNoteValues((prev) => ({ ...prev, [itemId]: e.target.value }))
                      }
                      onBlur={() => handleNoteBlur(item)}
                    />
                  )}
                </div>

                {item.status === 'complete' && item.completedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Completed {formatDate(item.completedAt)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {assessmentId !== -1 && (
        <div className="mt-4">
          {showAddForm ? (
            <div className="bg-white rounded-xl border border-navy-200 p-5">
              <h3 className="text-sm font-semibold text-navy-900 mb-3">Add Custom Action</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
                    placeholder="e.g. Review AI vendor contracts"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">Dimension</label>
                  <select
                    className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761] bg-white"
                    value={newDimension}
                    onChange={(e) => setNewDimension(e.target.value as MitigationDimension)}
                  >
                    {ALL_DIMENSIONS.map((d) => (
                      <option key={d} value={d}>
                        {d === 'general'
                          ? 'General'
                          : DIMENSION_LABELS[d as DimensionKey]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 resize-none focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
                    rows={2}
                    placeholder="Brief description of what needs to be done..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustom}
                    disabled={!newTitle.trim() || addingItem}
                    className="bg-[#1E2761] text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-navy-800 transition-colors"
                  >
                    {addingItem ? 'Adding...' : 'Add Action'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTitle('');
                      setNewDimension('general');
                      setNewDescription('');
                    }}
                    className="border border-navy-300 text-navy-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="border border-navy-300 text-navy-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              + Add Custom Action
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section 3: Spend Tracker ─────────────────────────────────────────────────

function SpendTracker() {
  const [spendItems, setSpendItems] = useState<SpendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [spendName, setSpendName] = useState('');
  const [costType, setCostType] = useState<SpendCostType>('monthly_subscription');
  const [amount, setAmount] = useState('');
  const [prorateMonths, setProrateMonths] = useState<12 | 24 | 36>(12);
  const [addingSpend, setAddingSpend] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSpendItems();
        setSpendItems(data);
      } catch (err) {
        console.error('[TrackProgress] getSpendItems failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rawAmount = parseFloat(amount) || 0;

  function getEffectiveProrateMonths(): number {
    if (costType === 'annual_license') return 12;
    if (costType === 'one_time') return prorateMonths;
    return 1;
  }

  const effectiveProrate = getEffectiveProrateMonths();
  const monthlyEquivalent = effectiveProrate > 0 ? rawAmount / effectiveProrate : 0;

  const totalMonthly = spendItems.reduce((sum, i) => sum + i.monthlyEquivalent, 0);

  async function handleAddSpend() {
    if (!spendName.trim() || rawAmount <= 0) return;
    setAddingSpend(true);
    try {
      await addSpendItem({
        name: spendName.trim(),
        costType,
        amount: rawAmount,
        prorateMonths: effectiveProrate,
        monthlyEquivalent,
      });
      const refreshed = await getSpendItems();
      setSpendItems(refreshed);
      setSpendName('');
      setCostType('monthly_subscription');
      setAmount('');
      setProrateMonths(12);
      setShowAddForm(false);
    } catch (err) {
      console.error('[TrackProgress] addSpendItem failed:', err);
    } finally {
      setAddingSpend(false);
    }
  }

  async function handleDeleteSpend(id: number) {
    setSpendItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteSpendItem(id);
    } catch (err) {
      console.error('[TrackProgress] deleteSpendItem failed:', err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-navy-900">AI Spend Tracker</h2>
          <p className="text-navy-500 text-sm">Track all AI-related costs in one place</p>
        </div>
        {totalMonthly > 0 && (
          <div className="text-right">
            <span className="text-sm font-bold text-navy-900">
              Total: {formatCurrency(totalMonthly)}/mo
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm py-4">Loading spend items...</p>
      ) : spendItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-navy-200 p-5 text-center text-navy-400 text-sm mb-4">
          No spend items yet. Add your first AI cost below.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-navy-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">Type</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-navy-600">Amount</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-navy-600">Monthly</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {spendItems.map((item) => (
                <tr key={item.id} className="border-b border-navy-100 last:border-0">
                  <td className="px-4 py-3 text-navy-900 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-navy-500">{SPEND_TYPE_LABELS[item.costType]}</td>
                  <td className="px-4 py-3 text-right text-navy-700">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-3 text-right font-bold text-navy-900">
                    {formatCurrency(item.monthlyEquivalent)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      onClick={() => handleDeleteSpend(item.id ?? 0)}
                      className="text-gray-300 hover:text-red-500 text-lg font-bold leading-none transition-colors"
                      title="Delete item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-navy-200">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-navy-700">
                  Total monthly AI spend
                </td>
                <td className="px-4 py-3 text-right font-bold text-navy-900">
                  {formatCurrency(totalMonthly)}
                </td>
                <td />
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 pb-3 text-xs text-navy-400">
                  Annualized estimate
                </td>
                <td className="px-4 pb-3 text-right text-xs text-navy-500 font-medium">
                  (~{formatCurrency(totalMonthly * 12)}/year)
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {showAddForm ? (
        <div className="bg-white rounded-xl border border-navy-200 p-5">
          <h3 className="text-sm font-semibold text-navy-900 mb-3">Add AI Cost</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
                placeholder="e.g. GitHub Copilot Enterprise"
                value={spendName}
                onChange={(e) => setSpendName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">Cost Type</label>
                <select
                  className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761] bg-white"
                  value={costType}
                  onChange={(e) => setCostType(e.target.value as SpendCostType)}
                >
                  {(Object.entries(SPEND_TYPE_LABELS) as [SpendCostType, string][]).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {costType === 'one_time' && (
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-1">
                  Spread over
                </label>
                <div className="flex gap-2">
                  {([12, 24, 36] as const).map((months) => (
                    <button
                      key={months}
                      onClick={() => setProrateMonths(months)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        prorateMonths === months
                          ? 'bg-[#1E2761] text-white border-[#1E2761]'
                          : 'border-navy-300 text-navy-700 hover:bg-gray-50'
                      }`}
                    >
                      {months} months
                    </button>
                  ))}
                </div>
              </div>
            )}

            {costType === 'annual_license' && rawAmount > 0 && (
              <p className="text-xs text-navy-500">
                Annual license: {formatCurrency(rawAmount)} ÷ 12 ={' '}
                <span className="font-bold text-navy-900">{formatCurrency(monthlyEquivalent)}/mo</span>
              </p>
            )}

            {rawAmount > 0 && (
              <div className="bg-navy-100 rounded-lg p-3">
                <p className="text-xs text-navy-600">
                  Monthly equivalent:{' '}
                  <span className="font-bold text-navy-900 text-sm">{formatCurrency(monthlyEquivalent)}/mo</span>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddSpend}
                disabled={!spendName.trim() || rawAmount <= 0 || addingSpend}
                className="bg-[#1E2761] text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-navy-800 transition-colors"
              >
                {addingSpend ? 'Adding...' : 'Add Item'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSpendName('');
                  setCostType('monthly_subscription');
                  setAmount('');
                  setProrateMonths(12);
                }}
                className="border border-navy-300 text-navy-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="border border-navy-300 text-navy-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          + Add Cost
        </button>
      )}
    </div>
  );
}

// ─── Section 4: ROI Calculator ────────────────────────────────────────────────

interface ROICalculatorProps {
  totalMonthlySpend: number;
}

function ROICalculator({ totalMonthlySpend }: ROICalculatorProps) {
  const [snapshots, setSnapshots] = useState<AdoptionSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [adoptionRate, setAdoptionRate] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [hoursSaved, setHoursSaved] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [showAllSnapshots, setShowAllSnapshots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedConfirm, setSavedConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdoptionSnapshots();
        setSnapshots(data);
      } catch (err) {
        console.error('[TrackProgress] getAdoptionSnapshots failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const adoptionNum = parseFloat(adoptionRate) || 0;
  const headcountNum = parseInt(headcount, 10) || 0;
  const hoursSavedNum = parseFloat(hoursSaved) || 0;
  const hourlyRateNum = parseFloat(hourlyRate) || 0;

  const aiUsers = Math.round((adoptionNum / 100) * headcountNum);
  const annualHoursSaved = aiUsers * hoursSavedNum * 52;
  const annualValue = annualHoursSaved * hourlyRateNum;
  const annualCost = totalMonthlySpend * 12;
  const netROI = annualValue - annualCost;
  const roiPct = annualCost > 0 ? ((annualValue - annualCost) / annualCost) * 100 : 0;

  const allFieldsFilled =
    adoptionNum > 0 && headcountNum > 0 && hoursSavedNum > 0 && hourlyRateNum > 0;

  const roiColor = netROI >= 0 ? 'text-green-600' : 'text-red-600';
  const roiPctColor = roiPct >= 0 ? 'text-green-600' : 'text-red-600';

  async function handleSaveSnapshot() {
    if (!allFieldsFilled) return;
    setSaving(true);
    try {
      await saveAdoptionSnapshot({
        adoptionRate: adoptionNum,
        headcount: headcountNum,
        hoursSavedPerUser: hoursSavedNum,
        blendedHourlyRate: hourlyRateNum,
      });
      const refreshed = await getAdoptionSnapshots();
      setSnapshots(refreshed);
      setSavedConfirm(true);
      setTimeout(() => setSavedConfirm(false), 3000);
    } catch (err) {
      console.error('[TrackProgress] saveAdoptionSnapshot failed:', err);
    } finally {
      setSaving(false);
    }
  }

  const displayedSnapshots = showAllSnapshots
    ? [...snapshots].reverse()
    : [...snapshots].reverse().slice(0, 5);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-navy-900">AI ROI Calculator</h2>
        <p className="text-navy-500 text-sm">Estimate the return on your AI investment</p>
      </div>

      <div className="bg-white rounded-xl border border-navy-200 p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Adoption Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
              placeholder="e.g. 40"
              value={adoptionRate}
              onChange={(e) => setAdoptionRate(e.target.value)}
            />
            <p className="text-xs text-navy-400 mt-1">
              Count employees who use AI tools at least weekly.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Headcount</label>
            <input
              type="number"
              min="0"
              className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
              placeholder="e.g. 250"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
            />
            <p className="text-xs text-navy-400 mt-1">
              Use headcount from your org profile, or enter current count.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Hours Saved Per User / Week
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
              placeholder="e.g. 2.5"
              value={hoursSaved}
              onChange={(e) => setHoursSaved(e.target.value)}
            />
            <p className="text-xs text-navy-400 mt-1">
              Think: time on drafting, research, data tasks, summarization. Even 1–2 hours/week is realistic.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Blended Hourly Rate ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-1 focus:ring-[#1E2761]"
              placeholder="e.g. 65"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <p className="text-xs text-navy-400 mt-1">
              Rule of thumb: annual salary ÷ 2,080. Include benefits (typically 1.3× base salary).
            </p>
          </div>
        </div>

        {allFieldsFilled && (
          <div className="mt-5 border-t border-navy-100 pt-4">
            <h3 className="text-sm font-semibold text-navy-800 mb-3">ROI Breakdown</h3>
            <div className="space-y-1.5 text-sm text-navy-700 font-mono">
              <div className="flex justify-between">
                <span className="text-navy-500">AI Users:</span>
                <span>
                  {adoptionNum}% × {headcountNum.toLocaleString()} ={' '}
                  <span className="font-bold text-navy-900">{aiUsers.toLocaleString()} users</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">Annual Hours Saved:</span>
                <span>
                  {aiUsers.toLocaleString()} × {hoursSavedNum} hrs/wk × 52 ={' '}
                  <span className="font-bold text-navy-900">{annualHoursSaved.toLocaleString()} hrs</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">Annual Value:</span>
                <span>
                  {annualHoursSaved.toLocaleString()} hrs × ${hourlyRateNum} ={' '}
                  <span className="font-bold text-navy-900">{formatCurrency(annualValue)}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">Annual AI Cost:</span>
                <span>
                  {formatCurrency(totalMonthlySpend)}/mo × 12 ={' '}
                  <span className="font-bold text-navy-900">{formatCurrency(annualCost)}</span>
                </span>
              </div>
              <div className="border-t border-navy-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-navy-800">Net Annual ROI:</span>
                  <span className={`font-bold text-base ${roiColor}`}>
                    {netROI >= 0 ? '+' : ''}{formatCurrency(netROI)}
                  </span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="font-semibold text-navy-800">ROI %:</span>
                  <span className={`font-bold text-base ${roiPctColor}`}>
                    {roiPct >= 0 ? '+' : ''}{roiPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSaveSnapshot}
                disabled={saving}
                className="bg-[#1E2761] text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-navy-800 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Snapshot'}
              </button>
              {savedConfirm && (
                <span className="text-green-600 text-sm font-medium">Snapshot saved!</span>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Loading snapshots...</p>
      ) : snapshots.length > 0 ? (
        <div className="bg-white rounded-xl border border-navy-200 p-5">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Previous Snapshots</h3>
          <div className="space-y-2">
            {displayedSnapshots.map((snap) => {
              const snapAiUsers = Math.round((snap.adoptionRate / 100) * snap.headcount);
              const snapAnnualValue = snapAiUsers * snap.hoursSavedPerUser * 52 * snap.blendedHourlyRate;
              const snapNetROI = snapAnnualValue - annualCost;
              const snapColor = snapNetROI >= 0 ? 'text-green-600' : 'text-red-600';
              return (
                <div
                  key={snap.id}
                  className="flex items-center justify-between text-sm border-b border-navy-100 last:border-0 pb-2 last:pb-0"
                >
                  <span className="text-navy-500">
                    {snap.recordedAt ? formatDate(snap.recordedAt) : 'Unknown date'}
                  </span>
                  <span className={`font-semibold ${snapColor}`}>
                    Net ROI: {snapNetROI >= 0 ? '+' : ''}{formatCurrency(snapNetROI)}
                  </span>
                </div>
              );
            })}
          </div>
          {snapshots.length > 5 && (
            <button
              onClick={() => setShowAllSnapshots((prev) => !prev)}
              className="mt-3 text-xs text-navy-500 hover:text-navy-700 underline"
            >
              {showAllSnapshots
                ? 'Show fewer'
                : `View all ${snapshots.length} snapshots`}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TrackProgress({ assessmentId, currentScore, dimensionScores }: Props) {
  const [assessments, setAssessments] = useState<CompletedAssessmentSnapshot[]>([]);
  const [spendItems, setSpendItems] = useState<SpendItem[]>([]);

  useEffect(() => {
    if (assessmentId === -1) return;
    (async () => {
      try {
        const data = await getCompletedAssessments();
        setAssessments(data);
      } catch (err) {
        console.error('[TrackProgress] getCompletedAssessments failed:', err);
      }
    })();
  }, [assessmentId]);

  // Load spend items at root level so ROI calculator can read total monthly spend
  useEffect(() => {
    (async () => {
      try {
        const data = await getSpendItems();
        setSpendItems(data);
      } catch (err) {
        console.error('[TrackProgress] getSpendItems (root) failed:', err);
      }
    })();
  }, []);

  const totalMonthlySpend = spendItems.reduce((sum, i) => sum + i.monthlyEquivalent, 0);

  if (assessmentId === -1) {
    return (
      <div className="py-12 text-center text-navy-400 text-sm">
        Assessment data not available in this context.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Track Progress</h1>
        <p className="text-navy-500 text-sm mt-1">
          Monitor your governance actions, AI spend, and ROI over time.
        </p>
      </div>

      {assessments.length >= 2 && (
        <DeltaBanner
          currentScore={currentScore}
          currentDimensionScores={dimensionScores}
          assessments={assessments}
        />
      )}

      <MitigationTracker assessmentId={assessmentId} />

      <hr className="border-navy-200 my-8" />

      <SpendTracker />

      <hr className="border-navy-200 my-8" />

      <ROICalculator totalMonthlySpend={totalMonthlySpend} />
    </div>
  );
}
