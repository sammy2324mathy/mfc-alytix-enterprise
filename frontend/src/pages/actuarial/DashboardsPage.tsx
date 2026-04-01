import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { PieChart as PieIcon, TrendingUp, AlertTriangle, DollarSign, Shield, BarChart3, Send, CheckCircle, XCircle, Lock, Clock, Plus, Eye, FileCheck } from 'lucide-react';

/* ── Approved KPI data (visible to everyone including admin) ── */
const lossRatioData = [
  { product: 'Term Life', lossRatio: 62, premiums: 45.2 },
  { product: 'Whole Life', lossRatio: 71, premiums: 38.5 },
  { product: 'Group Life', lossRatio: 55, premiums: 28.1 },
  { product: 'Disability', lossRatio: 78, premiums: 15.8 },
  { product: 'Annuities', lossRatio: 43, premiums: 14.9 },
];

const portfolioMix = [
  { name: 'Term Life', value: 32, color: '#6366f1' },
  { name: 'Whole Life', value: 27, color: '#8b5cf6' },
  { name: 'Group Life', value: 20, color: '#a78bfa' },
  { name: 'Disability', value: 11, color: '#c4b5fd' },
  { name: 'Annuities', value: 10, color: '#ddd6fe' },
];

/* ── Contribution pipeline types ── */
type ContribStatus = 'Draft' | 'Submitted' | 'Approved' | 'Returned';

interface Contribution {
  id: string;
  title: string;
  category: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: ContribStatus;
  chiefNote?: string;
}

const initialContributions: Contribution[] = [
  { id: 'CTB-018', title: 'Motor Claims Frequency Update Q4', category: 'Claims Analysis', description: 'Updated motor loss frequency from 3.2% to 3.8% based on Q4 2025 experience data. Includes 14,203 new claims.', submittedBy: 'Amy Analyst', submittedAt: '2 hours ago', status: 'Submitted' },
  { id: 'CTB-017', title: 'Group Life Mortality Adjustment', category: 'Mortality Study', description: 'Proposed group life mortality adjustment factor of 0.92 based on 2022–2025 experience investigation (12,400 lives exposed).', submittedBy: 'Amy Analyst', submittedAt: '1 day ago', status: 'Submitted' },
  { id: 'CTB-016', title: 'Disability IBNR Triangle Refresh', category: 'Reserving', description: 'Refreshed disability IBNR development triangle with latest run-off data. IBNR estimate moved from $4.2M to $4.8M.', submittedBy: 'Amy Analyst', submittedAt: '2 days ago', status: 'Approved', chiefNote: 'Validated against prior year. Approved for Q4 reserve book.' },
  { id: 'CTB-015', title: 'Annuity Lapse Study', category: 'Persistency', description: 'Lapse experience study across 8,500 annuity policies. Observed 6.2% vs expected 5.0%. Recommend basis update.', submittedBy: 'Amy Analyst', submittedAt: '3 days ago', status: 'Approved', chiefNote: 'Good analysis. Incorporated into FY2025 valuation basis.' },
  { id: 'CTB-014', title: 'Credit Life Profitability Dashboard', category: 'Profitability', description: 'New credit life product profitability breakdown by distribution channel. Shows 12% margin erosion in broker channel.', submittedBy: 'Amy Analyst', submittedAt: '5 days ago', status: 'Returned', chiefNote: 'Expense allocation methodology needs revision — overhead not apportioned correctly. Please resubmit.' },
];

export const DashboardsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isChief = user?.roles.includes('chief_actuary') || user?.roles.includes('admin');
  const isAnalyst = user?.roles.includes('actuarial_analyst') || user?.roles.includes('actuary');
  const isAdminRole = user?.roles.includes('admin');

  const [contributions, setContributions] = useState<Contribution[]>(initialContributions);
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState('Claims Analysis');
  const [draftDescription, setDraftDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboards' | 'pipeline'>('dashboards');

  const updateStatus = (id: string, status: ContribStatus, note?: string) => {
    setContributions(contributions.map(c => c.id === id ? { ...c, status, chiefNote: note || c.chiefNote } : c));
  };

  const submitDraft = () => {
    if (!draftTitle.trim() || !draftDescription.trim()) return;
    const newContrib: Contribution = {
      id: `CTB-${String(contributions.length + 19).padStart(3, '0')}`,
      title: draftTitle,
      category: draftCategory,
      description: draftDescription,
      submittedBy: user?.sub || 'Analyst',
      submittedAt: 'Just now',
      status: 'Submitted',
    };
    setContributions([newContrib, ...contributions]);
    setDraftTitle('');
    setDraftDescription('');
    setShowDraftForm(false);
  };

  const approvedCount = contributions.filter(c => c.status === 'Approved').length;
  const pendingCount = contributions.filter(c => c.status === 'Submitted').length;

  /* Admin only sees approved data */
  const visibleToAdmin = contributions.filter(c => c.status === 'Approved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Actuarial Dashboards</h2>
          <p className="text-sm text-slate-500">
            {isAdminRole
              ? 'Viewing approved actuarial insights. All data has been reviewed and signed off by the Chief Actuary.'
              : isChief
              ? 'Review analyst contributions, approve or return with feedback, then publish to Admin.'
              : 'Submit your analysis and insights for Chief Actuary review. Approved data flows to enterprise dashboards.'}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('dashboards')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'dashboards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> KPI Dashboards</span>
        </button>
        <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <span className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> Contribution Pipeline
            {pendingCount > 0 && <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </span>
        </button>
      </div>

      {activeTab === 'dashboards' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Gross Written Premium" value="$142.5M" trend="+12% YoY" trendDirection="up" description="YTD all products" icon={<DollarSign className="w-5 h-5" />} />
            <MetricCard title="Combined Ratio" value="94.2%" trend="-2.1%" trendDirection="up" description="Below 100% → profitable" icon={<TrendingUp className="w-5 h-5" />} />
            <MetricCard title="Loss Ratio (Weighted)" value="63.8%" trend="Stable" trendDirection="neutral" description="Claims / Earned Premium" icon={<AlertTriangle className="w-5 h-5" />} />
            <MetricCard title="Solvency Ratio" value="215%" trend="Above 150% target" trendDirection="up" description="Assets / Required Capital" icon={<Shield className="w-5 h-5" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loss Ratio Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Loss Ratio by Product Line</h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lossRatioData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="product" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${value}%`]} />
                    <Bar dataKey="lossRatio" name="Loss Ratio" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio Composition */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <PieIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Portfolio Composition (GWP)</h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={portfolioMix} cx="50%" cy="50%" outerRadius={110} innerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                      {portfolioMix.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${value}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Approved Contributions (visible to all including Admin) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-emerald-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">Approved Analyst Insights ({approvedCount})</h3>
              </div>
              {isAdminRole && (
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-emerald-100 text-emerald-700">Chief Actuary Verified</span>
              )}
            </div>
            <div className="divide-y divide-slate-100">
              {(isAdminRole ? visibleToAdmin : contributions.filter(c => c.status === 'Approved')).map(c => (
                <div key={c.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{c.id}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">{c.category}</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">{c.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{c.description}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">Approved</span>
                  </div>
                  {c.chiefNote && (
                    <div className="mt-2 p-2 bg-emerald-50 rounded-lg text-xs text-emerald-800 border border-emerald-100">
                      <span className="font-bold">Chief Actuary:</span> {c.chiefNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'pipeline' && (
        <>
          {/* Pipeline Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Pending Review" value={pendingCount.toString()} trend={isChief ? 'Requires your sign-off' : 'Awaiting Chief Actuary'} trendDirection={pendingCount > 0 ? 'down' : 'up'} icon={<Clock className="w-5 h-5" />} />
            <MetricCard title="Approved & Published" value={approvedCount.toString()} trend="Visible to Admin" trendDirection="up" icon={<CheckCircle className="w-5 h-5" />} />
            <MetricCard title="Returned for Revision" value={contributions.filter(c => c.status === 'Returned').length.toString()} trend="Needs re-work" trendDirection="neutral" icon={<XCircle className="w-5 h-5" />} />
          </div>

          {/* Analyst Workflow Banner */}
          {!isAdminRole && (
            <div className={`rounded-xl border p-4 text-sm ${isChief ? 'border-indigo-100 bg-indigo-50/60 text-indigo-900' : 'border-sky-100 bg-sky-50/60 text-sky-900'}`}>
              <p className="font-semibold">
                {isChief
                  ? '🔍 Governance: Review analyst submissions below. Approve to publish to Admin dashboards, or return with feedback.'
                  : '📝 Your Role: Submit analysis insights and data updates. Once approved by the Chief Actuary, they become part of the official enterprise dashboards visible to the Administrator.'}
              </p>
              <p className="text-xs mt-1 opacity-80">
                Workflow: <span className="font-mono">Analyst Submits → Chief Actuary Reviews → Approved → Published to Admin</span>
              </p>
            </div>
          )}

          {/* Submit New (Analyst only) */}
          {(isAnalyst || isChief) && !isAdminRole && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Submit New Contribution</h3>
                <button onClick={() => setShowDraftForm(!showDraftForm)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> New Submission
                </button>
              </div>
              {showDraftForm && (
                <div className="p-6 space-y-4 border-b border-slate-100 bg-sky-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Title</label>
                      <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="e.g. Motor Claims Severity Update Q4" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Category</label>
                      <select value={draftCategory} onChange={e => setDraftCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
                        <option>Claims Analysis</option>
                        <option>Mortality Study</option>
                        <option>Reserving</option>
                        <option>Persistency</option>
                        <option>Profitability</option>
                        <option>Experience Investigation</option>
                        <option>Product Performance</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Description & Findings</label>
                    <textarea value={draftDescription} onChange={e => setDraftDescription(e.target.value)} rows={3} placeholder="Describe your analysis, key findings, data sources used, and any recommended actions..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowDraftForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                    <button onClick={submitDraft} disabled={!draftTitle.trim() || !draftDescription.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Send className="w-4 h-4" /> Submit for Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Pipeline Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Contribution Pipeline</h3>
              {isAdminRole && (
                <span className="text-xs text-slate-400 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Read-only — you see approved items in the Dashboards tab</span>
              )}
            </div>
            <div className="divide-y divide-slate-100">
              {(isAdminRole ? visibleToAdmin : contributions).map(c => (
                <div key={c.id} className={`p-4 transition-colors ${c.status === 'Returned' ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-500">{c.id}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">{c.category}</span>
                        <span className="text-xs text-slate-400">by {c.submittedBy} · {c.submittedAt}</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">{c.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{c.description}</p>
                      {c.chiefNote && (
                        <div className={`mt-2 p-2 rounded-lg text-xs border ${c.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                          <span className="font-bold">Chief Actuary:</span> {c.chiefNote}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        c.status === 'Submitted' ? 'bg-amber-100 text-amber-700' :
                        c.status === 'Returned' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}>{c.status}</span>

                      {/* Chief Actuary actions on pending items */}
                      {c.status === 'Submitted' && isChief && !isAdminRole && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(c.id, 'Approved', 'Reviewed and approved. Published to enterprise dashboards.')} className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => updateStatus(c.id, 'Returned', 'Please review methodology and resubmit with corrections.')} className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Return
                          </button>
                        </div>
                      )}

                      {/* Analyst sees lock on pending items */}
                      {c.status === 'Submitted' && !isChief && (
                        <span className="text-[11px] italic text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Pending Chief</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
