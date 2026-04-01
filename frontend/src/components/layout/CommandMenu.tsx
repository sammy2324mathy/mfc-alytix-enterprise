import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Calculator, 
  ShieldAlert, 
  LineChart, 
  BrainCircuit, 
  Settings,
  Users,
  Command,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Database,
  CreditCard,
  Shield,
  FileText,
  Gavel,
  BarChart3,
} from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  section: string;
  href: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'dash', name: 'Dashboard', icon: LayoutDashboard, section: 'General', href: '/dashboard' },
  { id: 'ledger', name: 'General Ledger', icon: Calculator, section: 'Finance', href: '/accounting/ledger' },
  { id: 'ar', name: 'Accounts Receivable', icon: Calculator, section: 'Finance', href: '/accounting/ar' },
  { id: 'integrations', name: 'Integration Hub', icon: Database, section: 'Finance', href: '/accounting/integrations' },
  { id: 'payments', name: 'Payment Processing', icon: CreditCard, section: 'Finance', href: '/accounting/payments' },
  { id: 'policies', name: 'Policy Management', icon: Shield, section: 'Insurance', href: '/insurance/policies' },
  { id: 'enroll', name: 'New Enrollment', icon: FileText, section: 'Insurance', href: '/insurance/enroll' },
  { id: 'claims', name: 'Claims Management', icon: Gavel, section: 'Insurance', href: '/insurance/claims' },
  { id: 'analytics', name: 'Policy Analytics', icon: BarChart3, section: 'Insurance', href: '/insurance/analytics' },
  { id: 'risk', name: 'Risk Metrics', icon: ShieldAlert, section: 'Risk', href: '/risk/metrics' },
  { id: 'actuarial', name: 'Actuarial Lab', icon: LineChart, section: 'Actuarial', href: '/actuarial' },
  { id: 'ai', name: 'AI Assistant', icon: BrainCircuit, section: 'Intelligence', href: '/ai' },
  { id: 'users', name: 'User Management', icon: Users, section: 'Admin', href: '/admin/users' },
  { id: 'settings', name: 'System Settings', icon: Settings, section: 'Admin', href: '/admin/settings' },
];

export const CommandMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) || 
    cmd.section.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    if (e.key === 'ArrowUp') setSelectedIndex(prev => Math.max(prev - 1, 0));
    if (e.key === 'Enter') {
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        navigate(selected.href);
        onClose();
      }
    }
  }, [isOpen, filteredCommands, selectedIndex, navigate, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Menu Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        
        {/* Search Bar */}
        <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-50 bg-slate-50/50">
          <Search className="w-6 h-6 text-indigo-600" />
          <input 
            autoFocus
            type="text"
            placeholder="Search for pages, customers, or commands..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
            className="flex-1 bg-transparent border-none text-lg font-bold focus:ring-0 placeholder:text-slate-400 text-slate-800"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-premium-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase">Esc</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center space-y-4">
               <FileSearch className="w-12 h-12 text-slate-200 mx-auto" />
               <p className="text-sm font-bold text-slate-400">No enterprise modules found matching your query.</p>
            </div>
          ) : (
            <div>
               {/* Sections could be grouped more nicely if desired */}
               <div className="grid gap-1">
                  {filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isActive = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => { navigate(cmd.href); onClose(); }}
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-1' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                           <div className={`p-2 rounded-xl border ${isActive ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-100'}`}>
                             <Icon className="w-5 h-5" />
                           </div>
                           <div className="text-left">
                              <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>{cmd.name}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{cmd.section}</p>
                           </div>
                        </div>
                        {isActive && <ArrowRight className="w-5 h-5 animate-in slide-in-from-left-2" />}
                      </button>
                    );
                  })}
               </div>
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between px-8">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 shadow-sm">↵</div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 shadow-sm">↓↑</div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <TrendingUp className="w-3 h-3 text-indigo-600" />
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Enterprise Command v1.0</span>
           </div>
        </div>
      </div>
    </div>
  );
};
