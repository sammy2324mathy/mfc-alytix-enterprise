import React, { useState } from 'react';
import { 
  Zap, 
  History, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Settings2, 
  Play, 
  Download, 
  Layers,
  Activity,
  Calculator,
  ArrowRightLeft,
  Flame,
  Snowflake,
  Wind
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';

const SCENARIO_DATA = [
  { subject: 'Interest Rate (+100bps)', base: 1200, stressed: 1080, full: 150 },
  { subject: 'Mortality (+15%)', base: 1200, stressed: 1380, full: 150 },
  { subject: 'Lapses (-20%)', base: 1200, stressed: 1260, full: 150 },
  { subject: 'Inflation (+3%)', base: 1200, stressed: 1320, full: 150 },
  { subject: 'Equity Shock (-25%)', base: 1200, stressed: 1020, full: 150 },
];

const SOLVENCY_RUNS = [
  { time: '2025-Q1', ratio: 215, SCR: 850, assets: 1827 },
  { time: '2025-Q2', ratio: 208, SCR: 880, assets: 1830 },
  { time: '2025-Q3', ratio: 221, SCR: 900, assets: 1989 },
  { time: '2025-Q4', ratio: 195, SCR: 920, assets: 1794 },
];

export const StressTestingPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [intensity, setIntensity] = useState(50);

  const runGlobalShock = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Command Deck */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-rose-600" />
            Sovereign Stress Hub <span className="text-slate-300 font-light">/</span> Reserving Sensitivities
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Multi-scenario shock testing and capital adequacy simulations.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button onClick={runGlobalShock} disabled={isRunning} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${isRunning ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black active:scale-95'}`}>
              {isRunning ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Re-compute Global Shock
           </button>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all cursor-pointer"><Settings2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* 2. Intensity Slider & Scenario Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 flex items-center gap-10">
            <div className="flex-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Macro Stress Intensity</p>
               <input 
                  type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
               />
               <div className="flex justify-between mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Standard Shift (1-in-10)</span>
                  <span>Extreme Variance (1-in-200 / Solvency II)</span>
               </div>
            </div>
            <div className="w-px h-16 bg-slate-100 hidden md:block" />
            <div className="flex gap-4">
               {[
                 { icon: Flame, label: 'Hyper Inflation', color: 'rose' },
                 { icon: Snowflake, label: 'Interest Frost', color: 'sky' },
                 { icon: Wind, label: 'Epidemic Shock', color: 'emerald' },
               ].map((s, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 group">
                     <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 flex items-center justify-center border border-${s.color}-100 group-hover:scale-110 transition-transform shadow-sm`}>
                        <s.icon className={`w-5 h-5 text-${s.color}-600`} />
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-tight text-slate-400 group-hover:text-slate-900 transition-all">{s.label}</span>
                  </button>
               ))}
            </div>
         </div>
         <div className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-[40px] p-8 text-white shadow-xl shadow-rose-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000 rotate-12"><ShieldAlert className="w-24 h-24 text-white" /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Projected Solvency Ratio</p>
            <h4 className="text-4xl font-black italic tracking-tighter">182.4%</h4>
            <div className="flex items-center gap-2 mt-2 opacity-80">
               <TrendingDown className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">-32.6% Post-Shock</span>
            </div>
         </div>
      </div>

      {/* 3. Main Data Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Radar Map of Sensitivities */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Vulnerability Heat-Map</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Impact on Best Estimate Liability (BEL)</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-2xl"><Layers className="w-5 h-5 text-slate-400" /></div>
            </div>
            
            <div className="flex-1 min-h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SCENARIO_DATA}>
                     <PolarGrid stroke="#f1f5f9" />
                     <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b', textTransform: 'uppercase' }} />
                     <PolarRadiusAxis angle={30} domain={[0, 1500]} tick={false} axisLine={false} />
                     <Radar name="Base Reserve" dataKey="base" stroke="#e2e8f0" fill="#cbd5e1" fillOpacity={0.2} strokeWidth={2} />
                     <Radar name="Stressed Reserve" dataKey="stressed" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} strokeWidth={4} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff' }} />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Historical Capital Adequacy */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Solvency Capital History</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Actual SCR Coverage (Last 4 Quarters)</p>
               </div>
               <div className="p-3 bg-emerald-50 rounded-2xl"><Activity className="w-5 h-5 text-emerald-500" /></div>
            </div>

            <div className="flex-1 min-h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SOLVENCY_RUNS} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Area type="monotone" dataKey="ratio" name="Solvency Ratio" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRatio)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 4. Action Recommendation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0"><ShieldAlert className="w-6 h-6 text-amber-500" /></div>
            <div>
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Sensitivity Breach</h4>
               <p className="text-xs text-slate-500 leading-relaxed italic">"Equity shock scenario results in solvency ratio of 142%, dipping below your 150% internal target. Recommend hedging equity exposure."</p>
            </div>
         </div>
         <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0"><Calculator className="w-6 h-6 text-indigo-500" /></div>
            <div>
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">SCR Impact</h4>
               <p className="text-xs text-slate-500 leading-relaxed italic">"Interest rate sensitvity (+1bps) contributes 42% of the diversification benefit. Basis remains extremely robust to parallel shifts."</p>
            </div>
         </div>
         <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg flex items-start gap-4 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0"><Download className="w-6 h-6 text-white" /></div>
            <div className="flex-1">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Generate Pillar 3</h4>
               <p className="text-xs text-slate-500 leading-relaxed italic">Compile all sensitivity results into a regulatory-ready Pillar 3 report (PDF/XBRL).</p>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-slate-300 mt-1" />
         </div>
      </div>

    </div>
  );
};
