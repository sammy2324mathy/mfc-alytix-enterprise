import React, { useState, useEffect } from 'react';
import { 
  Terminal, Beaker, Play, Save, History, Database, Cpu, 
  Settings2, Activity, Target, Zap, ShieldCheck, BrainCircuit,
  LayoutGrid, Share2, Search, Sliders, Layers, 
  BarChart3, RefreshCw, ChevronRight, MessageSquare,
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight, Maximize2, Minimize2
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../services/apiClient';

const INITIAL_CODE = `# 🛡️ ML Intelligence Kernel V4.2 [Sovereign Edition]
import torch
import torch.nn as nn
import pandas as pd
import numpy as np

class CorporateRiskModel(nn.Module):
    def __init__(self, input_size=128):
        super(CorporateRiskModel, self).__init__()
        # Forensic Encoding Layer
        self.encoder = nn.Sequential(
            nn.Linear(input_size, 256),
            nn.LayerNorm(256),
            nn.GELU(),
            nn.Dropout(0.15),
            nn.Linear(256, 128)
        )
        # Latent Decision Head
        self.classifier = nn.Linear(128, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        features = self.encoder(x)
        return self.sigmoid(self.classifier(features))

# Initialize Sovereign Intelligence Engine
model = CorporateRiskModel()
optimizer = torch.optim.AdamW(model.parameters(), lr=1.2e-4, weight_decay=1e-5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)`;

const ML_FILES = [
  { id: '1', name: 'claims_ensemble_v2.py', type: 'python', status: 'stable', size: '12.4 KB' },
  { id: '2', name: 'fraud_detection_weights.bin', type: 'binary', status: 'legacy', size: '256.0 MB' },
  { id: '3', name: 'training_history_q4.json', type: 'json', status: 'synced', size: '1.2 MB' },
  { id: '4', name: 'deployment_config.yaml', type: 'yaml', status: 'modified', size: '4.8 KB' },
  { id: '5', name: 'preprocess_kernel.py', type: 'python', status: 'stable', size: '8.2 KB' },
];

const FEATURE_RADAR = [
  { subject: 'Historical Accuracy', A: 120, B: 110, fullMark: 150 },
  { subject: 'Compute Efficiency', A: 115, B: 130, fullMark: 150 },
  { subject: 'Data Density', A: 95, B: 130, fullMark: 150 },
  { subject: 'Model Entropy', A: 130, B: 100, fullMark: 150 },
  { subject: 'Predictive Lift', A: 110, B: 90, fullMark: 150 },
  { subject: 'Latency (ms)', A: 140, B: 85, fullMark: 150 },
];

const INITIAL_TERMINAL = [
  "[SYSTEM] Sovereign Data Science Lab initializing...",
  "[KERNEL] Connection to Cluster: GPU-A100-PROD-01 established.",
  "[AUTH] Session authenticated under Sovereign Shield (Level 4).",
  "[SSoT] Claims dataset shard 0x44fa loaded into memory (4.2GB).",
  "[READY] Integrated ML Workbench Active."
];

// State types
interface MLFile { id: string; name: string; type: string; status: string; size?: string; }
interface TrainingDataPoint { epoch: number; loss: number; val_loss: number; accuracy: number; }
interface RadarDataPoint { subject: string; A: number; B: number; fullMark: number; }

export const DataScienceLabPage: React.FC = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState<'editor' | 'training' | 'validation'>('editor');
  const [isTraining, setIsTraining] = useState(false);
  const [files, setFiles] = useState<MLFile[]>(ML_FILES);
  const [trainingData, setTrainingData] = useState<TrainingDataPoint[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>(FEATURE_RADAR);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(INITIAL_TERMINAL);
  
  // UI States for Workbench Mode
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesRes = await apiClient.get('/ds/lab/files');
        if (filesRes.data) setFiles(filesRes.data);
        
        const radarRes = await apiClient.get('/ds/lab/metrics/radar');
        if (radarRes.data) setRadarData(radarRes.data);
      } catch (err) {
        console.warn('Backend lab routes not fully established. Using high-fidelity mocks.');
      }
    };
    fetchData();
  }, []);

  const handleRunTraining = async () => {
    setIsTraining(true);
    setTerminalOutput(prev => [...prev.slice(-10), "[PROC] Compiling JIT kernel...", "[TRAIN] Initializing epoch 1/100..."]);
    
    try {
      const response = await apiClient.post('/ds/lab/execute', { code, environment: 'pytorch-2.1' });
      const data = response.data;
      setTrainingData(data.metrics);
      setTerminalOutput(prev => [...prev, ...data.logs]);
      toast.success('Simulation kernel completed successfully');
      setActiveTab('training');
    } catch (err) {
      // Simulate realistic training telemetry if backend isn't ready
      setTimeout(() => {
        const simulatedMetrics = Array.from({ length: 50 }).map((_, i) => ({
          epoch: i + 1,
          loss: Math.exp(-i/10) + Math.random() * 0.05,
          val_loss: Math.exp(-i/12) + 0.1 + Math.random() * 0.08,
          accuracy: 0.8 + (0.19 * (i/50)) + Math.random() * 0.01
        }));
        setTrainingData(simulatedMetrics);
        setTerminalOutput(prev => [...prev, "[SUCCESS] Convergence reached at epoch 48.", "[EXPORT] Model weights saved to /shards/fraud_q4_v2.bin"]);
        setIsTraining(false);
        setActiveTab('training');
        toast.success('Simulation kernel completed [DEVELOPER MOCK MODE]');
      }, 3000);
    } finally {
      // isTraining set to false in timeout if error, or immediately if success
    }
  };

  return (
    <div className={`h-full flex flex-col bg-[rgb(8,10,14)] text-slate-300 font-sans select-none overflow-hidden ${isFullScreen ? 'fixed inset-0 z-[100]' : ''}`}>
      
      {/* 🚀 ELITE WORKBENCH HEADER */}
      <header className="h-14 bg-[rgb(13,16,24)] border-b border-white/5 flex items-center justify-between px-4 shrink-0 shadow-lg shadow-black/40 z-50">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Beaker className="w-4 h-4 text-white" />
           </div>
           <div className="flex flex-col">
              <h1 className="text-xs font-black text-white tracking-[0.2em] uppercase">ML Super-Lab <span className="text-indigo-400 font-normal ml-2">V4.2.0</span></h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Kernel Active: Tesla A100-80GB</span>
              </div>
           </div>
        </div>

        <nav className="flex bg-black/40 p-1 rounded-xl border border-white/5 mx-auto">
           {[
             { id: 'editor', name: 'Code Architecture', icon: Terminal },
             { id: 'training', name: 'Neural Telemetry', icon: BrainCircuit },
             { id: 'validation', name: 'Forensic Validation', icon: Layers },
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`flex items-center gap-2.5 h-8 px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
             >
                <t.icon className="w-3.5 h-3.5" />
                {t.name}
             </button>
           ))}
        </nav>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleRunTraining}
             disabled={isTraining}
             className="h-9 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
           >
              {isTraining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Run Kernel
           </button>
           <div className="h-6 w-[1px] bg-white/10 mx-1" />
           <button 
             onClick={() => setIsFullScreen(!isFullScreen)}
             className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
           >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
           </button>
        </div>
      </header>

      {/* 🧪 INTERACTIVE WORKBENCH GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 📁 ASSET NAVIGATOR (Collapsible) */}
        <aside className={`${leftSidebarOpen ? 'w-64' : 'w-0'} bg-[rgb(11,13,19)] border-r border-white/5 transition-all duration-300 flex flex-col shrink-0 overflow-hidden relative`}>
           <div className="p-5 flex items-center justify-between border-b border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Explorer</span>
              <PanelLeftClose onClick={() => setLeftSidebarOpen(false)} className="w-3.5 h-3.5 text-slate-600 hover:text-white cursor-pointer" />
           </div>

           <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                 <div className="flex items-center gap-2 px-2 py-1 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3"> 
                    <Cpu className="w-3 h-3 text-cyan-500" /> Shard Index
                 </div>
                 <div className="space-y-0.5">
                    {files.map(f => (
                       <div key={f.id} className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-3">
                             <Terminal className={`w-3.5 h-3.5 ${f.status === 'stable' ? 'text-indigo-400' : 'text-amber-500'}`} />
                             <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">{f.name}</span>
                                <span className="text-[8px] text-slate-600 font-black">{f.size}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600/10 to-transparent p-5 rounded-3xl border border-indigo-500/10 border-l-4 border-l-indigo-600">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Model Context</h4>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                    Training for Q4 Claims adjudication hub. Convergence expected <span className="text-white">within 4 hours</span> on current hardware stack.
                 </p>
              </div>
           </div>

           <div className="p-5 bg-black/20 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                 <span className="text-slate-500">GPU Temp</span>
                 <span className="text-emerald-500 italic">42°C</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[42%]" />
              </div>
           </div>
        </aside>

        {!leftSidebarOpen && (
          <button onClick={() => setLeftSidebarOpen(true)} className="fixed left-4 bottom-24 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 z-[60] animate-in slide-in-from-left">
             <PanelLeft className="w-5 h-5" />
          </button>
        )}

        {/* 💻 MAIN STICKY-EDITOR / ANALYTICS AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-[rgb(5,7,10)] relative">
           
           <div className="flex-1 relative overflow-hidden">
              {activeTab === 'editor' && (
                <div className="h-full flex flex-col">
                   <div className="flex-1 flex overflow-hidden">
                      <div className="w-10 flex flex-col items-center py-8 gap-1.5 font-mono text-[9px] text-slate-700 select-none bg-black/20 shrink-0">
                         {Array.from({ length: 60 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                      </div>
                      <textarea
                        value={code} onChange={e => setCode(e.target.value)}
                        placeholder="Define neural architecture..."
                        className="flex-1 bg-transparent p-8 font-mono text-sm text-indigo-200/90 outline-none resize-none leading-relaxed selection:bg-indigo-500/40 custom-scrollbar"
                        spellCheck={false}
                      />
                   </div>
                   
                   {/* 📟 EMBEDDED DYNAMICS MONITOR */}
                   <div className="h-48 bg-[rgb(10,12,18)] border-t border-white/5 flex flex-col shrink-0">
                      <div className="h-10 px-6 border-b border-white/5 bg-black/40 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">System Kernel Output</span>
                         </div>
                         <div className="text-[9px] font-bold text-slate-600">PROCESS_ID: 10242.01</div>
                      </div>
                      <div className="flex-1 p-5 overflow-y-auto font-mono text-[10px] space-y-1.5 custom-scrollbar scrolling-auto">
                         {terminalOutput.map((l, i) => (
                           <div key={i} className={`flex gap-4 ${l.includes('[ERR]') ? 'text-rose-500' : l.includes('[SSoT]') ? 'text-indigo-400' : 'text-slate-500 italic'}`}>
                              <span className="opacity-10 w-8 select-none">[{i}]</span>
                              <span className="flex-1">{l}</span>
                           </div>
                         ))}
                         {isTraining && (
                           <div className="flex gap-4 text-emerald-500/50 animate-pulse italic">
                              <span className="opacity-10 w-8">[..]</span>
                              <span>Calibrating backpropagation mesh... Compute active.</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'training' && (
                <div className="h-full p-10 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500">
                   <div className="max-w-6xl mx-auto space-y-10">
                      <div className="grid grid-cols-4 gap-6">
                         {[
                           { label: 'Avg Validation Loss', value: trainingData[trainingData.length-1]?.val_loss.toFixed(6) || '0.000', trend: '-12%', icon: Target, color: 'text-indigo-400' },
                           { label: 'Final Accuracy', value: (trainingData[trainingData.length-1]?.accuracy * 100).toFixed(2) || '0.00', suffix: '%', trend: '+4.2%', icon: Activity, color: 'text-emerald-400' },
                           { label: 'Gradient Momentum', value: '0.994', trend: 'STABLE', icon: Zap, color: 'text-amber-400' },
                           { label: 'Active Parameters', value: '4.2M', trend: 'MATCH', icon: Cpu, color: 'text-cyan-400' },
                         ].map((s, i) => (
                           <div key={i} className="p-6 bg-slate-900/50 border border-white/5 rounded-[28px] hover:border-slate-700 transition-all shadow-xl">
                              <div className="flex items-center gap-3 mb-4">
                                 <s.icon className={`w-4 h-4 ${s.color}`} />
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-3xl font-black text-white italic tracking-tighter">{s.value}</span>
                                 <span className="text-xl font-bold text-slate-600 italic">{s.suffix}</span>
                              </div>
                              <div className="mt-4 text-[10px] font-black uppercase text-slate-600 tracking-widest flex justify-between items-center bg-black/20 px-3 py-1 rounded-full">
                                 <span>Shift delta</span>
                                 <span className={s.trend.startsWith('+') ? 'text-emerald-500' : s.trend.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}>{s.trend}</span>
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="bg-slate-900/40 p-10 rounded-[40px] border border-white/5 border-t-indigo-500/20 shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Convergence Telemetry</h3>
                               <div className="flex gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                  <div className="flex items-center gap-2 pr-4 border-r border-white/5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Loss</div>
                                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Validation</div>
                               </div>
                            </div>
                            <div className="h-[300px]">
                               <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={trainingData}>
                                     <defs>
                                        <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                     <XAxis dataKey="epoch" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#475569', fontWeight: 'bold'}} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#475569', fontWeight: 'bold'}} />
                                     <Tooltip contentStyle={{ borderRadius: '24px', background: '#0f172a', border: '1px solid #ffffff10', color: '#fff' }} />
                                     <Area type="monotone" dataKey="loss" stroke="#6366f1" strokeWidth={4} fill="url(#colorLoss)" animationDuration={1000} />
                                     <Area type="monotone" dataKey="val_loss" stroke="#10b981" strokeWidth={4} fill="url(#colorVal)" animationDuration={1500} />
                                  </AreaChart>
                               </ResponsiveContainer>
                            </div>
                         </div>

                         <div className="bg-slate-900/40 p-10 rounded-[40px] border border-white/5 flex flex-col items-center justify-center shadow-2xl relative">
                            <div className="absolute top-10 flex flex-col items-center">
                               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Forensic Quality Signature</h3>
                               <p className="text-[10px] font-bold text-slate-700 italic border-t border-white/5 mt-2 pt-1 uppercase tracking-widest px-4">Sovereign Validation Cluster</p>
                            </div>
                            <div className="w-full h-full min-h-[300px]">
                               <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart data={radarData}>
                                     <PolarGrid stroke="#ffffff05" />
                                     <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fill: '#475569', fontWeight: 'bold'}} />
                                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                     <Radar name="Active Weights" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.7} />
                                     <Radar name="Baseline Q3" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                     <Tooltip />
                                  </RadarChart>
                               </ResponsiveContainer>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </main>

        {/* 🤖 HYPER-INTELLIGENCE SIDEBAR (Collapsible) */}
        <aside className={`${rightSidebarOpen ? 'w-80' : 'w-0'} bg-[rgb(11,13,19)] border-l border-white/5 transition-all duration-300 flex flex-col shrink-0 overflow-hidden relative shadow-2xl`}>
           <div className="p-5 flex items-center justify-between border-b border-white/5">
              <PanelRightClose onClick={() => setRightSidebarOpen(false)} className="w-3.5 h-3.5 text-slate-600 hover:text-white cursor-pointer" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Insights</span>
           </div>

           <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
              <section>
                 <div className="flex items-center gap-3 text-emerald-400 mb-6">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Hyper-Params</span>
                 </div>
                 <div className="space-y-5">
                    {[
                      { label: 'Learning Rate', val: '0.00012', hint: 'GELU Optimized' },
                      { label: 'Bottleneck Dim', val: '256 Layers', hint: 'Expansional' },
                      { label: 'Gradient Clip', val: '1.0 Factor', hint: 'Sovereign V1' },
                    ].map((p, i) => (
                      <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">{p.label}</span>
                            <Settings2 className="w-3 h-3 text-slate-600" />
                         </div>
                         <div className="flex items-baseline justify-between">
                            <span className="text-xs font-black text-white italic tracking-tighter">{p.val}</span>
                            <span className="text-[8px] font-bold text-slate-700 italic uppercase">{p.hint}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="bg-slate-900/50 p-6 rounded-[32px] border border-white/10 relative overflow-hidden flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">AI Reasoning</span>
                 </div>
                 <div className="relative z-10 flex flex-col gap-4">
                    <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 text-[11px] leading-relaxed italic text-slate-400 border-l-4 border-indigo-600 shadow-xl">
                       "Auditing model topology... suggest increasing <span className="text-white">weight_decay</span> to prevent overfitting on outlier claims shards."
                    </div>
                    <div className="p-4 text-[10px] bg-emerald-600/10 rounded-2xl text-emerald-400 border border-emerald-500/20 text-center font-bold italic">
                       Model Confidence: 98.4% [STABLE]
                    </div>
                 </div>
              </section>
           </div>

           <div className="p-6">
              <div className="relative">
                 <input
                   type="text"
                   placeholder="Instruct Copilot..."
                   className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold text-white placeholder-slate-600 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/40 transition-all pr-12"
                 />
                 <button className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-white transition-all">
                    <MessageSquare className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </aside>

        {!rightSidebarOpen && (
          <button onClick={() => setRightSidebarOpen(true)} className="fixed right-4 bottom-24 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 z-[60] animate-in slide-in-from-right">
             <PanelRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};
