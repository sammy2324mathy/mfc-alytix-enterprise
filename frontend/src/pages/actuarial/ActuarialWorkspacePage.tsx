import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Play, Save, Download, FileCode, Layout, LayoutGrid, MessageSquare, 
  Terminal, ChevronRight, Database, Zap, ShieldCheck, BrainCircuit, 
  Search, FolderTree, FileJson, Files, ChevronDown, Monitor, 
  Settings2, Activity, Target, Crown, RefreshCw, BarChart3, ArrowUpRight, TrendingUp

} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { actuarialApi, dataScienceApi, actuarialAiApi } from '../../services/actuarialApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

const INITIAL_CODE = `# Actuarial Python Modeling Sandbox
import numpy as np

# 1. Define Policy Parameters
age = 45
sum_assured = 500000
premium = 1250

# 2. Run Survival Model (GLM Approximation)
def estimate_q_x(age, t):
    return 0.0001 * np.exp(0.09 * (age + t))

# 3. Calculate 30-year Cash Flow Projection
projections = []
for t in range(30):
    qx = estimate_q_x(age, t)
    claims = sum_assured * qx
    projections.append({"year": 2025 + t, "claims": round(claims, 2)})

print(f"Total Projected Claims: {sum([p['claims'] for p in projections])}")
`;

const MODEL_FILES = [
  { id: '1', name: 'mortality_investigation.py', type: 'python', status: 'modified' },
  { id: '2', name: 'lapse_basis_2026.r', type: 'r', status: 'stable' },
  { id: '3', name: 'solvency_capital_calc.py', type: 'python', status: 'stable' },
  { id: '4', name: 'liability_projections.json', type: 'json', status: 'fixed' },
];

export const ActuarialWorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'results' | 'grid'>('editor');
  const [code, setCode] = useState(INITIAL_CODE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["[SYSTEM] IADE v2.4 (Enterprise) Loaded.", "[SYSTEM] Cluster Node 04: READY."]);
  const [projections, setProjections] = useState<any[]>([]);
  const [valuation, setValuation] = useState<{ bel: number; ra: number } | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [language, setLanguage] = useState<'python' | 'r'>('python');

  const { user } = useAuthStore();
  const isChief = user?.roles.includes('chief_actuary') || user?.roles.includes('admin');

  const handleExport = (format: 'SAS' | 'Excel') => {
    toast.success(`${format} Data Cube Generated and Serialized.`, {
      icon: <Database className="w-4 h-4 text-indigo-400" />,
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
    });
  };

  const runSimulation = async () => {
    setIsExecuting(true);
    setTerminalOutput(prev => [...prev, `[RUN] ${new Date().toLocaleTimeString()}: Initializing Model Compile...`]);
    
    const loadingToast = toast.loading('Calculating Liabilities...', {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
    });

    try {
        const dsResult = await dataScienceApi.executeScript(code, language);
        setTerminalOutput(prev => [...prev, dsResult.stdout || `[EXEC] PID 1422: Success.`]);

        const actResult = await actuarialApi.runProjection({
            policy: { age: 45, sum_assured: 500000, annual_premium: 1250 },
            assumptions: { interest_rate: 0.045, mortality_improvement: 0.01 }
        });

        setProjections(actResult.cash_flows);
        setValuation({ bel: actResult.bel, ra: actResult.risk_adjustment });
        
        setTerminalOutput(prev => [...prev, 
            `[OK] BEL Convergence: $${actResult.bel.toLocaleString()}`, 
            `[OK] RA Deterministic: $${actResult.risk_adjustment.toLocaleString()}`
        ]);

        toast.success(`Valuation Finalized: BEL is $${actResult.bel.toLocaleString()}`, {
          id: loadingToast,
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
        });
        setActiveTab('results');
    } catch (err: any) {
        setTerminalOutput(prev => [...prev, `[ERR] ${err.message || 'Stack corruption detected'}`]);
        toast.error('Calculation Engine Failure', { id: loadingToast });
    } finally {
        setIsExecuting(false);
    }
  };

  const handleCopilotSubmit = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage('');
    setTerminalOutput(prev => [...prev, `[AI-INTENT] ${msg}`]);
    
    const aiToast = toast.loading('AI Actuary Reasoning...', {
       style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
    });

    try {
        const response = await actuarialAiApi.askCopilot(msg);
        setTerminalOutput(prev => [...prev, `[AI-RESPONSE] ${response.reply}`]);
        toast.success('Analysis Delivered', { id: aiToast, icon: <BrainCircuit className="w-4 h-4 text-indigo-400" /> });
    } catch (err: any) {
        toast.error('AI Mesh Unreachable', { id: aiToast });
    }
  };

  return (
    <div className="h-screen flex flex-col gap-0 overflow-hidden bg-slate-950 animate-in fade-in duration-1000 font-sans relative">

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />
      
      {/* 1. IDE TOP BAR */}
      <div className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Zap className="w-4 h-4 text-indigo-400" />
               </div>
               <h1 className="text-xs font-black text-white uppercase tracking-[0.3em]">IADE Enterprise <span className="text-indigo-400 font-black">v2.4</span></h1>
            </div>
            
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={runSimulation} disabled={isExecuting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Compute Global Model
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button onClick={() => handleExport('SAS')} className="p-2 text-slate-400 hover:text-white transition-all" title="Export SAS"><Files className="w-3.5 h-3.5" /></button>
                <button className="p-2 text-slate-400 hover:text-white transition-all" title="Secure Save"><Save className="w-3.5 h-3.5" /></button>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {isChief ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full group/chief">
                <Crown className="w-3.5 h-3.5 text-amber-500 group-hover/chief:rotate-12 transition-transform" />
                <span className="text-[9px] font-black text-amber-400 font-mono uppercase tracking-widest">Sovereign Authority: Chief Actuary</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic">ID: {user?.roles?.[0]} [Modeling Level: Standard]</span>
              </div>
            )}
            <div className="h-4 w-[1px] bg-white/5" />
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Sovereign Cluster Active</span>
            </div>
            <div className="h-4 w-[1px] bg-white/5" />
            <button className="p-2 bg-white/5 text-slate-400 hover:text-indigo-400 rounded-lg transition-all border border-white/5">
               <Settings2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* 2. MAIN IDE GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Model Explorer - HIGH DENSITY */}
        <div className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
           <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2.5 text-slate-300">
                 <div className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <FolderTree className="w-3 h-3 text-indigo-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Model Repository</span>
              </div>
              <Search className="w-3.5 h-3.5 text-slate-600 hover:text-white transition-colors cursor-pointer" />
           </div>
           
           <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
              <div className="mb-4">
                 <div className="flex items-center gap-2 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer group">
                    <ChevronDown className="w-3 h-3 text-indigo-500 group-hover:rotate-0 -rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Active Workspace</span>
                    <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">4</span>
                 </div>
                 <div className="mt-1 space-y-0.5 ml-2 border-l border-white/5">
                    {MODEL_FILES.map(file => (
                       <div key={file.id} className={`flex items-center justify-between p-2 pl-4 rounded-xl cursor-pointer group/file transition-all ${file.name.includes('mortality') ? 'bg-indigo-600/10 text-white ring-1 ring-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
                          <div className="flex items-center gap-2.5">
                             {file.type === 'python' ? <FileCode className="w-3.5 h-3.5 text-indigo-400" /> : <FileJson className="w-3.5 h-3.5 text-sky-400" />}
                             <span className="text-[10px] font-bold truncate max-w-[120px]">{file.name}</span>
                          </div>
                          {file.status === 'modified' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="mt-6 px-2">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4">Modeling Statistics</p>
                 <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                          <span>Compute Load</span>
                          <span className="text-indigo-400">14.2%</span>
                       </div>
                       <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[14%]" />
                       </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                          <span>Memory Node</span>
                          <span className="text-emerald-400">2.1 GB</span>
                       </div>
                       <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[24%]" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-5 bg-black/40 border-t border-white/5">
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
                 <RefreshCw className="w-3 h-3" />
                 Sync Repository
              </button>
           </div>
        </div>

        {/* CENTER PANEL: Editor & Viewports */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
           {/* Tab Bar - SLICK */}
           <div className="h-12 bg-slate-900 flex items-center px-4 shrink-0 border-b border-white/5 gap-2">
              {[
                { id: 'editor', name: 'Modeling Editor', icon: FileCode },
                { id: 'results', name: 'Valuation Analytics', icon: BarChart3 },
                { id: 'grid', name: 'Financial Matrix', icon: LayoutGrid },
              ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`h-9 px-6 rounded-xl flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`} />
                    {tab.name}
                    {activeTab === tab.id && (
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full blur-[2px]" />
                    )}
                 </button>
              ))}
           </div> 
 
           {/* Editor Viewport */}
           <div className="flex-1 overflow-hidden relative bg-[rgb(10,12,18)]">
              {activeTab === 'editor' && (
                 <div className="flex h-full">
                    <div className="w-12 bg-slate-900/50 border-r border-white/5 flex flex-col items-center py-10 gap-2 font-mono text-[10px] text-slate-600 select-none">
                       {Array.from({ length: 40 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <textarea 
                       value={code} onChange={e => setCode(e.target.value)}
                       className="flex-1 bg-transparent p-10 font-mono text-sm text-indigo-300 outline-none resize-none leading-relaxed selection:bg-indigo-500/40 custom-scrollbar"
                       spellCheck={false}
                    />
                 </div>
              )}

              {activeTab === 'results' && (
                 <div className="w-full h-full p-12 overflow-y-auto custom-scrollbar">
                    {!valuation ? (
                       <div className="h-full flex flex-col items-center justify-center text-slate-700 animate-pulse">
                          <BrainCircuit className="w-16 h-16 mb-6 opacity-10 animate-bounce" />
                          <p className="text-[11px] font-black uppercase tracking-[0.3em] italic text-slate-500">Awaiting Real-Time Deterministic Run...</p>
                       </div>
                    ) : (
                       <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                          {/* Strategic Summary Cards */}
                          <div className="grid grid-cols-3 gap-6">
                             <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[32px] relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Best Estimate Liability</p>
                                <p className="text-4xl font-black text-white italic tracking-tighter leading-none">$ {(valuation.bel / 1000000).toFixed(2)} M</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                   <TrendingUp className="w-4 h-4" /> 2.1% Finalized Improvement
                                </div>
                             </div>
                             <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[32px] relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-2xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Risk Adjustment</p>
                                <p className="text-4xl font-black text-white italic tracking-tighter leading-none">$ {(valuation.ra / 1000).toFixed(1)} k</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                   99.5% VaR Confidence Node
                                </div>
                             </div>
                             <div className="p-8 bg-indigo-600 border border-indigo-400 text-white rounded-[32px] relative overflow-hidden group shadow-2xl shadow-indigo-500/40">
                                <div className="absolute right-[-20%] bottom-[-20%] opacity-20"><ShieldCheck className="w-32 h-32" /></div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">CSM Capacity</p>
                                <p className="text-4xl font-black italic tracking-tighter leading-none">$ 124.8 M</p>
                                <div className="mt-4 text-[10px] font-bold text-white/80">Available for P&L Release</div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <div className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5 shadow-2xl">
                                <div className="flex items-center justify-between mb-10 text-center">
                                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Liability Cash Flow Projections</h3>
                                   <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Details</button>
                                </div>
                                <div className="h-[280px]">
                                   <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={projections.map(p => ({ year: 2025 + p.period, bel: p.net_cash_flow / 1000, risk: (p.claims + p.expenses) / 1000 }))}>
                                         <defs>
                                            <linearGradient id="colorBelIDE" x1="0" y1="0" x2="0" y2="1">
                                               <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                               <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                         </defs>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                         <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} />
                                         <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} />
                                         <Tooltip contentStyle={{ borderRadius: '24px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', color: '#fff' }} />
                                         <Area type="monotone" dataKey="bel" name="Net Cash Flow" stroke="#6366f1" strokeWidth={4} fill="url(#colorBelIDE)" />
                                      </AreaChart>
                                   </ResponsiveContainer>
                                </div>
                             </div>

                             <div className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute top-10 flex flex-col items-center gap-2">
                                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Capital Stress Heatmap</h3>
                                   <p className="text-[10px] font-bold text-slate-600">Simultaneous Parametric Shifts [v4.1]</p>
                                </div>
                                <div className="w-56 h-56 rounded-full border-[10px] border-slate-800 relative flex items-center justify-center">
                                   <div className="absolute inset-0 rounded-full border-t-[10px] border-indigo-500 animate-[spin_3s_linear_infinite]" />
                                   <div className="text-center">
                                      <p className="text-3xl font-black text-white italic">82%</p>
                                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">SCR Node Alpha</p>
                                   </div>
                                </div>
                                <div className="mt-8 flex gap-4">
                                   <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-bold text-emerald-400 tracking-widest uppercase italic">Stable</div>
                                   <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-bold text-indigo-400 tracking-widest uppercase italic italic">Deterministic</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              )}
           </div>

           {/* Console Pane - REFINED */}
           <div className="h-56 bg-slate-900 border-t border-white/5 flex flex-col shrink-0">
              <div className="h-12 px-6 border-b border-white/5 flex items-center justify-between bg-black/30">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">System Audit & Kernel Logs</span>
                 </div>
                 <div className="flex items-center gap-5">
                    {isExecuting && (
                       <div className="flex items-center gap-3">
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Aggregating Policy Nodes...</div>
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                       </div>
                    )}
                    <button onClick={() => setTerminalOutput(["[RESET] Environment Cleaned.", "[SYSTEM] Cluster Node 04: READY."])} className="text-[10px] font-black text-slate-600 hover:text-slate-300 uppercase tracking-widest transition-colors">Clear Console</button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" title="Kernel Healthy" />
                 </div>
              </div>
              <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-1.5 custom-scrollbar bg-[rgb(10,12,18)]">
                 {terminalOutput.map((l, i) => (
                    <div key={i} className={`flex gap-4 ${l.includes('[OK]') ? 'text-emerald-400' : l.includes('[RUN]') ? 'text-indigo-400' : l.includes('[AI') ? 'text-sky-400' : l.includes('[ERR]') ? 'text-rose-400' : 'text-slate-500'}`}>
                       <span className="opacity-10 w-8 select-none">{i.toString().padStart(3, '0')}</span>
                       <span className="flex-1">{l}</span>
                    </div>
                 ))}
                 {isExecuting && (
                    <div className="flex gap-4 text-indigo-400/30 italic animate-pulse">
                        <span className="opacity-10 w-8">...</span>
                        <span>Running Bayesian posterior update chain... [1,402 TPS]</span>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: Properties & Strategic Intelligence Copilot */}
        <div className="w-96 bg-slate-900 border-l border-white/5 flex flex-col shrink-0 shadow-2xl relative z-20">
           <div className="p-6 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-3 text-slate-300 mb-8">
                 <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Database className="w-3 h-3 text-emerald-400" />
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1">Environmental Properties</span>
              </div>
              
              <div className="space-y-5">
                 {[
                   { label: 'Mortality Basis', val: 'Gompertz-Makeham Finalized', type: 'select' },
                   { label: 'Yield Curve Shift (bps)', val: '+45 bps', type: 'slider' },
                   { label: 'Lapse Approximation', val: 'Log-Normal Dynamic', type: 'select' },
                 ].map((p, i) => (
                    <div key={i} className="group/prop">
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{p.label}</p>
                          <Settings2 className="w-3 h-3 text-slate-700 group-hover/prop:text-indigo-500 transition-colors cursor-pointer" />
                       </div>
                       <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl group-hover/prop:border-white/10 transition-all flex items-center justify-between">
                          <p className="text-[11px] font-bold text-slate-300">{p.val}</p>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                       </div>
                    </div>
                 ))}

                 <div className="pt-2">
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[24px] relative group overflow-hidden">
                       <div className="absolute right-[-10%] top-[-10%] p-6 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700"><RefreshCw className="w-20 h-20 text-white" /></div>
                       <div className="relative z-10">
                          <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                             <RefreshCw className="w-3 h-3 animate-spin" />
                             System Library Hash
                          </p>
                          <p className="text-[11px] font-bold text-white tracking-widest font-mono">0x4FEE...A922</p>
                          <p className="text-[8px] text-indigo-400/60 mt-2 hover:text-white transition-opacity cursor-pointer">Verification Node Verified</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
              <div className="p-6 flex items-center justify-between pb-0">
                 <div className="flex items-center gap-3 text-indigo-300">
                    <div className="w-5 h-5 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                       <BrainCircuit className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1">Strategic Copilot</span>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:200ms]" />
                    <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:400ms]" />
                 </div>
              </div>

              <div className="flex-1 m-6 mt-4 rounded-[32px] bg-black/40 border border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] to-transparent pointer-events-none" />
                 
                 <div className="space-y-5 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 leading-relaxed italic border-l-4 border-l-indigo-600 shadow-xl">
                       "Based on the mortality vector, I've detected a <span className="text-indigo-400 font-bold">0.2% variance</span> in the survival integral at age 65."
                    </div>
                    
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-[11px] text-emerald-400/80 leading-relaxed italic border-l-4 border-l-emerald-600">
                       "Strategic Insight: Recommend applying a smoothing spline to the Gompertz parameters to optimize capital reserves."
                    </div>
                    
                    <div className="p-4 bg-slate-800/20 rounded-2xl border border-white/5 text-[10px] text-slate-500 leading-relaxed font-mono uppercase tracking-[0.05em] text-center italic">
                       AI Reasoning Cycle #1402: Complete
                    </div>
                 </div>
              </div>

              <div className="p-6 pt-0">
                 <div className="relative group/chat">
                    <input 
                      type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCopilotSubmit()}
                      placeholder="Instruct Intelligence..."
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold text-white placeholder-slate-600 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/40 transition-all pr-12 shadow-inner"
                    />
                    <button onClick={handleCopilotSubmit} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-white hover:scale-110 transition-all">
                       <MessageSquare className="w-5 h-5" />
                    </button>
                 </div>
                 <p className="text-[8px] text-slate-600 text-center mt-3 uppercase tracking-widest font-black italic">Powered by Sovereign Neural Mesh v2.4</p>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};
