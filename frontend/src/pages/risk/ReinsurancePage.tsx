import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Gavel, 
  ShieldAlert, 
  TrendingUp, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Zap, 
  FileText, 
  Plus, 
  CheckCircle2,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { riskApi } from '../../services/riskApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';

export const ReinsurancePage: React.FC = () => {
    const [simulateLimit, setSimulateLimit] = useState(10000000);
    const [simulateRetention, setSimulateRetention] = useState(1000000);

    const { data: treaties, isLoading: loadingTreaties } = useQuery({
        queryKey: ['reinsurance-treaties'],
        queryFn: riskApi.getReinsuranceTreaties
    });

    const { data: recoveries } = useQuery({
        queryKey: ['reinsurance-recoveries'],
        queryFn: riskApi.getReinsuranceRecoveries
    });

    const simulation = useMutation({
        mutationFn: (vars: { limit: number; retention: number }) => 
            riskApi.simulateTreatyPlacement({ coverage_limit: vars.limit, retention: vars.retention })
    });

    if (loadingTreaties) return <div className="p-8 animate-pulse text-slate-400 font-bold">Initializing Reinsurance Gateway...</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Reinsurance Gateway</h1>
                        <SovereignVerifiedBadge signature={treaties?.[0]?.forensic_signature || (treaties?.length > 0 ? "EXECUTIVE_SIGN_OFF" : undefined)} />
                    </div>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.3em] text-[10px]">Tier-1 Underwriting Node & Dynamic Placements</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                    <Plus className="w-4 h-4" />
                    New Treaty Placement
                </button>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Active Treaty Ledger */}
                <div className="col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                             <h3 className="text-xl font-bold text-slate-900">Active Treaty Ledger</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Multi-Reinsurer Risk Transfer Panel</p>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                           Total Capacity: $540M
                        </div>
                    </div>

                    <div className="space-y-4">
                        {treaties?.map((treaty: any, i: number) => (
                            <div key={i} className="group p-6 rounded-3xl bg-slate-50 border border-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all cursor-crosshair">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 transition-colors">
                                            <Gavel className="w-6 h-6 text-slate-400 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{treaty.reinsurer}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{treaty.type} • {treaty.layer || treaty.retention}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-8">
                                        <div>
                                            <p className="text-sm font-black text-slate-900">${(treaty.premium / 1000000).toFixed(1)}M</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase">Reserved Premium</p>
                                        </div>
                                        <div className="bg-emerald-50 px-3 py-1 rounded-lg text-[9px] font-black text-emerald-600 uppercase">
                                            {treaty.status}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Visualizer */}
                <div className="col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                         <h3 className="text-lg font-bold mb-6">Market Capacity Concentration</h3>
                         <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                    { subject: 'MUNICH', value: 92, fullMark: 100 },
                                    { subject: 'SWISS', value: 85, fullMark: 100 },
                                    { subject: 'HANNOVER', value: 78, fullMark: 100 },
                                    { subject: 'SCOR', value: 65, fullMark: 100 },
                                    { subject: 'LLOYDS', value: 72, fullMark: 100 },
                                ]}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fontWeight: 'bold', fill: '#94a3b8'}} />
                                    <Radar name="Market" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-600/30">
                        <div className="flex items-center gap-4 mb-4">
                             <ShieldAlert className="w-5 h-5 text-indigo-200" />
                             <h4 className="text-sm font-bold">Recoverable Claims</h4>
                        </div>
                        <p className="text-3xl font-black italic tracking-tighter">
                            ${(recoveries?.total_recoverable / 1000000).toFixed(1)}M
                        </p>
                        <div className="mt-6 space-y-3 opacity-80">
                            {recoveries?.pending_settlements?.slice(0, 2).map((s: any, i: number) => (
                                <div key={i} className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-indigo-400 pb-2">
                                    <span>{s.reinsurer}</span>
                                    <span>${(s.recoverable / 1000000).toFixed(1)}M</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Pricing Simulator */}
            <div className="bg-slate-900 p-10 rounded-[50px] text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="w-48 h-48" />
                 </div>
                 
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Activity className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">AI Deployment Simulator</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Neural Pricing Engine v2.4 (Monte Carlo Bayesian)</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">Coverage Limit (USD)</label>
                            <input 
                                type="range" 
                                min="1000000" 
                                max="100000000" 
                                step="1000000"
                                value={simulateLimit}
                                onChange={(e) => setSimulateLimit(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-black text-white italic">
                                <span>$1M</span>
                                <span className="text-indigo-400 text-sm">${(simulateLimit / 1000000).toFixed(0)}M</span>
                                <span>$100M</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">Self-Retention (Priority)</label>
                            <input 
                                type="range" 
                                min="100000" 
                                max="10000000" 
                                step="100000"
                                value={simulateRetention}
                                onChange={(e) => setSimulateRetention(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-black text-white italic">
                                <span>$0.1M</span>
                                <span className="text-emerald-400 text-sm">${(simulateRetention / 1000000).toFixed(1)}M</span>
                                <span>$10M</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => simulation.mutate({ limit: simulateLimit, retention: simulateRetention })}
                            className="w-full py-5 bg-indigo-600 rounded-[24px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-600/20"
                        >
                            {simulation.isPending ? 'Neural Processing...' : 'Get Neural Premium Quote'}
                            {!simulation.isPending && <ArrowUpRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-[40px] p-8 border border-white/5 relative">
                        {simulation.data ? (
                            <div className="animate-in zoom-in duration-500">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 border-b border-indigo-400/20 pb-2 flex justify-between items-center">
                                    Simulation Output
                                    <span className="text-emerald-500 font-bold italic tracking-tighter">Confidence: {simulation.data.confidence_score * 100}%</span>
                                </h4>
                                <div className="space-y-6">
                                     <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Calculated Premium</p>
                                        <p className="text-5xl font-black italic tracking-tighter">${(simulation.data.quoted_premium).toLocaleString()}</p>
                                     </div>
                                     <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">IA Recommendation</p>
                                        <p className="text-xs font-bold text-emerald-50">{simulation.data.recommendation}</p>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Zap className="w-12 h-12 mb-4 text-indigo-500" />
                                <p className="text-xs font-black uppercase tracking-[0.2em]">Awaiting Simulation Input</p>
                                <p className="text-[10px] font-medium text-slate-500 mt-2 max-w-[200px]">Adjust parameters to calculate optimal reinsurance premiums.</p>
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
  </svg>
);
