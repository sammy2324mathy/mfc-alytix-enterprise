import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  Target,
  Users,
  FlaskConical,
  Zap
} from 'lucide-react';
import { MetricCard } from '../../components/data-display/MetricCard';

export const IntegratedDashboard: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      alert('Sovereign Simulation Complete: Enterprise Resiliency at 142%. No intervention required.');
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      {isSimulating && (
        <div className="absolute inset-0 z-[100] bg-indigo-600/20 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
           <FlaskConical className="w-16 h-16 text-white animate-bounce" />
           <div className="text-center px-6">
              <p className="text-2xl font-bold text-white tracking-widest uppercase mb-2">Neural stress test active</p>
              <p className="text-indigo-100 font-medium">Simulating 40% Market Drop across all departmental nodes...</p>
           </div>
           <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-full origin-left animate-[loading_3s_ease-in-out_infinite]" />
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Universal Enterprise Command</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Integrated Dashboard</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              A holistic neural-integrated view of the enterprise. Correlating Financial Health, Actuarial Risk, and Sovereign Governance in real-time.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={runSimulation}
             className="flex items-center gap-3 bg-indigo-600 px-6 py-3 rounded-2xl border border-white/10 shadow-xl hover:bg-indigo-500 transition-all text-white"
           >
              <FlaskConical className="w-5 h-5" /> 
              <span className="text-[10px] font-black uppercase tracking-widest">Run Market Simulation</span>
           </button>
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-premium">
              <Activity className="w-5 h-5 text-emerald-500" />
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Sync</p>
                 <p className="text-sm font-bold text-slate-900">ALL NODES ALIGNED</p>
              </div>
           </div>
        </div>
      </div>

      {/* Cross-Departmental Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Assets" value="$1.42B" trend="+2.4%" trendDirection="up" description="Accounting Integrated" icon={<DollarSign className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Risk Coverage" value="124%" trend="Stable" trendDirection="up" description="Actuarial Integrated" icon={<Target className="w-5 h-5 text-indigo-500" />} />
        <MetricCard title="Policy Compliance" value="99.9%" trend="Sovereign" trendDirection="up" description="Governance Integrated" icon={<ShieldCheck className="w-5 h-5 text-amber-500" />} />
        <MetricCard title="Neural Efficiency" value="94%" trend="+5%" trendDirection="up" description="AI Operations" icon={<TrendingUp className="w-5 h-5 text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900">Sovereign Financial Health</h3>
                     <p className="text-xs text-slate-500 font-medium">Daily correlation between Cash Flows & Claims Reserves</p>
                  </div>
               </div>
               <button className="p-2 hover:bg-slate-50 rounded-xl">
                  <ArrowUpRight className="w-5 h-5 text-slate-400" />
               </button>
            </div>
            <div className="p-10 h-80 flex items-center justify-center relative bg-slate-50/30">
               <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <BarChart3 className="w-64 h-64" />
               </div>
               <div className="relative z-10 text-center space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Vector Chart</p>
                  <p className="text-sm font-medium text-slate-500">Integrating multi-service data streams...</p>
                  <div className="flex gap-2 justify-center">
                     {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-8 bg-indigo-200 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-premium border border-white/5">
            <div>
               <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Governance Node</span>
               </div>
               <h3 className="text-2xl font-bold mb-4 leading-tight">100% Data Integrity Verified</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                  All departmental data streams are cryptographically hashed and cross-verified through the Sovereign Unified Engine.
               </p>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold">Latest Hash</span>
                  <span className="text-[10px] font-mono text-indigo-400">8f2c...9e8b</span>
               </div>
               <button className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all font-bold">
                  Run Full Integrity Audit
               </button>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium p-10">
         <div className="flex items-center gap-4 mb-10">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Department Alignment Nodes</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { name: 'Accounting', status: 'In-Sync', color: 'emerald' },
               { name: 'Actuarial', status: 'In-Sync', color: 'indigo' },
               { name: 'Risk Management', status: 'In-Sync', color: 'amber' },
               { name: 'Data Science', status: 'Model Training', color: 'rose' },
               { name: 'Compliance', status: 'Audit Active', color: 'slate' }
            ].map(dep => (
               <div key={dep.name} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-premium-sm transition-all cursor-default">
                  <div className={`w-3 h-3 rounded-full bg-${dep.color}-500 group-hover:animate-ping`} />
                  <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{dep.name}</p>
                     <p className="text-sm font-bold text-slate-900">{dep.status}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
