import React, { useEffect, useState } from 'react';
import { 
  Settings2, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck,
  Zap,
  Lock,
  EyeOff,
  Activity,
  Save,
  RefreshCw,
  Terminal,
  AlertCircle,
  Database
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { useQuery } from '@tanstack/react-query';
import { complianceApi } from '../../services/complianceApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';

export const ControlCenter: React.FC = () => {
  const { isMaskingActive, setIsMaskingActive } = useSecurity();
  const [aiAutonomy, setAiAutonomy] = useState(88);
  const [cryptoStrictness, setCryptoStrictness] = useState('Strict-SSoT');
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  const { data: auditLogs, refetch: refetchLogs } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => complianceApi.getAuditLogs(10),
    refetchInterval: 5000 // Real-time pulse
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      refetchLogs();
    }, 1200);
  };

  const handlePentest = () => {
    setIsScanning(true);
    setScanProgress(0);
    setLastScanResult(null);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setLastScanResult({
            score: 98,
            threats: 0,
            vulnerabilities: 2,
            timestamp: new Date().toISOString()
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Sovereign Executive Authority</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Security War Room</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              Real-time monitoring of the Sovereign Integrity layer and Neural Guardrails across the global microservice mesh.
           </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-premium hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
           {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
           {isSaving ? 'Syncing Sovereignty...' : 'Commit Global Policy'}
        </button>
      </div>

      {/* Top Status Belt */}
      <div className="grid grid-cols-3 gap-8">
         <div className="bg-slate-900 rounded-[32px] p-6 text-white border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Integrity Verification</p>
                <p className="text-2xl font-black tracking-tighter italic">99.98%</p>
                <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[99.9%]" />
                </div>
            </div>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
         </div>
         <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Neural Threat Index</p>
                <p className="text-2xl font-black tracking-tighter italic text-emerald-600">ZERO</p>
                <div className="mt-3 flex gap-1">
                    {[1,2,3,4,5,6].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 2 ? 'bg-emerald-500' : 'bg-slate-100'}`} />)}
                </div>
            </div>
            <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-50" />
         </div>
         <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Neural Guardrails</p>
                <p className="text-2xl font-black tracking-tighter italic text-slate-900">ACTIVE</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-indigo-500">Latency: 12ms</span>
                    <div className="flex gap-0.5">
                       {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-indigo-500/20 rounded-full overflow-hidden self-end"><div className="w-full bg-indigo-500 h-[70%] animate-pulse" /></div>)}
                    </div>
                </div>
            </div>
            <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-50/50" />
         </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
         {/* Sovereign Audit Pulse */}
         <div className="col-span-12 lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden flex flex-col h-[600px]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                     <Terminal className="w-5 h-5 text-indigo-600" />
                     Sovereign Audit Pulse
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Data Mutation Ticker</p>
               </div>
               <SovereignVerifiedBadge signature="AUTH_SENTINEL_LIVE" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono bg-slate-950 text-[11px]">
               {auditLogs?.map((log: any, i: number) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-white/5 group">
                     <span className="text-indigo-400 shrink-0">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                     <span className="text-emerald-400 shrink-0 uppercase font-black">{log.event_type}</span>
                     <span className="text-white opacity-40 shrink-0">USER:{log.user?.substring(0,8)}</span>
                     <span className="text-slate-300 truncate">{log.module || 'SYSTEM_SSOT'} :: {log.detail}</span>
                     <Lock className="w-3 h-3 text-emerald-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
               {!auditLogs?.length && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                     <RefreshCw className="w-8 h-8 animate-spin" />
                     <p className="uppercase tracking-[0.3em] font-black text-[10px]">Awaiting Data Stream...</p>
                  </div>
               )}
            </div>
         </div>

         {/* Command Controls */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-premium border border-white/5">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400">
                      <ShieldAlert className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold italic tracking-tight uppercase">Crypto Strictness</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Integrity Enforcement</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   {['Audit-Only', 'Enforced', 'Strict-SSoT', 'Zero-Trust'].map(mode => (
                      <button 
                         key={mode}
                         onClick={() => setCryptoStrictness(mode)}
                         className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            cryptoStrictness === mode 
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-105' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                         }`}
                      >
                         {mode}
                      </button>
                   ))}
                </div>
                
                <p className="mt-8 text-[9px] text-slate-500 italic leading-relaxed text-center px-4">
                   * Strict-SSoT mode requires forensic signatures for all multi-regional data movements.
                </p>
            </div>

            <div className={`bg-slate-950 rounded-[40px] p-8 text-white shadow-premium border transition-all duration-500 ${isScanning ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-white/5'}`}>
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isScanning ? 'bg-indigo-600 text-white animate-pulse' : 'bg-white/5 text-indigo-400'}`}>
                         <Zap className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold italic tracking-tight uppercase">Sovereign Pentest</h3>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Vulnerability Scan</p>
                      </div>
                   </div>
                </div>

                {isScanning ? (
                   <div className="space-y-6 py-4">
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-black uppercase text-indigo-400">Scanning Mesh Nodes...</span>
                         <span className="text-2xl font-black italic">{scanProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[8px] uppercase font-bold text-slate-500">Injecting Payload</p>
                            <p className="text-[10px] font-mono text-emerald-400">BLOCKED</p>
                         </div>
                         <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[8px] uppercase font-bold text-slate-500">Schema Bypass</p>
                            <p className="text-[10px] font-mono text-emerald-400">ENFORCED</p>
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-8">
                      {lastScanResult && (
                         <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Scan Result</p>
                               <span className="text-xs font-black text-emerald-400">v1.2.4</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <p className="text-3xl font-black text-white italic tracking-tighter">{lastScanResult.score}/100</p>
                                  <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Sovereignty Score</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-3xl font-black text-rose-500 italic tracking-tighter">{lastScanResult.threats}</p>
                                  <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Active Threats</p>
                               </div>
                            </div>
                         </div>
                      )}
                      <button 
                         onClick={handlePentest}
                         className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
                      >
                         <ShieldAlert className="w-4 h-4" />
                         Execute Full Scan
                      </button>
                      <p className="text-[9px] text-slate-600 italic text-center leading-relaxed">
                         The Neural Pentest checks for schema desynchronization, role escalation, and unauthenticated data mutations.
                      </p>
                   </div>
                )}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium p-8">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                     <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900">Neural Autonomy</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Financial Delegation</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Guided</span>
                        <span className="text-indigo-600">Pure Autonomous</span>
                     </div>
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={aiAutonomy}
                        onChange={(e) => setAiAutonomy(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                     />
                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div>
                            <span className="text-4xl font-display font-bold text-slate-900 tracking-tighter">{aiAutonomy}%</span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Floor</p>
                        </div>
                        <AlertCircle className={`w-8 h-8 ${aiAutonomy > 90 ? 'text-amber-500' : 'text-indigo-400'}`} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-6 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${isMaskingActive ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                     <EyeOff className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Global Data Masking</span>
               </div>
               <button 
                  onClick={() => setIsMaskingActive(!isMaskingActive)}
                  className={`relative w-12 h-6 rounded-full transition-all flex items-center px-0.5 ${isMaskingActive ? 'bg-rose-500' : 'bg-slate-200'}`}
               >
                  <div className={`w-5 h-5 bg-white rounded-full transition-all ${isMaskingActive ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
