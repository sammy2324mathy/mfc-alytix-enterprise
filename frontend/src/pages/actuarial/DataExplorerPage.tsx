import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  Filter, 
  Table2, 
  FileDown, 
  BarChart3, 
  ChevronRight, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Activity,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Info
} from 'lucide-react';

const datasets = [
  { id: 'DS-POL', name: 'Policyholder Master (Unified)', records: '1,842,561', lastRefresh: '2 hours ago', size: '2.4 GB', status: 'Live', cluster: 'EMEA-1', type: 'Relational' },
  { id: 'DS-CLM', name: 'Claims Register (Live)', records: '421,093', lastRefresh: '1 hour ago', size: '890 MB', status: 'Live', cluster: 'EMEA-1', type: 'Relational' },
  { id: 'DS-EXP', name: 'Exposure Hub (Earned)', records: '3,201,440', lastRefresh: '6 hours ago', size: '4.1 GB', status: 'Live', cluster: 'EMEA-2', type: 'Time-Series' },
  { id: 'DS-MORT', name: 'Mortality Experience 2024', records: '89,204', lastRefresh: '1 day ago', size: '120 MB', status: 'Archived', cluster: 'ARCH-1', type: 'Structured' },
  { id: 'DS-PREM', name: 'Premium Bordereaux', records: '564,802', lastRefresh: '3 hours ago', size: '1.1 GB', status: 'Live', cluster: 'EMEA-1', type: 'Relational' },
  { id: 'DS-ASSET', name: 'Asset Portfolio (Market)', records: '12,450', lastRefresh: '30 min ago', size: '45 MB', status: 'Live', cluster: 'INV-NODE', type: 'Real-time' },
  { id: 'DS-REIN', name: 'Reinsurance Treaty Matrix', records: '342', lastRefresh: '2 days ago', size: '8 MB', status: 'Live', cluster: 'GLOBAL-1', type: 'Structured' },
];

export const DataExplorerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = datasets.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HEADER CMD DECK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-600" />
            Universal Data Catalog <span className="text-slate-300 font-light">/</span> Explorer
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">High-fidelity interface for querying, inspecting, and extracting portfolio datasets.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group/search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
              <input 
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Lookup Dataset ID or Key..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all w-64 shadow-sm" 
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              <FileDown className="w-4 h-4" /> Export Catalog
           </button>
        </div>
      </div>

      {/* 2. CLUSTER METRICS HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Cloud Nodes Active', value: '14', icon: Globe, col: 'indigo' },
           { label: 'Total Records Index', value: '6.1M', icon: Table2, col: 'emerald' },
           { label: 'Compressed Volume', value: '8.7 GB', icon: BarChart3, col: 'amber' },
           { label: 'Global Security Pol', value: 'AES-256', icon: ShieldCheck, col: 'slate' },
         ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.col}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform`} />
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 bg-${kpi.col}-50 rounded-2xl`}>
                     <kpi.icon className={`w-5 h-5 text-${kpi.col}-600`} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">{kpi.value}</h4>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* 3. MAIN DATA GRID */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative group/grid">
         {/* Grid Banner */}
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
               <Database className="w-6 h-6 text-indigo-600" />
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Computational Datasets</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: High-Availability Connected</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Live Stream: 4.2 MB/s</span>
               </div>
               <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Filter className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-4 h-4" /></button>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                     <th className="px-10 py-5">Dataset Entity</th>
                     <th className="px-10 py-5">Storage Hierarchy</th>
                     <th className="px-10 py-5 text-right font-mono">Records Index</th>
                     <th className="px-10 py-5 text-right font-mono">Volume</th>
                     <th className="px-10 py-5 text-center">Protocol</th>
                     <th className="px-10 py-5 text-right">Interaction</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filtered.map((ds, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                       <td className="px-10 py-6">
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">{ds.name}</span>
                             <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">{ds.id}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${ds.status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{ds.cluster}</span>
                             <span className="text-[9px] text-slate-300 font-light">|</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ds.type}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right font-mono text-xs font-black text-slate-600">{ds.records}</td>
                       <td className="px-10 py-6 text-right font-mono text-xs font-black text-slate-500 italic">{ds.size}</td>
                       <td className="px-10 py-6">
                          <div className="flex justify-center">
                             <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.2em] ${
                               ds.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                             }`}>
                                {ds.status}
                             </span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100/50 shadow-sm transition-all group-hover:shadow-md">
                             <Search className="w-3 h-3" /> Execute SQL
                             <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Grid Footer Controls */}
         <div className="p-8 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Sync Interval: Hourly</span>
               </div>
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" />
                  <span>Data Integrity: 100% (Verifiable)</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="mr-4">Page 01 // 12</span>
               {[1, 2, 3].map(p => (
                  <button key={p} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${p === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-500'}`}>{p}</button>
               ))}
               <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
         </div>
      </div>

      {/* 4. DATA OPS FOOTER TOOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Info className="w-24 h-24 text-indigo-400" /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/60 mb-6">Security Clearance Alert</p>
            <h4 className="text-xl font-bold italic tracking-tight mb-4">You are accessing Restricted Actuarial PII.</h4>
            <p className="text-xs text-indigo-200/70 leading-relaxed mb-8">All queries are logged with your unique fingerprint (SHA-256). Data extraction over 100MB requires multi-factor departmental approval.</p>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl transition-all">Audit Security Logs</button>
         </div>

         <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl flex flex-col justify-center gap-6 group hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><ExternalLink className="w-8 h-8" /></div>
               <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">External Data Connectors</h4>
                  <p className="text-xs text-slate-400 italic">Ingest real-time market data from Bloomberg, SOFR, and World Bank.</p>
               </div>
            </div>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex justify-between items-center">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">EP</div>)}
                  <div className="w-10 h-10 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center text-[10px] font-black text-white">+8</div>
               </div>
               <button className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2 group/btn">Manage Endpoints <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" /></button>
            </div>
         </div>
      </div>

    </div>
  );
};

