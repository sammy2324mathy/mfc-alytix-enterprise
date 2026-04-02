import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Download, 
  Layers,
  ArrowUpRight,
  Calculator,
  Shield,
  Zap,
  Cpu,
  Database,
  Search,
  Filter,
  Activity
} from 'lucide-react';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const SCR_COMPONENTS = [
  { name: 'Market Risk', value: 450, color: '#6366f1' },
  { name: 'Life Underwriting', value: 320, color: '#8b5cf6' },
  { name: 'Health Underwriting', value: 120, color: '#a78bfa' },
  { name: 'Counterparty Default', value: 85, color: '#c4b5fd' },
  { name: 'Operational Risk', value: 95, color: '#ddd6fe' },
];

const SOLVENCY_HISTORY = [
  { quarter: '2024 Q1', ratio: 195 },
  { quarter: '2024 Q2', ratio: 202 },
  { quarter: '2024 Q3', ratio: 215 },
  { quarter: '2024 Q4', ratio: 208 },
  { quarter: '2025 Q1', ratio: 221 },
];

export const SolvencyIIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scr' | 'qrt' | 'orsa'>('scr');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. TOP COMMAND DECK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            Solvency II <span className="text-slate-300 font-light">/</span> Pillar 3 Reporting Node
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Sovereign capital adequacy monitoring and regulatory disclosure engine.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              <Calculator className="w-4 h-4" /> Recalculate SCR
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <Download className="w-4 h-4" /> Generate QRT Package
           </button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Solvency Ratio (Eligible)', value: '221.4%', trend: '+6.4%', icon: Layers, col: 'indigo' },
           { label: 'SCR Requirement', value: '$840M', trend: 'Stress-tested', icon: Scale, col: 'emerald' },
           { label: 'MCR Ratio', value: '412%', trend: 'Strong', icon: Shield, col: 'sky' },
           { label: 'Tier 1 Capital', value: '$1.86B', trend: 'High Quality', icon: Database, col: 'slate' },
         ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.col}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform`} />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{kpi.label}</p>
               <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic relative z-10">{kpi.value}</h4>
               <div className="mt-4 flex items-center gap-2 relative z-10">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded bg-${kpi.col}-50 text-${kpi.col}-600 border border-${kpi.col}-100`}>{kpi.trend}</span>
                  <kpi.icon className={`w-3.5 h-3.5 text-${kpi.col}-400 ml-auto`} />
               </div>
            </div>
         ))}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-12 gap-8">
         
         {/* SCR Breakdown Radar/Pie */}
         <div className="col-span-12 lg:col-span-7 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Standard Formula SCR Breakdown</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modular Capital Requirement (Post-Diversification)</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">Modular</button>
                  <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Integrated</button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 items-center">
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={SCR_COMPONENTS} innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" stroke="none">
                           {SCR_COMPONENTS.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff' }} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4">
                  {SCR_COMPONENTS.map((item, i) => (
                     <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                           <span className="text-xs font-black text-slate-700 font-mono">${item.value}M</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(item.value / 1070) * 100}%`, background: item.color }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Solvency Ratio Trending */}
         <div className="col-span-12 lg:col-span-5 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Solvency Ratio Trend</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Capital Surplus Coverage (Base vs Target)</p>
               </div>
               <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            </div>
            
            <div className="flex-1 min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SOLVENCY_HISTORY} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorRatioSolv" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} domain={[150, 250]} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Area type="monotone" dataKey="ratio" name="Solvency Ratio (%)" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRatioSolv)" />
                     {/* Target Line Overlay */}
                     <line x1="0" y1="150" x2="1000" y2="150" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
               <AlertTriangle className="w-5 h-5 text-rose-500" />
               <p className="text-[10px] font-bold text-rose-800 uppercase tracking-tight">Minimum Target Level: 150% (Sovereign Buffer at 180%)</p>
            </div>
         </div>
      </div>

      {/* 4. QUANTITATIVE REPORTING TEMPLATES (QRTs) GRID */}
      <div className="bg-slate-900 rounded-[50px] p-10 text-white shadow-3xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 rotate-12"><FileText className="w-64 h-64 text-white" /></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
            <div>
               <h3 className="text-2xl font-black italic tracking-tighter uppercase">QRT Disclosure Catalog</h3>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Quantitative Reporting Templates for Pillar 3 Disclosures</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
               {['Assets', 'Liabilities', 'S.06', 'S.12'].map(f => (
                  <button key={f} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Assets' ? 'bg-white text-slate-900 group-hover:bg-indigo-500 group-hover:text-white' : 'text-slate-500 hover:text-white'}`}>{f}</button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[
              { id: 'S.02.01', name: 'Balance Sheet', status: 'Validated', records: '142', cluster: 'EMEA-1' },
              { id: 'S.06.02', name: 'List of Assets', status: 'In Review', records: '2,840', cluster: 'INV-1' },
              { id: 'S.12.01', name: 'Life Technical Provisions', status: 'Validated', records: '850', cluster: 'ACT-4' },
              { id: 'S.17.01', name: 'Non-Life Tech Provisions', status: 'Idle', records: '0', cluster: 'N/A' },
              { id: 'S.23.01', name: 'Own Funds', status: 'Validated', records: '124', cluster: 'CAP-2' },
              { id: 'S.25.01', name: 'Solvency Capital Req', status: 'Validated', records: '42', cluster: 'CAP-2' },
            ].map((qrt, i) => (
               <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group/card cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-[10px] font-mono text-slate-500">{qrt.id}</span>
                     <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${qrt.status === 'Validated' ? 'bg-emerald-500/20 text-emerald-400' : qrt.status === 'In Review' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>{qrt.status}</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 group-hover/card:text-indigo-400 transition-colors">{qrt.name}</h4>
                  <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
                     <span>Records: {qrt.records}</span>
                     <span>Node: {qrt.cluster}</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-0 group-hover/card:opacity-100 transition-all">
                     <button className="text-white hover:text-indigo-400 flex items-center gap-2"><Search className="w-3.5 h-3.5" /> View Data</button>
                     <button className="text-white hover:text-indigo-400"><Download className="w-3.5 h-3.5" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 5. ORSA GOVERNANCE NODES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl flex items-center gap-8 group hover:-translate-y-1 transition-all">
            <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><Cpu className="w-10 h-10" /></div>
            <div className="flex-1">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">ORSA Intelligence Engine</h4>
               <p className="text-xs text-slate-400 italic">Self-assessment nodes for emerging risks and forward-looking capital projections.</p>
               <button className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">Configure Projection Nodes <ArrowUpRight className="w-3.5 h-3.5" /></button>
            </div>
         </div>
         <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000 rotate-12"><CheckCircle className="w-24 h-24 text-white" /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Regulatory Sign-off Status</p>
            <h4 className="text-2xl font-black italic tracking-tighter">Pillar 3 Validated</h4>
            <div className="flex items-center gap-3 mt-4">
               <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[9px] font-black">CA</div>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-50 italic">Signed by Chief Actuary at 22:14 UTC</span>
            </div>
         </div>
      </div>

    </div>
  );
};
