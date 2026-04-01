import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Activity, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  ChevronRight, 
  ArrowRight,
  Calculator,
  Target,
  FlaskConical,
  Scale
} from 'lucide-react';
import { actuarialApi } from '../../services/actuarialApi';
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
  AreaChart,
  Area,
  ComposedChart,
  Line,
  Cell
} from 'recharts';

export const ALMPage: React.FC = () => {
    const [shockBps, setShockBps] = useState(100);

    const assetProjection = useMutation({
        mutationFn: (vars: { assets: any[]; periods: number; rate: number }) => 
            actuarialApi.getAssetProjection({ assets: vars.assets, periods: vars.periods, reinvestment_rate: vars.rate })
    });

    const sensitivity = useMutation({
        mutationFn: (vars: { cashflows: any[]; rate: number; shock: number }) => 
            actuarialApi.getRateSensitivity({ liability_cashflows: vars.cashflows, base_rate: vars.rate, shock_bps: vars.shock })
    });

    // Mock data for initial render
    const initialProjectionData = [
        { year: 0, assets: 100, liabilities: 95 },
        { year: 5, assets: 108, liabilities: 102 },
        { year: 10, assets: 115, liabilities: 110 },
        { year: 15, assets: 124, liabilities: 118 },
        { year: 20, assets: 135, liabilities: 128 },
    ];

    return (
        <div className="space-y-8 animate-in zoom-in duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">ALM & Capital Strategy</h1>
                        <SovereignVerifiedBadge signature="ALM_ACTUARIAL_V4_SECURED" />
                    </div>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.4em] text-[10px]">Asset-Liability Matching Node • Liquidity Ladder v4.2</p>
                </div>
                <div className="flex gap-4">
                     <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        <Calculator className="w-4 h-4" />
                        Run Stochastic Model
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Duration Matching Visualizer */}
                <div className="col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium relative">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                             <h3 className="text-xl font-black text-slate-900">Duration Gap Analysis</h3>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Asset vs Liability Maturity Profile</p>
                        </div>
                        <div className="p-1 px-3 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">
                            Gap: +0.42 Years
                        </div>
                    </div>

                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={initialProjectionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} label={{ value: 'Year', position: 'insideBottomRight', offset: 0, fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} label={{ value: '$Millions', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="assets" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={40} />
                                <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Interest Rate Shock Box */}
                <div className="col-span-4 flex flex-col gap-8">
                     <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                             <TrendingUp className="w-16 h-16" />
                        </div>
                        <h3 className="text-xl font-black italic mb-2">Sensitivity Stress</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 italic">Parallel Rate Shocks</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Shock Magnitude {shockBps}bps</label>
                                <input 
                                    type="range" 
                                    min="-300" 
                                    max="300" 
                                    step="50"
                                    value={shockBps}
                                    onChange={(e) => setShockBps(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <button 
                                onClick={() => sensitivity.mutate({ cashflows: [], rate: 0.045, shock: shockBps })}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                {sensitivity.isPending ? 'Simulating Shock...' : 'Apply Rate Shock'}
                                <Activity className="w-4 h-4 text-indigo-400" />
                            </button>

                            {sensitivity.data && (
                                <div className="p-4 bg-white/5 rounded-2xl animate-in zoom-in">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2 italic">Capital Impact</p>
                                    <p className="text-xl font-black text-red-400">-${(sensitivity.data.impact / 1000000).toFixed(1)}M</p>
                                    <p className="text-[8px] text-slate-500 mt-1 uppercase italic">Total Net Asset Value Delta</p>
                                </div>
                            )}
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-bold">Capital Adequacy 99%</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Asset Duration', value: '7.82y', color: 'bg-indigo-500' },
                                { label: 'Liab. Duration', value: '7.40y', color: 'bg-slate-200' },
                                { label: 'Convexity', value: '1.24', color: 'bg-emerald-500' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 italic">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            {/* Strategic Rebalancing Panel */}
            <div className="bg-emerald-50/50 p-10 rounded-[50px] border border-emerald-100 relative group overflow-hidden">
                <div className="absolute -right-20 -top-20 p-20 opacity-5 group-hover:rotate-45 transition-transform">
                     <FlaskConical className="w-64 h-64 text-emerald-900" />
                </div>
                
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                        <Scale className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-emerald-900 italic tracking-tighter uppercase">Capital Strategy Rebalancing</h2>
                        <p className="text-emerald-700/60 text-[10px] font-black uppercase tracking-widest">Optimized Asset Allocation for Matching Horizon</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-8">
                     {[
                        { name: 'Corporate Bonds', alloc: '45%', action: 'Buy', color: 'text-indigo-600' },
                        { name: 'Government Gilts', alloc: '30%', action: 'Hold', color: 'text-slate-600' },
                        { name: 'Mortgage Backed', alloc: '15%', action: 'Sell', color: 'text-red-500' },
                        { name: 'Infrastructure', alloc: '10%', action: 'Increase', color: 'text-emerald-500' },
                     ].map((asset, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-emerald-100 shadow-sm relative hover:translate-y-[-4px] transition-transform">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{asset.name}</p>
                             <p className="text-3xl font-black text-slate-900">{asset.alloc}</p>
                             <div className="mt-4 flex justify-between items-center">
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-slate-50 ${asset.color}`}>
                                    {asset.action}
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                             </div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );
};
