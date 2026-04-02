import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  Search, 
  HelpCircle, 
  Menu,
  ShieldCheck,
  Zap,
  Sparkles,
  Command
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { CommandMenu } from './CommandMenu';
import { GlobalAI } from '../ai/GlobalAI';
import { GlobalSearch } from '../navigation/GlobalSearch';
import { GlobalSettingsModal } from './GlobalSettingsModal';
import { useAuthStore } from '../../store/authStore';
import { workspaceApi } from '../../services/workspaceApi';

export const Layout: React.FC = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: workspaceApi.getUnreadCount,
    refetchInterval: 30000 
  });

  const userRoles = user?.roles || [];
  const primaryRole = userRoles[0] || 'Unassigned';

  const roleLabelMap: Record<string, string> = {
    admin: 'System Administrator',
    chief_accountant: 'Chief Accountant',
    junior_accountant: 'Junior Accountant',
    chief_actuary: 'Chief Actuary',
    actuarial_analyst: 'Actuarial Analyst',
    data_scientist: 'Lead Data Scientist',
    cro: 'Chief Risk Officer',
    risk_analyst: 'Risk Analyst',
    chief_compliance_officer: 'Chief Compliance Officer',
    compliance_officer: 'Compliance Officer',
  };

  const roleLabel = roleLabelMap[primaryRole] || primaryRole.replace(/_/g, ' ');

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const isActuarialWorkspace = location.pathname === '/actuarial/workspace';

  return (
    <div className={`flex h-screen bg-[#fcfdfe] text-slate-900 font-sans overflow-hidden ${isActuarialWorkspace ? 'p-0' : ''}`}>
      {isNavigating && <div className="loading-bar" />}
      
      {isSidebarOpen && !isActuarialWorkspace && (
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!isActuarialWorkspace && (
          <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-8 justify-between shrink-0 sticky top-0 z-40">
            <div className="flex items-center gap-6 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-50 rounded-xl"
              >
                <Menu className="w-5 h-5 text-slate-500" />
              </button>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl w-96 group hover:border-indigo-200 hover:bg-white transition-all shadow-premium-sm cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <div className="bg-transparent border-none text-sm text-slate-400 w-full font-medium text-left">Enterprise Search...</div>
                <span className="text-[10px] font-bold text-slate-300 px-1.5 py-0.5 border border-slate-200 rounded-md group-hover:border-indigo-200 group-hover:text-indigo-400">⌘K</span>
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="hidden xl:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 font-black text-[10px] uppercase tracking-widest group"
              >
                <Command className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Global Command
              </button>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-11 h-11 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all shadow-premium-sm group"
                >
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  {unreadCount && unreadCount.data > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-3xl shadow-premium-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                         New
                      </span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                       <div className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">New Simulation Ready</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">The Q4 Actuarial run has completed successfully.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pl-2 border-l border-slate-100">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Terminal {user?.sub?.slice(0, 4) || 'Alpha'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{roleLabel}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-premium-sm">
                  <img 
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user?.sub || 'default'}&backgroundColor=f1f5f9`} 
                    alt="Avatar" 
                    className="w-7 h-7"
                  />
                </div>
              </div>
            </div>

          </header>
        )}

        {!isActuarialWorkspace && (
          <div className="px-8 mt-4 shrink-0">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-4 flex items-center justify-between shadow-premium-lg border border-white/10 relative overflow-hidden group">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">Sovereign Unified Engine Active</h4>
                    <p className="text-[11px] text-indigo-100/70 font-medium">All department silos integrated into Universal SSoT.</p>
                  </div>
               </div>
               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all z-10">
                 Network Map
               </button>
            </div>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto custom-scrollbar ${isActuarialWorkspace ? 'p-0' : 'p-8'}`}>
          <div className={`${isActuarialWorkspace ? 'max-w-none w-full h-full' : 'max-w-[1600px] mx-auto'}`}>
            {!isActuarialWorkspace && <Breadcrumbs />}
            <Outlet />
          </div>
        </main>

        
        <GlobalAI />
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <CommandMenu isOpen={isCommandMenuOpen} onClose={() => setIsCommandMenuOpen(false)} />
        <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
};
