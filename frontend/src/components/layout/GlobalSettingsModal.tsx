import React, { useState } from 'react';
import { 
  X, Shield, Settings2, Users, List, Save, Cpu, ShieldAlert, EyeOff, 
  Globe, Server, Bell, Clock, RefreshCw, Key, Activity, Lock
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface TabProps {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const TABS: TabProps[] = [
  { id: 'governance', label: 'Sovereign Control', icon: Shield },
  { id: 'rbac', label: 'Roles & Access', icon: Users },
  { id: 'systems', label: 'Platform Settings', icon: Globe },
  { id: 'audit', label: 'Global Audit', icon: List },
];

export const GlobalSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('governance');
  const [isSaving, setIsSaving] = useState(false);
  
  // Governance State
  const { isMaskingActive, setIsMaskingActive } = useSecurity();
  const [aiAutonomy, setAiAutonomy] = useState(85);
  const [cryptoStrictness, setCryptoStrictness] = useState('Enforced');
  const [isLockdownActive, setIsLockdownActive] = useState(false);

  // Systems State
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [mfaEnforced, setMfaEnforced] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.6)] border border-slate-100 flex overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Left Sidebar (Tabs) */}
        <div className="w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Settings2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Command Center</h2>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Sovereign Control</p>
              </div>
            </div>

            <nav className="space-y-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs ${
                    activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-premium border border-slate-100' 
                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Commit Changes
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex justify-between items-center p-8 border-b border-slate-50">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{TABS.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Governance Node & Policy Management</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {activeTab === 'governance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-900">AI Autonomy Index</h4>
                    </div>
                    <input 
                      type="range" 
                      value={aiAutonomy} 
                      onChange={e => setAiAutonomy(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual Sign-off</span>
                      <span className="text-xl font-display font-bold text-indigo-600">{aiAutonomy}%</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fully Neural</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <ShieldAlert className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold">Crypto Strictness</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       {['Audit-Only', 'Enforced', 'Strict-SSoT', 'Zero-Trust'].map(mode => (
                         <button 
                           key={mode} 
                           onClick={() => setCryptoStrictness(mode)}
                           className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                             cryptoStrictness === mode ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                           }`}
                         >
                           {mode}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/30 rounded-3xl p-8 border border-indigo-100 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMaskingActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                         <EyeOff className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">Sovereign Data Masking</h4>
                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">Protect PII across all unified nodes</p>
                      </div>
                   </div>
                   <button 
                      onClick={() => setIsMaskingActive(!isMaskingActive)}
                      className={`w-14 h-7 rounded-full flex items-center px-1 transition-all ${isMaskingActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                   >
                     <div className={`w-5 h-5 rounded-full bg-white transition-all ${isMaskingActive ? 'translate-x-7' : 'translate-x-0'}`} />
                   </button>
                </div>

                <div className={`rounded-3xl p-8 border transition-all duration-500 flex items-center justify-between ${isLockdownActive ? 'bg-rose-50 border-rose-200 ring-4 ring-rose-500/10' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLockdownActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-white text-slate-400 border border-slate-100'}`}>
                         <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className={`font-bold transition-colors ${isLockdownActive ? 'text-rose-900' : 'text-slate-900'}`}>Zero-Trust Lockdown</h4>
                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">Sever all external mesh entry points immediately</p>
                      </div>
                   </div>
                   <button 
                      onClick={() => setIsLockdownActive(!isLockdownActive)}
                      className={`w-14 h-7 rounded-full flex items-center px-1 transition-all ${isLockdownActive ? 'bg-rose-600' : 'bg-slate-200'}`}
                   >
                     <div className={`w-5 h-5 rounded-full bg-white transition-all ${isLockdownActive ? 'translate-x-7' : 'translate-x-0'}`} />
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'rbac' && (
              <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                {[
                  { id: 'admin', name: 'Global Administrator', dept: 'Platform', color: 'bg-rose-50 text-rose-600' },
                  { id: 'cro', name: 'Chief Risk Officer', dept: 'Risk', color: 'bg-amber-50 text-amber-600' },
                  { id: 'chief_actuary', name: 'Chief Actuary', dept: 'Actuarial', color: 'bg-indigo-50 text-indigo-600' },
                  { id: 'chief_accountant', name: 'Chief Accountant', dept: 'Finance', color: 'bg-emerald-50 text-emerald-600' },
                  { id: 'lead_ds', name: 'Lead Data Scientist', dept: 'AI Labs', color: 'bg-violet-50 text-violet-600' },
                  { id: 'cco', name: 'Chief Compliance', dept: 'Legal', color: 'bg-sky-50 text-sky-600' },
                ].map(role => (
                   <div key={role.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${role.color}`}>
                         <Key className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">{role.name}</h5>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{role.dept}</p>
                   </div>
                ))}
              </div>
            )}

            {activeTab === 'systems' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Session Expiry (mins)</label>
                      <input 
                        type="number" 
                        value={sessionTimeout} 
                        onChange={e => setSessionTimeout(parseInt(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-mono text-sm"
                      />
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">MFA Enforcement</label>
                         <p className="text-[10px] text-slate-500 font-medium">Require TOTP for all logins</p>
                      </div>
                      <button 
                        onClick={() => setMfaEnforced(!mfaEnforced)}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${mfaEnforced ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                         <div className={`w-4 h-4 rounded-full bg-white transition-all ${mfaEnforced ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Service Health</h5>
                   <div className="space-y-3">
                      {[
                        { name: 'Gateway', url: ':8000', status: 'Online' },
                        { name: 'Accounting', url: ':8002', status: 'Online' },
                        { name: 'Actuarial', url: ':8004', status: 'Online' },
                        { name: 'Neural-AI', url: ':8006', status: 'Standby' },
                      ].map(svc => (
                        <div key={svc.name} className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                           <div className="flex items-center gap-3">
                              <Server className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                              <span className="text-xs font-bold text-slate-700">{svc.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">{svc.url}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${svc.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{svc.status}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                 {[
                   { event: 'Governance Override', user: 'Admin', time: '2 mins ago', icon: Shield },
                   { event: 'Policy Calibration', user: 'Mathew M.', time: '14 mins ago', icon: Activity },
                   { event: 'RBAC Modification', user: 'System', time: '1 hour ago', icon: Lock },
                   { event: 'Masking Deactivation', user: 'CRO', time: '3 hours ago', icon: EyeOff },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                            <log.icon className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">{log.event}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Triggered by <span className="font-bold text-slate-700">{log.user}</span></p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{log.time}</span>
                   </div>
                 ))}
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-center gap-10">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sovereign Guardian Active</span>
             </div>
             <div className="flex items-center gap-2 text-indigo-600">
                <span className="text-[9px] font-black uppercase tracking-widest">Signed & Verified Node</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
