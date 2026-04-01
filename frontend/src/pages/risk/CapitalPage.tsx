import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Zap, 
  ArrowRight,
  Target,
  BarChart3,
  Scale,
  LineChart as LineChartIcon
} from 'lucide-react';
import { riskApi } from '../../services/riskApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Bar
} from 'recharts';

export const CapitalPage: React.FC = () => {
    const { data: capital, isLoading } = useQuery({
        queryKey: ['capital-allocation'],
        queryFn: riskApi.getCapitalAllocation
    });

    const projectionData = [
        { year: '2024', assets: 420, liabilities: 380, gap: 40 },
        { year: '2025', assets: 445, liabilities: 410, gap: 35 },
        { year: '2026', assets: 480, liabilities: 450, gap: 30 },
        { year: '2027', assets: 510, liabilities: 490, gap: 20 },
        { year: '2028', assets: 550, liabilities: 540, gap: 10 },
    ];

    if (isLoading) return <div className="p-8 animate-pulse text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing ALM Strategic Node...</div>;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-700">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">ALM Strategic Node</h1>
                        <SovereignVerifiedBadge signature="ALM_CORE_V4_SECURED" />
                    </div>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.3em] text-[10px]">Asset-Liability Matching & Capital Adequacy Oversight</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20">
                        Run Sensitivity Shock
                    </button>
                </div>
            </header>

            {/* Strategic Capital Stats */}
            <div className="grid grid-cols-4 gap-6">
                {[
                   { label: 'Available Capital', value: '$388M', icon: Building2, color: 'text-indigo-600' },
                   { label: 'SCR Requirement', value: '$238M', icon: Target, color: 'text-rose-600' },
                   { label: 'MCR Minimum', value: '$92M', icon: ShieldCheck, color: 'text-emerald-600' },
                   { label: 'Solvency Ratio', value: '163%', icon: Activity, color: 'text-blue-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Long-term Gap Projection */}
                <div className="col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Duration Gap Projection</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Asset vs Liability Maturity Matching</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl uppercase tracking-widest">
                                Convexity Optimized
                            </span>
                        </div>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={projectionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingBottom: '20px' }} />
                                <Bar dataKey="assets" name="Assets" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                                <Bar dataKey="liabilities" name="Liabilities" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={40} />
                                <Line type="monotone" dataKey="gap" name="Duration Gap" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Economic Scenario Hub */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-600/20">
                        <div className="flex items-center gap-4 mb-6">
                            <Zap className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold">Curve Sensitivity</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { shock: '+100bps Parallel', impact: '-$12.4M', risk: 'HIGH' },
                                { shock: '-50bps Flat', impact: '+$4.2M', risk: 'LOW' },
                                { shock: 'Twist (Steep)', impact: '-$5.8M', risk: 'MED' },
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-xs font-bold text-white">{s.shock}</p>
                                        <p className="text-[9px] text-slate-500 font-black uppercase mt-1">{s.risk} RISK</p>
                                    </div>
                                    <span className={`text-xs font-black ${s.impact.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {s.impact}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium flex-1">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
                            Capital Velocity
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                        </h4>
                        <div className="space-y-6">
                             <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter italic">24.5%</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Internal Rate of Return</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-600">+1.2%</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth YoY</p>
                                </div>
                             </div>
                             <button className="w-full py-4 bg-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                <Scale className="w-3 h-3" />
                                Rebalance Strategy
                                <ArrowRight className="w-3 h-3" />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
