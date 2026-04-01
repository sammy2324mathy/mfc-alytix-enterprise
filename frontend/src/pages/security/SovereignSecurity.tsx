import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  RefreshCcw, 
  ShieldAlert,
  Fingerprint,
  Activity,
  Cpu,
  Binary,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { useSecurity } from '../../context/SecurityContext';

export const SovereignSecurity: React.FC = () => {
  const { isMaskingActive, toggleMasking } = useSecurity();
  const securityNodes = [
    { name: 'Accounting-Service', status: 'Active', encryption: 'AES-256-GCM', seals: 124, lastSync: '2m ago' },
    { name: 'Actuarial-Service', status: 'Active', encryption: 'AES-256-GCM', seals: 42, lastSync: '5m ago' },
    { name: 'Risk-Service', status: 'Active', encryption: 'AES-256-GCM', seals: 89, lastSync: '1m ago' },
    { name: 'Auth-Service', status: 'Active', encryption: 'ECC-P384', seals: 1205, lastSync: 'Now' },
    { name: 'Compliance-Service', status: 'Active', encryption: 'HMAC-SHA256', seals: 562, lastSync: '10m ago' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Sovereign Security Node</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Security Hub</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              End-to-end cryptographic orchestration. Monitoring active encryption nodes and the state of Sovereign Seals across the hybrid landscape.
           </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
           <Binary className="w-6 h-6 text-indigo-400" />
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Encryption</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">AES-256-Sovereign ACTIVE</p>
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Seals" value="2,022" trend="Immutable" trendDirection="up" description="Cryptographic attestations" icon={<Fingerprint className="w-5 h-5 text-indigo-500" />} />
        <MetricCard title="Key Rotation" value="24h" trend="Automated" trendDirection="up" description="Global secret interval" icon={<RefreshCcw className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Privacy Shield" value="99.9%" trend="Zero-Leak" trendDirection="up" description="Data masking efficiency" icon={<Eye className="w-5 h-5 text-amber-500" />} />
        <MetricCard title="Threat Surface" value="Minimal" trend="Optimal" trendDirection="up" description="Real-time perimeter status" icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} />
      </div>

      {/* Encryption Nodes List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
           <Cpu className="w-6 h-6 text-indigo-600" />
           <h3 className="text-xl font-bold text-slate-900">Cryptographic Service Nodes</h3>
        </div>
        <div className="divide-y divide-slate-100">
           {securityNodes.map((node) => (
              <div key={node.name} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                       <Lock className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-slate-900">{node.name}</h4>
                       <p className="text-xs text-slate-500 font-medium tracking-tight">Active Encryption: {node.encryption}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12 text-right">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Seals</p>
                       <p className="text-lg font-black text-slate-900">{node.seals}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <div className="flex items-center gap-2 text-emerald-600">
                          <Activity className="w-4 h-4 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-widest">{node.status}</span>
                       </div>
                    </div>
                    <div className="w-24">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                       <p className="text-xs font-bold text-slate-600 italic">{node.lastSync}</p>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Identity & Key Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-premium relative overflow-hidden group hover:shadow-indigo-500/20 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Key className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-4">Privacy Masking (Cloak)</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-md">
                  Automatically masks sensitive PII and financial figures across all specialist workspaces using Sovereign Blue Blur technology.
               </p>
               <button 
                 onClick={toggleMasking}
                 className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                   isMaskingActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                 }`}
               >
                  {isMaskingActive ? (
                    <>Masking Active <ToggleRight className="w-5 h-5 text-emerald-400" /></>
                  ) : (
                    <>Masking Inactive <ToggleLeft className="w-5 h-5" /></>
                  )}
               </button>
            </div>
         </div>

         <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-900">Zero-Trust Environment</h3>
               <p className="text-slate-500 text-xs font-medium max-w-xs mt-2">
                  All microservices are isolated and require cryptographic peer-verification for any cross-node data streaming.
               </p>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase">Service Isolation: ON</div>
               <div className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase">Sealing Engine: Active</div>
            </div>
         </div>
      </div>
    </div>
  );
};
