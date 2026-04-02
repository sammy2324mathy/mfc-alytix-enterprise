import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  ChevronRight,
  Shield,
  TrendingUp,
  Settings2,
  Search,
  Layers,
  Cpu,
  Wifi,
  History,
  AlertCircle
} from 'lucide-react';

export const ActuarialLayout: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isChief = user?.roles.includes('chief_actuary') || user?.roles.includes('admin');

  // Breadcrumb Logic
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeLabel = pathSegments[pathSegments.length - 1] || 'Dashboard';
  const displayLabel = activeLabel.charAt(0).toUpperCase() + activeLabel.slice(1).replace('-', ' ');

  const isWorkspace = location.pathname === '/actuarial/workspace';

  return (
    <div className="flex flex-col h-full bg-slate-50/80 -m-6 md:-m-8 overflow-hidden font-sans">
      
      {/* 1. PROFESSIONAL COMMAND BAR (Sub-Header) - Hidden in Workspace Mode for Immersive Modeling */}
      {!isWorkspace && (
        <header className="h-[72px] bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center justify-between shrink-0 relative z-30 shadow-sm transition-all duration-500 hover:shadow-md">
          <div className="flex items-center gap-10">
              {/* Dept Branding & Breadcrumb Node */}
              <div className="flex items-center gap-6 group cursor-pointer">
                 <div className="w-11 h-11 rounded-[20px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                    <Cpu className="w-5 h-5 text-white animate-pulse" />
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                       <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase italic leading-none">Actuarial Intelligence Hub</h1>
                       <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{displayLabel}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                       <div className="flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Compute Node: 3122-A / ACTIVE</p>
                       </div>
                    </div>
                 </div>
              </div>
          </div>

          <div className="flex items-center gap-6">
              {/* Global Search Tool */}
              <div className="relative group/search hidden xl:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Universal Model Lookup (KDN/SHA)..."
                    className="bg-slate-50 border border-slate-200/50 rounded-xl pl-9 pr-4 py-2.5 text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all w-64 group-focus-within/search:w-80 shadow-inner"
                 />
              </div>

              <div className="h-8 w-[1px] bg-slate-200/60" />

              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-200/30 rounded-2xl shadow-inner group/queue cursor-help">
                    <div className="flex gap-1 items-end h-3">
                       {[1,2,3,4].map(i => <div key={i} className={`w-1 rounded-full transition-all ${i <= 2 ? 'bg-indigo-400 h-3 animate-bounce' : 'bg-slate-200 h-1.5'}`} style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Queue: 2 Jobs</span>
                 </div>
                 
                 {isChief && (
                   <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-50 border border-amber-100/50 rounded-2xl border-dashed shadow-sm">
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest leading-none mb-1">Authorization Node</span>
                         <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-none italic">Chief Sign-off Actuary</span>
                      </div>
                   </div>
                 )}
                 
                 <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative group/settings">
                    <Settings2 className="w-4.5 h-4.5 group-hover/settings:rotate-90 transition-transform duration-500" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4 shadow-sm" />
                 </button>
              </div>
          </div>
        </header>
      )}

      {/* 2. MAIN DATA VIEWPORT */}
      <main className={`flex-1 overflow-y-auto relative bg-slate-50/40 ${isWorkspace ? 'p-0' : 'p-8'}`}>
         
         {/* Contextual System Alerts (Only visible in Standard Hub mode) */}
         {!isWorkspace && (
           <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-5 flex items-center justify-between text-white shadow-2xl shadow-indigo-200 border border-indigo-700/50 group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:rotate-6 transition-transform">
                       <AlertCircle className="w-6 h-6 text-indigo-100" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/80 mb-1">Global Actuarial Alert</p>
                       <h3 className="text-sm font-bold tracking-wide italic">Mortality Experience Study for Q1 2025 has been finalized and requires Chief sign-off.</h3>
                    </div>
                 </div>
                 <button className="px-6 py-2 bg-indigo-600/50 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indigo-500/50 backdrop-blur-md transition-all">Sign-off Now</button>
              </div>

              <div className="w-full md:w-80 bg-white rounded-3xl p-5 flex items-center gap-6 border border-slate-200 shadow-xl shadow-slate-100 group">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">System Health</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       L-3 Clusters Ready
                    </p>
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[78%]" />
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* Content Container */}
         <div className={`${isWorkspace ? 'max-w-none w-full h-full' : 'max-w-[1680px] mx-auto animate-fade-in'}`}>
            <Outlet />
         </div>
      </main>

      {/* Modern Status Footer (Only in Hub mode) */}
      {!isWorkspace && (
        <footer className="h-10 bg-slate-100/50 border-t border-slate-200/60 px-8 flex items-center justify-between shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <Wifi className="w-3 h-3 text-emerald-500" />
                 <span>Socket Node: High Capacity</span>
              </div>
              <div className="flex items-center gap-2">
                 <History className="w-3 h-3" />
                 <span>Last Snapshot: 2:00 AM ISO</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><Layers className="w-3 h-3" /> Grid Mesh: Active</span>
              <span className="text-indigo-500 italic">Antigravity IADE Platform</span>
           </div>
        </footer>
      )}
    </div>
  );
};
