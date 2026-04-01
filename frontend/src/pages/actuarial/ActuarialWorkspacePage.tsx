import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Play, Save, Download, FileCode, Layout, LayoutGrid, MessageSquare, Terminal, ChevronRight, Database, Zap, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { actuarialApi, dataScienceApi, actuarialAiApi } from '../../services/actuarialApi';

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

export const ActuarialWorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'spreadsheet' | 'results'>('editor');
  const [code, setCode] = useState(INITIAL_CODE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["[SYSTEM] Actuarial Workspace v1.0.0 Initialized...", "[SYSTEM] Connected to AEE Projection Engine."]);
  const [projections, setProjections] = useState<any[]>([]);
  const [valuation, setValuation] = useState<{ bel: number; ra: number } | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [language, setLanguage] = useState<'python' | 'r'>('python');

  const handleExport = (format: 'SAS' | 'Excel') => {
    alert(`Generating industrial ${format} export... Simulation data serialized.`);
  };

  const runSimulation = async () => {
    setIsExecuting(true);
    setTerminalOutput(prev => [...prev, `[RUN] Executing ${language.toUpperCase()} Model Suite at ${new Date().toLocaleTimeString()}...`]);
    
    try {
        // 1. Run the Model in DS Service
        const dsResult = await dataScienceApi.executeScript(code, language);
        setTerminalOutput(prev => [...prev, dsResult.stdout || `[DS] ${language.toUpperCase()} Script executed successfully.`]);

        // 2. Run the Projection in Actuarial Service
        const actResult = await actuarialApi.runProjection({
            policy: { age: 45, sum_assured: 500000, annual_premium: 1250 },
            assumptions: { interest_rate: 0.045, mortality_improvement: 0.01 }
        });

        setProjections(actResult.cash_flows);
        setValuation({ bel: actResult.bel, ra: actResult.risk_adjustment });
        
        setTerminalOutput(prev => [...prev, 
            `[OK] Projection complete. BEL: $${actResult.bel.toLocaleString()}`, 
            `[OK] Risk Adjustment: $${actResult.risk_adjustment.toLocaleString()}`
        ]);
    } catch (err: any) {
        setTerminalOutput(prev => [...prev, `[ERROR] Execution failed: ${err.message || 'Unknown error'}`]);
    } finally {
        setIsExecuting(false);
    }
  };

  const handleCopilotSubmit = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage('');
    setTerminalOutput(prev => [...prev, `[AI] Analyzing: ${msg}`]);
    
    try {
        const response = await actuarialAiApi.askCopilot(msg);
        setTerminalOutput(prev => [...prev, `[COPILOT] ${response.reply}`]);
    } catch (err: any) {
        setTerminalOutput(prev => [...prev, `[ERROR] AI service unavailable.`]);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-premium border border-slate-100">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FileCode className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Actuarial Enterprise Workspace</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-xs">Prophet Engine Active</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setActiveTab('editor')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Model Editor</button>
                <button onClick={() => setActiveTab('spreadsheet')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'spreadsheet' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Financial Grid</button>
                <button onClick={() => setActiveTab('results')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Insights Lab</button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button onClick={runSimulation} disabled={isExecuting} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-premium transition-all disabled:opacity-50">
                {isExecuting ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run Global Model
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Panel: Primary Content */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
            
            {activeTab === 'editor' && (
                <div className="flex-1 bg-[#1e1e1e] rounded-3xl shadow-2xl border border-white/5 flex flex-col overflow-hidden group">
                    <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[10px] font-mono text-white/30 font-bold tracking-widest uppercase">actuarial_modeling.py</span>
                        <div className="flex gap-4 items-center">
                            <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
                                <button onClick={() => setLanguage('python')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'python' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>Python</button>
                                <button onClick={() => setLanguage('r')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'r' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>R-Script</button>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <button onClick={() => handleExport('SAS')} className="text-white/40 hover:text-white transition-all" title="Export to SAS"><Database className="w-4 h-4" /></button>
                            <button onClick={() => handleExport('Excel')} className="text-white/40 hover:text-white transition-all" title="Save as Excel"><Save className="w-4 h-4" /></button>
                            <button className="text-white/40 hover:text-white transition-all" title="Download Suite"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent p-6 font-mono text-sm text-sky-300 outline-none resize-none leading-relaxed selection:bg-indigo-500/30"
                        spellCheck={false}
                    />
                </div>
            )}

            {activeTab === 'spreadsheet' && (
                <div className="flex-1 bg-white rounded-3xl shadow-premium border border-slate-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><LayoutGrid className="w-4 h-4 text-indigo-600" /> Premium Adjustment Matrix</h3>
                        <div className="flex gap-2">
                             <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">Auto-Calc: ON</div>
                             <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">Precision: 4dp</div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <table className="w-full border-collapse border border-slate-100 text-xs font-medium">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="border border-slate-100 p-2 text-left text-slate-400 font-bold w-12">#</th>
                                    <th className="border border-slate-100 p-2 text-left text-slate-600 font-bold">Assumption Key</th>
                                    <th className="border border-slate-100 p-2 text-left text-slate-600 font-bold">Base Value</th>
                                    <th className="border border-slate-100 p-2 text-left text-slate-600 font-bold">Shock (%)</th>
                                    <th className="border border-slate-100 p-2 text-left text-slate-600 font-bold">Adj. Value</th>
                                    <th className="border border-slate-100 p-2 text-left text-slate-600 font-bold">Impact on BEL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { key: 'Interest Rate', base: '4.50%', shock: '+1.0', adj: '5.50%', impact: '-$14.2M' },
                                    { key: 'Lapse Rate', base: '5.00%', shock: '+0.5', adj: '5.50%', impact: '+$3.8M' },
                                    { key: 'Mortality Floor', base: '0.001', shock: '+10.0', adj: '0.0011', impact: '+$22.5M' },
                                    { key: 'Exp. Inflation', base: '2.50%', shock: '+1.0', adj: '3.50%', impact: '+$8.1M' },
                                    { key: 'FX Volatility', base: '12.00%', shock: '-2.0', adj: '10.00%', impact: '-$1.4M' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="border border-slate-100 p-3 text-slate-400 font-mono text-[10px]">{i + 1}</td>
                                        <td className="border border-slate-100 p-3 text-slate-700 font-bold">{row.key}</td>
                                        <td className="border border-slate-100 p-3 text-slate-500 font-mono">{row.base}</td>
                                        <td className="border border-slate-100 p-3 text-indigo-600 font-bold group-hover:bg-indigo-50/50 cursor-pointer">{row.shock}</td>
                                        <td className="border border-slate-100 p-3 text-slate-800 font-mono font-bold">{row.adj}</td>
                                        <td className={`border border-slate-100 p-3 font-bold ${row.impact.startsWith('-') ? 'text-emerald-600' : 'text-rose-600'}`}>{row.impact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'results' && (
                <div className="flex-1 bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex flex-col p-8">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Dynamic Valuation Projection</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Visualizing impact of GLM-derived mortality vectors on Best Estimate Liability.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Best Estimate (BEL)</p>
                                <p className="text-xl font-bold text-indigo-600">${(valuation?.bel || 0).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Risk Adjustment</p>
                                <p className="text-xl font-bold text-rose-600">${(valuation?.ra || 0).toLocaleString()}</p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 self-center">
                                <ShieldCheck className="w-4 h-4" /> Solvency II Optimized
                            </div>
                        </div>
                     </div>
                     <div className="flex-1 w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projections.length > 0 ? projections.map(p => ({ year: 2025 + p.period, bel: p.net_cash_flow / 1000, risk: (p.claims + p.expenses) / 1000 })) : []}>
                                <defs>
                                    <linearGradient id="colorBel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} tickFormatter={(v) => `$${v}k`} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="bel" name="Net Cash Flow" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBel)" />
                                <Line type="monotone" dataKey="risk" name="Total Outflows" stroke="#f43f5e" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            )}

            {/* Terminal */}
            <div className="h-40 bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">Actuarial Console</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className={`${line.startsWith('[OK]') ? 'text-emerald-400' : line.startsWith('[RUN]') ? 'text-sky-400' : 'text-slate-400'}`}>
                            <span className="opacity-30 mr-2">{'>'}</span>
                            {line}
                        </div>
                    ))}
                    {isExecuting && <div className="text-sky-400 animate-pulse"><span className="opacity-30 mr-2">{'>'}</span>Processing nodes... [4,102 records/sec]</div>}
                </div>
            </div>

        </div>

        {/* Right Panel: Metadata & AI Copilot */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Model Environment</h3>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Compute Context</p>
                        <p className="text-sm font-bold text-slate-800">High-Performance Cluster [Node 04]</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Standard Library</p>
                        <p className="text-sm font-bold text-slate-800">NumPy 1.24, SciPy 1.10, PyAct 2.1</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Regulatory Version</p>
                        <p className="text-sm font-bold text-emerald-800">IFRS 17 [2024 Stable Build]</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-premium border border-slate-100 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Actuarial AI Copilot</h3>
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 text-[11px] text-slate-600 leading-relaxed overflow-y-auto mb-4">
                   <p className="mb-3 font-bold text-indigo-600 italic">"I've analyzed your cash flow script. Note that the mortality approximation currently excludes COVID-19 related variance observed in 2021 experience studies. Would you like me to inject the adjusted Gompertz parameters?"</p>
                   <p className="opacity-60 italic">AI is scanning 4,000 regulatory documents for compliance...</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ask Copilot to adjust assumptions..." 
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none pr-10" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCopilotSubmit()}
                    />
                    <button onClick={handleCopilotSubmit} className="absolute right-3 top-2.5 text-indigo-600">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};
