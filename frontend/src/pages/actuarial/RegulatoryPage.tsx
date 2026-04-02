import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Download, 
  RefreshCw, 
  Layers,
  PieChart as PieIcon,
  Activity,
  History,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { actuarialApi } from '../../services/actuarialApi';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const transitionData = [
  { name: 'GMM (Legacy)', value: 45, color: '#6366f1' },
  { name: 'PAA (Onerous)', value: 25, color: '#f43f5e' },
  { name: 'PAA (Non-Onerous)', value: 30, color: '#10b981' },
];

const csmMovement = [
  { stage: 'Opening', csm: 120 },
  { stage: 'New Business', csm: 18 },
  { stage: 'Interest Accretion', csm: 5 },
  { stage: 'Release to P&L', csm: -22 },
  { stage: 'Closing', csm: 121 },
];

export const RegulatoryPage: React.FC = () => {
  const [activeStandard, setActiveStandard] = useState<'ifrs17' | 'solvency2'>('ifrs17');
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateGMM = useMutation({
    mutationFn: () => actuarialApi.ifrs17GMM({ group_id: 'LIFE_TRM_2025' }),
    onSuccess: (data) => {
      setIsCalculated(true);
      toast.success('IFRS 17 Valuation Engine: GMM Run Complete', {
        icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
      });
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-xl">
                <Scale className="w-6 h-6 text-indigo-600" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500/30 underline-offset-8">Regulatory Reporting Hub</h2>
          </div>
          <p className="text-sm text-slate-500 font-bold mt-3 max-w-2xl bg-slate-50 p-2 border-l-4 border-indigo-500">
            IFRS 17 Sovereign Compliance Node. Calculate CSM, manage Transition Approaches, and generate Solvency II Pillar 3 disclosures with automated audit trails.
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => calculateGMM.mutate()}
             disabled={calculateGMM.isPending}
             className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-xl flex items-center gap-2 group"
           >
              {calculateGMM.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />}
              Execute GMM Valuation
           </button>
        </div>
      </div>

      {/* Standard Toggles */}
      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit border border-slate-200/50">
        <button onClick={() => setActiveStandard('ifrs17')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeStandard === 'ifrs17' ? 'bg-white text-indigo-600 shadow-premium' : 'text-slate-500 hover:text-slate-800'}`}>IFRS 17 (GMM/PAA)</button>
        <button onClick={() => setActiveStandard('solvency2')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeStandard === 'solvency2' ? 'bg-white text-indigo-600 shadow-premium' : 'text-slate-500 hover:text-slate-800'}`}>Solvency II (SCR/MCR)</button>
      </div>

      {activeStandard === 'ifrs17' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Main Controls & Status */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            <div className="grid grid-cols-3 gap-6">
               <MetricCard title="Total CSM Balance" value="$121.4M" trend="+1.2%" trendDirection="up" icon={<History className="w-5 h-5" />} />
               <MetricCard title="LRC (Liability)" value="$842.0M" trend="Adjusted Flow" trendDirection="neutral" icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
               <MetricCard title="Onerous Groups" value="12" trend="Review Needed" trendDirection="down" icon={<AlertCircle className="w-5 h-5 text-rose-500" />} />
            </div>

            {/* CSM Movement Waterfall */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">CSM Movement Roll-forward</h3>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Audit Ready</span>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={csmMovement} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={v => `$${v}M`} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', shadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="csm" name="CSM Balance" radius={[8, 8, 0, 0]} barSize={50}>
                           {csmMovement.map((entry, i) => (
                             <Cell key={i} fill={entry.csm < 0 ? '#f43f5e' : i === 4 ? '#6366f1' : '#818cf8'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Entity Disclosure Summary */}
            <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative group">
               <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform">
                  <FileText className="w-64 h-64" />
               </div>
               <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black italic tracking-tighter uppercase">IFRS 17 Disclosure Summary</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Financial Performance Breakdown (Sovereign Node)</p>
                  </div>
                  <div className="flex gap-2">
                     <Link to="/actuarial/regulatory/ifrs17-details" className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
                        <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                     </Link>
                     <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
                        <Download className="w-5 h-5 text-indigo-400" />
                     </button>
                  </div>
               </div>
               <div className="grid grid-cols-4 gap-6 relative z-10">
                  {[
                    { label: 'Ins. Service Result', value: '$42.1M', sub: 'Revenue - Claims' },
                    { label: 'Finance Expense', value: '-$8.5M', sub: 'Discount Impact' },
                    { label: 'Contractual Svc Margin', value: '$121.4M', sub: 'Unearned Profit' },
                    { label: 'Total Equity Impact', value: '$155.0M', sub: 'Retained Earnings' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                       <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{item.label}</p>
                       <p className="text-xl font-black text-white">{item.value}</p>
                       <p className="text-[8px] text-indigo-400 italic font-black uppercase tracking-widest mt-2">{item.sub}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Panel: Approach & Governance */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium">
                <div className="flex items-center gap-3 mb-8">
                   <PieIcon className="w-5 h-5 text-indigo-600" />
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Portfolio Approaches</h3>
                </div>
                <div className="h-[220px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={transitionData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                            {transitionData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                         </Pie>
                         <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                   {transitionData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                         </div>
                         <span className="text-xs font-black text-slate-800 italic">{item.value}%</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/50 to-indigo-700/50" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <Lock className="w-5 h-5 text-indigo-200" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Actuarial Governance</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                         <p className="text-[9px] font-black uppercase text-indigo-200 tracking-widest mb-1">Last Full Calc</p>
                         <p className="text-sm font-bold">14 Oct 2025 • 22:42 GMT</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                         <p className="text-[9px] font-black uppercase text-indigo-200 tracking-widest mb-1">Auditor Sign-off</p>
                         <p className="text-sm font-bold text-indigo-100 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-white" /> Deloitte Sovereignty ✓</p>
                      </div>
                      <button className="w-full py-4 bg-white text-indigo-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition shadow-xl flex items-center justify-center gap-2">
                         Download Regulatory Deck
                         <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeStandard === 'solvency2' && (
        <div className="bg-white p-20 rounded-[50px] border border-slate-100 shadow-premium flex flex-col items-center text-center animate-in slide-in-from-bottom-10">
           <div className="p-6 bg-slate-50 rounded-full mb-8">
              <ShieldCheck className="w-12 h-12 text-slate-300" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Solvency II Pillar 3 disclosure Node</h3>
           <p className="text-slate-500 font-bold max-w-sm mt-4 uppercase tracking-widest text-[11px]">
              Enterprise-grade SCR/MCR ratio breakdown, QRT generation, and ORSA report management.
           </p>
           <Link to="/actuarial/regulatory/solvency-ii" className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-800 transition shadow-xl shadow-slate-900/20">Enter Pillar 3 Node</Link>
        </div>
      )}
    </div>
  );
};
