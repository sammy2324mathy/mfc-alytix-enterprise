import React, { useState } from 'react';
import { 
  History, 
  Layers, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Activity,
  FileText,
  ArrowUpRight,
  Database,
  Calculator,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  ComposedChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const CSM_WATERFALL = [
  { stage: 'Opening Balance', value: 120, type: 'base' },
  { stage: 'New Business', value: 18, type: 'up' },
  { stage: 'Interest Accretion', value: 5.2, type: 'up' },
  { stage: 'Changes in Estimates', value: -4.1, type: 'down' },
  { stage: 'Release to P&L', value: -22.5, type: 'down' },
  { stage: 'Closing Balance', value: 116.6, type: 'total' },
];

const LRC_COMPONENTS = [
  { name: 'PV of Cash Flows', assets: -840, liabilities: 840, net: 840 },
  { name: 'Risk Adjustment', assets: -42, liabilities: 42, net: 42 },
  { name: 'CSM (Deferred Profit)', assets: -116, liabilities: 116, net: 116 },
];

export const IFRS17DetailsPage: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. HEADER CMD DECK */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
                      <Scale className="w-8 h-8 text-indigo-600" />
                      IFRS 17 <span className="text-slate-300 font-light">/</span> Valuation Detail Node
                   </h2>
                   <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest text-[10px]">Granular GMM & PAA Measurement Hub • Ledger Generation v2.1</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="flex flex-col text-right">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                         <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest italic">Provisioned & Healthy</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner animate-pulse"><CheckCircle className="w-5 h-5" /></div>
                   </div>
                </div>
            </div>

            {/* 2. CSM MOVEMENTS HUB */}
            <div className="grid grid-cols-12 gap-8">
               
               {/* CSM Movement Waterfall */}
               <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl relative group overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 rotate-12"><Activity className="w-64 h-64 text-indigo-600" /></div>
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                     <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
                        <History className="w-5 h-5 text-indigo-600" />
                        CSM Movement Waterfall
                     </h3>
                     <div className="flex bg-slate-900/5 p-1 rounded-2xl border border-slate-200/50">
                        {['FY 2024', 'HY 2025', 'Q3 2025'].map(f => (
                           <button key={f} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Q3 2025' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>{f}</button>
                        ))}
                     </div>
                  </div>

                  <div className="h-[400px] w-full relative z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CSM_WATERFALL} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} textAnchor="end" angle={-45} height={60} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                           <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff' }} />
                           <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={45}>
                              {CSM_WATERFALL.map((entry, index) => (
                                 <Cell key={index} fill={entry.type === 'total' ? '#4f46e5' : entry.type === 'up' ? '#10b981' : entry.type === 'down' ? '#f43f5e' : '#94a3b8'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* CSM Stats Cards Column */}
               <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  {[
                    { label: 'Unearned Profit Unit', value: '116.6M', trend: 'Lapsed Impact', col: 'indigo', icon: TrendingDown },
                    { label: 'Implicit Discounting', value: '4.24%', trend: 'SOFR Parallel', col: 'emerald', icon: TrendingUp },
                    { label: 'Onerous Group Count', value: '12 Units', trend: 'Risk Mitigating', col: 'rose', icon: AlertCircle },
                  ].map((stat, i) => (
                     <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl group hover:border-indigo-200 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                           <div className={`p-3 bg-${stat.col}-50 rounded-2xl`}>
                              <stat.icon className={`w-5 h-5 text-${stat.col}-600`} />
                           </div>
                           <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 italic">{stat.label}</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">${stat.value}</div>
                        <p className={`text-[10px] font-black text-${stat.col}-500/80 uppercase tracking-widest mt-2`}>• {stat.trend}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* 3. LIABILITY BREAKDOWN (LRC / LIC) */}
            <div className="bg-slate-900 rounded-[50px] p-12 text-white shadow-3xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12"><Layers className="w-96 h-96 text-white" /></div>
               
               <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                     <h3 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-indigo-500/30 underline-offset-8">LRC Balance Sheet Breakdown</h3>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">Liability for Remaining Coverage (GMM Approach • Portfolios A, B, C)</p>
                  </div>
                  <Download className="w-8 h-8 text-indigo-400 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                  {LRC_COMPONENTS.map((item, i) => (
                     <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/10 transition-all group/card">
                        <div className="flex items-center justify-between mb-8">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.name}</span>
                           <Info className="w-4 h-4 text-slate-600 group-hover/card:text-indigo-400" />
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-500 uppercase">PV Factor</p>
                              <p className="text-3xl font-black italic">${item.net}M</p>
                           </div>
                           <div className="flex flex-col items-end opacity-40">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">System Node</span>
                              <span className="text-sm font-black italic text-white tracking-widest">ACT-v4</span>
                           </div>
                        </div>
                        <div className="mt-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 w-[65%]" />
                        </div>
                     </div>
                  ))}
               </div>

               {/* Data Table Preview */}
               <div className="mt-12 overflow-x-auto relative z-10">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                           <th className="pb-6 px-4">Group Identification</th>
                           <th className="pb-6 px-4">Measurement Model</th>
                           <th className="pb-6 px-4 text-right">OCI Adjustment</th>
                           <th className="pb-6 px-4 text-right">Profitability</th>
                           <th className="pb-6 px-4 text-center">Audit Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[
                          { id: 'LIFE_TRM_2024', model: 'GMM', oci: '-$4.2M', prof: 'Profitable', status: 'Locked' },
                          { id: 'ANN_LIFE_G01', model: 'VFA', oci: '+$1.1M', prof: 'Profitable', status: 'Locked' },
                          { id: 'MED_SHORT_P08', model: 'PAA', oci: '$0.0M', prof: 'Onerous', status: 'Flagged' },
                          { id: 'LTD_DIS_2025', model: 'GMM', oci: '-$0.8M', prof: 'Profitable', status: 'Locked' },
                        ].map((row, i) => (
                           <tr key={i} className="hover:bg-white/5 transition-colors group/row">
                              <td className="py-6 px-4">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black italic group-hover/row:text-indigo-400 transition-colors uppercase tracking-tight">{row.id}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">NODE_924_X</span>
                                 </div>
                              </td>
                              <td className="py-6 px-4">
                                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg">{row.model}</span>
                              </td>
                              <td className="py-6 px-4 text-right font-black italic text-rose-400 text-sm tracking-tight">{row.oci}</td>
                              <td className="py-6 px-4 text-right">
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${row.prof === 'Onerous' ? 'text-rose-500 italic underline decoration-rose-500/30' : 'text-emerald-500'}`}>{row.prof}</span>
                              </td>
                              <td className="py-6 px-4 text-center">
                                 <div className="flex justify-center">
                                    <div className={`flex items-center gap-2 group-hover/row:scale-110 transition-transform ${row.status === 'Locked' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                       {row.status === 'Locked' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                       <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 4. DISCLOSURE WORKFLOW ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-6 mb-8">
                     <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><Database className="w-8 h-8" /></div>
                     <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1 italic leading-tight">Ledger Postings Execution</h4>
                        <p className="text-xs text-slate-400 italic">Generate double-entry ledger files for Oracle/SAP integration.</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
                     Execute Ledger Run
                     <Calculator className="w-4 h-4" />
                  </button>
               </div>

               <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><ExternalLink className="w-24 h-24 text-white" /></div>
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                     <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-white"><FileText className="w-8 h-8" /></div>
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic leading-tight">Regulatory Package Bundler</h4>
                        <p className="text-indigo-100/70 text-xs italic">Export notes, reconciliations, and disclosures for External Audit.</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-3 relative z-10">
                     Bundle Reporting Pack
                     <Download className="w-4 h-4" />
                  </button>
               </div>
            </div>

        </div>
    );
};
