import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  AlertCircle, 
  Globe, 
  DollarSign,
  PieChart as PieChartIcon,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';

export const TreasuryPage: React.FC = () => {
    const [sweepTarget, setSweepTarget] = useState('Treasury-Master-001');
    const { data: liquidity, isLoading } = useQuery({
        queryKey: ['treasury-liquidity'],
        queryFn: financialApi.getTreasuryLiquidity,
        refetchInterval: 30000 // Professional real-time feel
    });

    const { data: exposure } = useQuery({
        queryKey: ['treasury-fx'],
        queryFn: financialApi.getFXExposure
    });

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

    if (isLoading) return <div className="p-8 animate-pulse text-slate-400">Loading Treasury Node...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Treasury Management</h1>
                        <SovereignVerifiedBadge signature={liquidity?.forensic_signature} />
                    </div>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Global Liquidity & FX Sentinel v4.0</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-2xl">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-white font-black uppercase tracking-tighter">Market Connectivity: ACTIVE</span>
                    </div>
                </div>
            </header>

            {/* Top KPIs */}
            <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'CASH ON HAND', value: `$${(liquidity?.cash_on_hand / 1000000).toFixed(1)}M`, trend: '+2.4%', icon: DollarSign, color: 'text-indigo-600' },
                  { label: 'LIQUIDITY COVERAGE (LCR)', value: liquidity?.liquidity_coverage_ratio, trend: 'Optimal', icon: ShieldCheck, color: 'text-emerald-600' },
                  { label: 'NET STABLE FUNDING', value: liquidity?.net_stable_funding_ratio, trend: 'Stabilizing', icon: Activity, color: 'text-blue-600' },
                  { label: 'TOTAL FX EXPOSURE', value: `$${(exposure?.total_exposure_usd / 1000000).toFixed(1)}M`, trend: 'Hedged', icon: Globe, color: 'text-amber-600' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium group hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${kpi.color} group-hover:bg-indigo-50 transition-colors`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{kpi.trend}</span>
                        </div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</h4>
                        <p className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Global Liquidity Concentration */}
                <div className="col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Regional Liquidity Allocation</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Multi-Currency Exposure Analysis</p>
                        </div>
                        <div className="flex gap-2">
                             <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 transition-colors">Daily</button>
                             <button className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-500/20">Real-Time</button>
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { t: '08:00', usd: 82, zar: 42, eur: 12 },
                                { t: '10:00', usd: 85, zar: 45, eur: 15 },
                                { t: '12:00', usd: 84, zar: 43, eur: 14 },
                                { t: '14:00', usd: 88, zar: 46, eur: 18 },
                                { t: '16:00', usd: 90, zar: 48, eur: 20 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="usd" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsd)" />
                                <Area type="monotone" dataKey="zar" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Automated Sweep Controller */}
                <div className="col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Autonomous Sweep</h3>
                        <p className="text-slate-400 text-xs mb-8">Concentrate liquidity into Master Treasury Node automatically.</p>
                        
                        <div className="space-y-4 mb-8">
                             <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Destination</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold">{sweepTarget}</span>
                                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                                </div>
                             </div>
                        </div>

                        <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20">
                            <RefreshCw className="w-4 h-4" />
                            Trigger Force Sweep
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-bold">FX Delta Risk</h3>
                        </div>
                        <div className="space-y-5">
                            {exposure?.exposures?.map((exp: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-600 group-hover:bg-indigo-50 transition-colors">
                                            {exp.pair}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">${(exp.delta / 1000000).toFixed(1)}M</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Open Exposure</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-indigo-600">{exp.hedge_ratio * 100}%</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">Hedged</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status Grid */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-slate-900">Global Account Hierarchy</h3>
                   <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                      <Zap className="w-3 h-3" />
                      Neural Recon
                   </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {liquidity?.positions?.map((pos: any, i: number) => (
                        <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <Building2 className="w-6 h-6 text-slate-400" />
                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${pos.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {pos.status}
                                </div>
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">{pos.location}</h5>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{pos.currency} Master Account</p>
                            <div className="mt-6 flex justify-between items-end">
                                <p className="text-xl font-black text-slate-900">{pos.currency} {pos.amount.toLocaleString()}</p>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
