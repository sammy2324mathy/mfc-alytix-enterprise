import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  PieChart as PieIcon, TrendingUp, AlertTriangle, DollarSign, Shield, 
  BarChart3, Send, CheckCircle, XCircle, Lock, Clock, Plus, Eye, 
  FileCheck, Zap, Activity, Info, ChevronRight, Filter, Download,
  Target, Calculator, Layers, Cpu
} from 'lucide-react';

/* ── Approved KPI data ── */
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
  { id: 'CTB-018', title: 'Motor Claims Frequency Update Q4', category: 'Claims Analysis', description: 'Updated motor loss frequency from 3.2% to 3.8% based on Q4 2025 experience data.', submittedBy: 'Amy Analyst', submittedAt: '2 hours ago', status: 'Submitted' },
  { id: 'CTB-017', title: 'Group Life Mortality Adjustment', category: 'Mortality Study', description: 'Proposed group life mortality adjustment factor of 0.92 based on 2022–2025 experience investigation.', submittedBy: 'Amy Analyst', submittedAt: '1 day ago', status: 'Submitted' },
  { id: 'CTB-016', title: 'Disability IBNR Triangle Refresh', category: 'Reserving', description: 'Refreshed disability IBNR development triangle. IBNR estimate moved from $4.2M to $4.8M.', submittedBy: 'Amy Analyst', submittedAt: '2 days ago', status: 'Approved', chiefNote: 'Validated against prior year. Approved for Q4 reserve book.' },
  { id: 'CTB-015', title: 'Annuity Lapse Study', category: 'Persistency', description: 'Lapse experience study across 8,500 annuity policies. Observed 6.2% vs expected 5.0%.', submittedBy: 'Amy Analyst', submittedAt: '3 days ago', status: 'Approved', chiefNote: 'Good analysis. Incorporated into FY2025 valuation basis.' },
  { id: 'CTB-014', title: 'Credit Life Profitability Dashboard', category: 'Profitability', description: 'New credit life product profitability breakdown. Shows 12% margin erosion.', submittedBy: 'Amy Analyst', submittedAt: '5 days ago', status: 'Returned', chiefNote: 'Expense allocation methodology needs revision.' },
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

  const pendingCount = contributions.filter(c => c.status === 'Submitted').length;
  const invisibleToAdmin = contributions.filter(c => c.status !== 'Approved');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* 1. TOP STATS HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Current Solvency Ratio", value: "215%", trend: "115% Surplus", trendDir: "up", icon: Shield, col: "indigo" },
          { title: "GWP (Gross Premiums)", value: "$142.5M", trend: "+12.4% YoY", trendDir: "up", icon: DollarSign, col: "emerald" },
          { title: "Aggregate Loss Ratio", value: "63.8%", trend: "Adverse +1.2%", trendDir: "down", icon: AlertTriangle, col: "rose" },
          { title: "MCEV (Market Value)", value: "$1.84B", trend: "+$42M MTM", trendDir: "up", icon: Target, col: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.col}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 bg-${stat.col}-50 rounded-2xl`}>
                <stat.icon className={`w-5 h-5 text-${stat.col}-600`} />
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trendDir === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
               <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 2. COMMAND TAB SWITCHER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-2">
         <div className="flex gap-8">
            {[
               { id: 'dashboards', label: 'Tactical Viewports', icon: Layers },
               { id: 'pipeline', label: 'Governance Pipeline', icon: FileCheck },
            ].map(tab => (
               <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 pb-4 px-2 transition-all relative group ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{tab.label}</span>
                  {tab.id === 'pipeline' && pendingCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center -mt-4 -mr-4 animate-bounce">
                      {pendingCount}
                    </span>
                  )}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full shadow-[0_4px_12px_rgba(79,70,229,0.3)] animate-in slide-in-from-bottom-2" />}
               </button>
            ))}
         </div>
         <div className="flex items-center gap-4 mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
               <Filter className="w-3.5 h-3.5" /> Filter Parameters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
               <Download className="w-3.5 h-3.5" /> Export Portfolio
            </button>
         </div>
      </div>

      {activeTab === 'dashboards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Loss Ratio Chart (Premium Glassmorphism) */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 flex flex-col relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 rotate-12"><Activity className="w-24 h-24 text-indigo-600" /></div>
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-indigo-600" />
                       Loss Ratio Performance
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weighted by Gross Written Premium</p>
                  </div>
                  <div className="flex gap-1">
                     {[1,2,3].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-slate-100'}`} />)}
                  </div>
               </div>
               <div className="h-[340px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lossRatioData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="product" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
                        cursor={{ fill: '#f8fafc', radius: 12 }}
                      />
                      <Bar dataKey="lossRatio" radius={[12, 12, 0, 0]} barSize={48}>
                        {lossRatioData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.lossRatio > 70 ? '#f43f5e' : entry.lossRatio > 55 ? '#6366f1' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Portfolio Mix (Premium Glassmorphism) */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 flex flex-col relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 -rotate-12"><Cpu className="w-24 h-24 text-indigo-600" /></div>
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                       <PieIcon className="w-5 h-5 text-indigo-600" />
                       Strategic Portfolio Mix
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Capital Allocation Framework</p>
                  </div>
               </div>
               <div className="h-[340px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={portfolioMix} cx="50%" cy="50%" outerRadius={120} innerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                        {portfolioMix.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total GWP</p>
                     <p className="text-2xl font-black text-slate-800 tracking-tighter italic">$142M</p>
                  </div>
               </div>
            </div>

            {/* Approved Insights (High-Density Table) */}
            <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden mt-4">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Verified Actuarial Insights</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data signed-off by Chief Actuary & Published to Enterprise</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 border-dashed">Governance Standard Ready</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                           <th className="px-8 py-4">Dimension</th>
                           <th className="px-8 py-4">Title & Objective</th>
                           <th className="px-8 py-4">Lead Analyst</th>
                           <th className="px-8 py-4">Impact Score</th>
                           <th className="px-8 py-4 text-center">Verification</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {contributions.filter(c => c.status === 'Approved').map((c, i) => (
                           <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                              <td className="px-8 py-5">
                                 <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100/50">{c.category}</span>
                              </td>
                              <td className="px-8 py-5">
                                 <div>
                                    <p className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{c.title}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 italic truncate w-80">{c.description}</p>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase border border-slate-200">A</div>
                                    <span className="text-[10px] font-bold text-slate-700">{c.submittedBy}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                       <span>Materiality</span>
                                       <span>8.4</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-emerald-500 w-[84%]" />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex justify-center">
                                    <div className="p-1 px-2 bg-emerald-50 rounded-lg flex items-center gap-2 border border-emerald-100">
                                       <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                       <span className="text-[10px] font-black text-emerald-700 uppercase">CHIEF_VERIFIED</span>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           {/* Pipeline Analytics */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Awaiting Governance", count: pendingCount, icon: Clock, col: "amber" },
                { label: "Sign-offs Finalized", count: contributions.filter(c => c.status === 'Approved').length, icon: CheckCircle, col: "emerald" },
                { label: "Revision Queue", count: contributions.filter(c => c.status === 'Returned').length, icon: Info, col: "indigo" },
              ].map((p, i) => (
                 <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-${p.col}-50 flex items-center justify-center`}>
                       <p.icon className={`w-6 h-6 text-${p.col}-600`} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.label}</p>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{p.count}</p>
                    </div>
                 </div>
              ))}
           </div>

           {/* Full Submission Management System */}
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Basis Governance & Submissions</h3>
                  <button onClick={() => setShowDraftForm(!showDraftForm)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                     <Plus className="w-4 h-4" /> New Submission Block
                  </button>
              </div>

              {showDraftForm && (
                 <div className="p-8 bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Title</label>
                          <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none transition-all" placeholder="e.g. Mortality Integral Calibration age 60-80" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimension Category</label>
                          <select value={draftCategory} onChange={e => setDraftCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none transition-all">
                             <option>Claims Analysis</option>
                             <option>Mortality Study</option>
                             <option>Reserving</option>
                             <option>Persistency</option>
                             <option>Profitability</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-2 mb-8">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Methodology & Executive Summary</label>
                       <textarea value={draftDescription} onChange={e => setDraftDescription(e.target.value)} rows={4} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none" placeholder="Detail the Bayesian priors, datasets used, and ultimate impact on BEL..." />
                    </div>
                    <div className="flex justify-end gap-4">
                       <button onClick={() => setShowDraftForm(false)} className="px-6 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                       <button onClick={submitDraft} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Submit to Sovereign Node</button>
                    </div>
                 </div>
              )}

              <div className="divide-y divide-slate-100">
                  {contributions.map((c, i) => (
                    <div key={i} className={`p-8 hover:bg-slate-50/70 transition-all group ${c.status === 'Returned' ? 'bg-rose-50/20' : ''}`}>
                       <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                                <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-indigo-50 text-indigo-600">{c.category}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                                  c.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                  c.status === 'Submitted' ? 'bg-amber-50 text-amber-600' :
                                  'bg-rose-50 text-rose-600'
                                }`}>{c.status}</span>
                             </div>
                             <h4 className="text-base font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                             <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">{c.description}</p>
                             {c.chiefNote && (
                                <div className="mt-4 p-4 bg-white/60 border border-slate-200 rounded-2xl flex items-start gap-4">
                                   <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border-2 border-white shadow-lg"><Zap className="w-4 h-4 text-white" /></div>
                                   <div className="text-[11px] leading-relaxed">
                                      <span className="font-black text-slate-900 uppercase tracking-widest mr-2">Chief Actuary:</span>
                                      <span className="text-slate-600">{c.chiefNote}</span>
                                   </div>
                                </div>
                             )}
                          </div>
                          
                          <div className="shrink-0 flex md:flex-col items-center md:items-end gap-3">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">by {c.submittedBy} · {c.submittedAt}</span>
                             
                             {c.status === 'Submitted' && isChief && (
                                <div className="flex gap-2 mt-2">
                                   <button 
                                      onClick={() => updateStatus(c.id, 'Approved', 'Validated. Basis confirmed.')}
                                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                                   >Approve</button>
                                   <button 
                                      onClick={() => updateStatus(c.id, 'Returned', 'Basis variance too high. Re-run with smoothing.')}
                                      className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                                   >Reject</button>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

