import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  FileText, 
  ShieldCheck, 
  Globe, 
  PieChart as PieChartIcon, 
  Zap, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  Lock,
  Search,
  ArrowRight
} from 'lucide-react';
import { complianceApi } from '../../services/complianceApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';

export const RegulatoryReportingPage: React.FC = () => {
    const { data: solvency, isLoading: loadingSolvency } = useQuery({
        queryKey: ['solvency-ii'],
        queryFn: complianceApi.getSolvencyIIReport
    });

    const { data: ifrs17 } = useQuery({
        queryKey: ['ifrs-17'],
        queryFn: complianceApi.getIFRS17Impact
    });

    const esgMutation = useMutation({
        mutationFn: (vars: { carbon: number; diversity: number }) => 
            complianceApi.submitESGDisclosure({ carbon_offset: vars.carbon, diversity_index: vars.diversity })
    });

    if (loadingSolvency || !solvency) return <div className="p-8 animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Authenticating Regulatory Node...</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    // Safely extract data from protected payload
    const solvencyData = solvency?.data;
    const ifrs17Data = ifrs17?.data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Regulatory Reporting</h1>
                        <SovereignVerifiedBadge signature={solvency?.forensic_signature} />
                    </div>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.4em] text-[10px]">Global Compliance Sentinel & Pillar-3 Automation</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export XBRL
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                        <RefreshCw className="w-4 h-4" />
                        Force Re-Sync
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Solvency II Monitor */}
                <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                             <h3 className="text-xl font-black text-slate-900">Solvency II Pillar-3 Core</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SCR/MCR Capital Adequacy Ratios</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                Optimal Status
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                         <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'SCR', ratio: solvencyData?.scr_ratio || 0, target: 1.5 },
                                    { name: 'MCR', ratio: solvencyData?.mcr_ratio || 0, target: 3.0 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} domain={[0, 4]} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="ratio" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={60}>
                                        <Cell fill="#6366f1" />
                                        <Cell fill="#10b981" />
                                    </Bar>
                                    <Bar dataKey="target" fill="#f1f5f9" radius={[12, 12, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="space-y-6 flex flex-col justify-center">
                              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">SCR Ratio</p>
                                   <p className="text-3xl font-black text-indigo-600">{(solvencyData?.scr_ratio || 0) * 100}%</p>
                                   <p className="text-[9px] text-slate-500 font-medium mt-1 italic">Threshold requirement: 100%</p>
                              </div>
                              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">MCR Ratio</p>
                                   <p className="text-3xl font-black text-emerald-600">{(solvencyData?.mcr_ratio || 0) * 100}%</p>
                                   <p className="text-[9px] text-slate-500 font-medium mt-1 italic">Floor requirement: 100%</p>
                              </div>
                         </div>
                    </div>
                </div>

                {/* IFRS 17 Impact Node */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                             <Lock className="w-16 h-16" />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tighter mb-1">IFRS 17 Ledger</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8 italic">Contractual Service Margin (CSM)</p>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-4xl font-black tracking-tighter">${((ifrs17Data?.csm_balance || 0) / 1000000).toFixed(1)}M</p>
                                <p className="text-[10px] text-indigo-400 font-black uppercase mt-1">Total CSM Balance</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl">
                                    <p className="text-xs font-black italic">${((ifrs17Data?.risk_adjustment || 0) / 1000000).toFixed(1)}M</p>
                                    <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Risk Adjustment</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl">
                                    <p className="text-xs font-black italic">{ifrs17Data?.discount_rate_applied || 'N/A'}</p>
                                    <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Discount Curve</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <Globe className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-bold">ESG Disclosure v2.0</h3>
                        </div>
                        <div className="space-y-4 mb-8">
                             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%]" />
                             </div>
                             <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                <span>Diversity Index</span>
                                <span className="text-emerald-600 italic">0.75 Target met</span>
                             </div>
                        </div>
                        <button 
                            onClick={() => esgMutation.mutate({ carbon: 15, diversity: 0.75 })}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            {esgMutation.isPending ? 'Signing...' : 'Submit ESG Disclosure'}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Audit Trail & Regulatory Calendar */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900 uppercase italic">Regulatory Filing Roadmap</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Upcoming Mandatory submissions</p>
                        </div>
                     </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                    {[
                        { name: 'SFCR (Pillar 3)', date: 'Apr 15, 2026', priority: 'CRITICAL', status: 'In Review' },
                        { name: 'ORSA Report', date: 'May 02, 2026', priority: 'HIGH', status: 'Pending' },
                        { name: 'IFRS 17 Disclosure', date: 'Jun 12, 2026', priority: 'MEDIUM', status: 'Drafting' },
                    ].map((filing, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${filing.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                                    {filing.priority}
                                </span>
                                <FileSearch className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                             </div>
                             <h4 className="font-black text-slate-900 tracking-tight">{filing.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{filing.date}</p>
                             <div className="mt-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-600">{filing.status}</span>
                                </div>
                                <button className="p-2 rounded-xl bg-white border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Download className="w-3 h-3" />
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
