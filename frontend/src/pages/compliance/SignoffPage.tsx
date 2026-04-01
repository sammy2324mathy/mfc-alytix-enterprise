import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  History,
  BrainCircuit,
  Fingerprint,
  CheckCircle2,
  Activity,
  Lock,
  Search,
  FileText,
  AlertTriangle,
  ArrowRight,
  FileDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { complianceApi } from '../../services/complianceApi';
import { Skeleton } from '../../components/ui/Skeleton';

export const SignoffPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['hybrid-telemetry'],
    queryFn: complianceApi.getHybridTelemetry,
    refetchInterval: 5000
  });

  return (
    <div className="space-y-10 animate-fade-in px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Neural Compliance Node</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Hybrid Governance Center</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              Comprehensive audit trail of human-AI collaboration. Digital attestations and expert calibrations are anchored in the immutable system ledger.
           </p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
           <ShieldCheck className="w-6 h-6 text-emerald-600" />
           <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">System Status</p>
              <p className="text-sm font-bold text-emerald-900">HYBRID SOVEREIGN ACTIVE</p>
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expert Calibrations</p>
            <p className="text-3xl font-black text-slate-900">42</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Professional oversight events</p>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Neural Attestations</p>
            <p className="text-3xl font-black text-slate-900">892</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Autonomous validation cycles</p>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Integrity</p>
            <p className="text-3xl font-black text-emerald-600">100.0%</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Tamper-proof ledger status</p>
         </div>
      </div>

      {/* Hybrid Audit Trail */}
      <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900">Neural-Augmented Audit Trail</h3>
           </div>
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
           </div>
        </div>

        <div className="divide-y divide-slate-100">
           {isLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="p-8"><Skeleton className="h-16 w-full rounded-2xl" /></div>)
           ) : logs && logs.length > 0 ? (
              logs.map((log: any) => (
                 <div key={log.id} className="p-8 flex items-start justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex gap-6">
                       <div className={`w-12 h-12 rounded-[20px] shrink-0 flex items-center justify-center border-2 ${
                          log.event_type === 'EXPERT_COLLABORATION' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                          log.event_type === 'EXPERT_CALIBRATION' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                          'bg-emerald-50 border-emerald-100 text-emerald-600'
                       }`}>
                          {log.event_type === 'EXPERT_COLLABORATION' ? <Fingerprint className="w-6 h-6" /> :
                           log.event_type === 'EXPERT_CALIBRATION' ? <Activity className="w-6 h-6" /> :
                           <BrainCircuit className="w-6 h-6" />}
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{log.action}</span>
                             <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${
                                log.event_type === 'EXPERT_COLLABORATION' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                log.event_type === 'EXPERT_CALIBRATION' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                             }`}>
                                {log.event_type}
                             </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                          <div className="flex items-center gap-3 mt-3">
                             <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <FileText className="w-3 h-3" /> {log.target_id}
                             </span>
                             <span className="w-1 h-1 rounded-full bg-slate-300" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actor: {log.actor}</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Confidence: {log.ai_confidence}%</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</p>
                       <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                 </div>
              ))
           ) : (
              <div className="p-20 text-center text-slate-400 italic">Listening for neural governance events...</div>
           )}
        </div>

        <div className="p-10 bg-slate-900 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                 <Zap className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                 <h4 className="text-xl font-bold text-white tracking-tight">Autonomous Filing Engine</h4>
                 <p className="text-slate-400 text-sm font-medium">Ready to bundle neural evidence for regulator submission.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => alert('Sovereign Filing Engine: Neural Report Generated for Q3-2026')}
                className="px-10 py-5 bg-white rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center gap-3 shadow-2xl"
              >
                 <FileDown className="w-5 h-5 text-indigo-600" /> Generate Regulatory Filing
              </button>
              <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all border border-white/10">
                 Global Sign-off
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
